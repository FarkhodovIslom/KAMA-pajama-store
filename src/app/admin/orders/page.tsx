"use client";

import { useState, useEffect } from "react";
import { Button, Card, Modal } from "@/components/ui";

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
        PENDING: "Ожидает",
        COMPLETED: "Выполнен",
        CANCELLED: "Отменён",
    };

    const statusColors = {
        PENDING: "bg-[var(--kama-warning)] text-[var(--kama-gray-800)]",
        COMPLETED: "bg-[var(--kama-success)] text-white",
        CANCELLED: "bg-[var(--kama-error)] text-white",
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-[var(--kama-gray-900)]">
                    Заказы
                </h1>
                <div className="flex gap-2">
                    {(["ALL", "PENDING", "COMPLETED", "CANCELLED"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? "bg-[var(--kama-gold)] text-white"
                                    : "bg-white text-[var(--kama-gray-600)] hover:bg-[var(--kama-beige)]"
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
                    <p className="text-[var(--kama-gray-500)]">
                        {filter === "ALL" ? "Заказов пока нет" : "Нет заказов с таким статусом"}
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
                                <div className="w-16 h-16 rounded-xl bg-[var(--kama-beige)] flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[var(--kama-gold-dark)]">
                                        #{order.id}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--kama-gray-900)]">
                                        Заказ #{order.id}
                                    </h3>
                                    <p className="text-sm text-[var(--kama-gray-500)]">
                                        {order.items.length} товаров • {formatPrice(order.total)}
                                    </p>
                                    <p className="text-xs text-[var(--kama-gray-400)]">
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
                            <span className="text-[var(--kama-gray-500)]">Статус:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                                {statusLabels[selectedOrder.status]}
                            </span>
                        </div>

                        <div className="border-t border-[var(--kama-gray-200)] pt-4">
                            <h4 className="font-semibold text-[var(--kama-gray-900)] mb-3">Товары:</h4>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div>
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-[var(--kama-gray-500)]">
                                                {" "}• {item.color} • {item.size} × {item.quantity}
                                            </span>
                                        </div>
                                        <span>{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between font-bold text-lg border-t border-[var(--kama-gray-200)] pt-4">
                            <span>Итого:</span>
                            <span className="text-[var(--kama-gold-dark)]">{formatPrice(selectedOrder.total)}</span>
                        </div>

                        {selectedOrder.status === "PENDING" && (
                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => updateStatus(selectedOrder.id, "CANCELLED")}
                                    fullWidth
                                    className="!text-[var(--kama-error)]"
                                >
                                    Отменить
                                </Button>
                                <Button
                                    onClick={() => updateStatus(selectedOrder.id, "COMPLETED")}
                                    fullWidth
                                >
                                    Выполнен
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "UZS",
        maximumFractionDigits: 0,
    }).format(price);
}
