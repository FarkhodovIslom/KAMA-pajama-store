import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Ожидается",
    COMPLETED: "Выполнен",
    CANCELLED: "Отменён",
};

const STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
    COMPLETED: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
    CANCELLED: "bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20",
};

export default async function AdminDashboard() {
    const [productCount, categoryCount, pendingCount, revenueData, recentOrders] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: "COMPLETED" },
        }),
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                status: true,
                total: true,
                createdAt: true,
                customerName: true,
                customerPhone: true,
            },
        }),
    ]);

    const totalRevenue = revenueData._sum.total ?? 0;

    const stats = [
        {
            label: "Товаров",
            value: productCount,
            format: "number",
            bg: "bg-[var(--primary)] text-white",
            href: "/admin/products",
            icon: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
        },
        {
            label: "Ожидают",
            value: pendingCount,
            format: "number",
            bg: "bg-[var(--warning)]/20 text-[var(--warning)]",
            href: "/admin/orders",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        },
        {
            label: "Выручка",
            value: totalRevenue,
            format: "currency",
            bg: "bg-[var(--success)] text-white",
            href: "/admin/orders",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        },
        {
            label: "Категорий",
            value: categoryCount,
            format: "number",
            bg: "bg-[var(--info)] text-white",
            href: "/admin/categories",
            icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
        },
    ];

    const menuItems = [
        { href: "/admin/categories", label: "Категории", desc: "Управление категориями товаров", bg: "bg-[var(--info)]" },
        { href: "/admin/products", label: "Товары", desc: "Добавление и редактирование товаров", bg: "bg-[var(--primary)]" },
        { href: "/admin/orders", label: "Заказы", desc: "Просмотр и управление заказами", bg: "bg-[var(--success)]" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--text)]">Панель управления</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <div className="bg-[var(--surface)] rounded-[var(--radius-card)] p-4 md:p-5 shadow-sm border border-[var(--border)] hover:shadow-[var(--shadow-hover)] hover:border-[var(--primary)]/30 hover:-translate-y-0.5 transition-all duration-300 group">
                            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={stat.icon} />
                                </svg>
                            </div>
                            <p className="text-lg md:text-xl font-bold text-[var(--text)]">{stat.format === "currency" ? formatPrice(stat.value) : stat.value}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-card)] shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[var(--border)]">
                    <h2 className="font-semibold text-[var(--text)]">Последние заказы</h2>
                    <Link href="/admin/orders" className="text-sm text-[var(--primary-dark)] hover:underline font-medium">
                        Все заказы
                    </Link>
                </div>
                {recentOrders.length === 0 ? (
                    <p className="text-center py-10 text-[var(--text-muted)] text-sm">Пока нет заказов</p>
                ) : (
                    <div className="divide-y divide-[var(--border)]">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 hover:bg-[var(--subtle)] transition-colors">
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-[var(--text)] text-sm truncate">
                                        #{String(order.id).slice(0, 8)} — {order.customerName ?? "Noma'lum"}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                                        {order.customerPhone || "Телефон не указан"} · {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                    <p className="font-semibold text-sm text-[var(--text)] whitespace-nowrap">
                                        {formatPrice(order.total)}
                                    </p>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                        {STATUS_LABEL[order.status] || order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {menuItems.map((item) => (
                    <Link key={item.href} href={item.href} className="bg-[var(--surface)] rounded-[var(--radius-card)] p-4 md:p-5 shadow-sm border border-[var(--border)] hover:shadow-[var(--shadow-hover)] hover:border-[var(--primary)]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 group">
                        <div className={`w-10 h-10 rounded-xl ${item.bg} flex-shrink-0 group-hover:scale-110 transition-transform`} />
                        <div>
                            <p className="font-semibold text-sm text-[var(--text)]">{item.label}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}