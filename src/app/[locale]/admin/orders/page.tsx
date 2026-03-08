"use client";

import { useState, useEffect } from "react";
import { Button, Card, Modal } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
    id: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    total: number;
    items: OrderItem[];
    createdAt: string;
    customerName?: string | null;
    customerPhone?: string | null;
    comment?: string | null;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED" | "CANCELLED">("ALL");

    const fetchOrders = async () => {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        // Refresh every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id: number, status: string) => {
        await fetch(`/api/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchOrders();
        setSelectedOrder(null);
    };

    const filteredOrders = filter === "ALL"
        ? orders
        : orders.filter((o) => o.status === filter);

    const statusLabels = {
        PENDING: "Ожидается",
        COMPLETED: "Выполнен",
        CANCELLED: "Отменён",
    };

    const statusColors = {
        PENDING: "bg-[var(--warning)]/20 text-[var(--warning)]",
        COMPLETED: "bg-[var(--success)] text-white",
        CANCELLED: "bg-[var(--error)] text-white",
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-[var(--text)]">
                    Заказы
                </h1>
                <div className="flex gap-2">
                    {(["ALL", "PENDING", "COMPLETED", "CANCELLED"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--subtle)]"
                                }`}
                        >
                            {status === "ALL" ? "Все" : statusLabels[status]}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredOrders.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-[var(--text-muted)]">
                        {filter === "ALL" ? "Нет заказов" : "Нет заказов с таким статусом"}
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredOrders.map((order) => (
                        <Card
                            key={order.id}
                            interactive
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-[var(--subtle)] flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[var(--primary-dark)]">
                                        #{order.id}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--text)]">
                                        {order.customerName ? order.customerName : `Заказ #${order.id}`}
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {order.customerPhone && <span className="font-medium">{order.customerPhone} • </span>}
                                        {order.items.length} шт. • {formatPrice(order.total)}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {new Date(order.createdAt).toLocaleString("ru-RU")}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                                {statusLabels[order.status]}
                            </span>
                        </Card>
                    ))}
                </div>
            )}

            {/* Order Details Modal */}
            <Modal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={`Заказ #${selectedOrder?.id}`}
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[var(--text-muted)]">Статус:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                                {statusLabels[selectedOrder.status]}
                            </span>
                        </div>

                        {/* Customer info */}
                        {(selectedOrder.customerName || selectedOrder.customerPhone || selectedOrder.comment) && (
                            <div className="bg-[var(--subtle)] rounded-xl p-4 space-y-1">
                                <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Клиент</h4>
                                {selectedOrder.customerName && (
                                    <p className="font-semibold text-[var(--text)]">{selectedOrder.customerName}</p>
                                )}
                                {selectedOrder.customerPhone && (
                                    <p className="text-sm text-[var(--text)]">{selectedOrder.customerPhone}</p>
                                )}
                                {selectedOrder.comment && (
                                    <p className="text-sm text-[var(--text-muted)] italic mt-1">&ldquo;{selectedOrder.comment}&rdquo;</p>
                                )}
                            </div>
                        )}

                        <div className="border-t border-[var(--border)] pt-4">
                            <h4 className="font-semibold text-[var(--text)] mb-3">Товары:</h4>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div>
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-[var(--text-muted)]">
                                                {" "}• {item.color} • {item.size} × {item.quantity}
                                            </span>
                                        </div>
                                        <span>{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between font-bold text-lg border-t border-[var(--border)] pt-4">
                            <span>Итого:</span>
                            <span className="text-[var(--primary-dark)]">{formatPrice(selectedOrder.total)}</span>
                        </div>

                        {selectedOrder.status === "PENDING" && (
                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => updateStatus(selectedOrder.id, "CANCELLED")}
                                    fullWidth
                                    className="!text-[var(--error)]"
                                >
                                    Отменить
                                </Button>
                                <Button
                                    onClick={() => updateStatus(selectedOrder.id, "COMPLETED")}
                                    fullWidth
                                >
                                    Выполнить
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
