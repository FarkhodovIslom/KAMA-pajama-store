"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { Button, Modal } from "@/components/ui";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
    const {
        items,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
    } = useCart();
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const [orderNumber, setOrderNumber] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        productId: item.productId,
                        name: item.name,
                        color: item.color,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    total: totalPrice,
                }),
            });

            const data = await response.json();
            if (data.id) {
                setOrderNumber(data.id);
                setShowOrderConfirm(true);
                clearCart();
            }
        } catch (error) {
            console.error("Failed to submit order:", error);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen">
            <Header cartCount={totalItems} />

            <main className="container py-8">
                <h1 className="text-3xl font-bold text-[var(--kama-gray-900)] mb-8">
                    Sizning buyurtmangiz
                </h1>

                {items.length === 0 && !orderNumber ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--kama-beige)] flex items-center justify-center">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gold)" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--kama-gray-700)] mb-2">
                            Savatcha bo&apos;sh
                        </h2>
                        <p className="text-[var(--kama-gray-500)] mb-6">
                            Katalogdan mahsulotlar qo&apos;shing
                        </p>
                        <Link href="/">
                            <Button>Katalogga o&apos;tish</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={`${item.productId}-${item.color}-${item.size}`}
                                    className="card p-4 flex gap-4"
                                >
                                    {/* Image */}
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[var(--kama-beige)] flex-shrink-0">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gold-light)" strokeWidth="1">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[var(--kama-gray-900)] truncate">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-[var(--kama-gray-500)]">
                                            {item.color} • {item.size}
                                        </p>
                                        <p className="font-semibold text-[var(--kama-gold-dark)] mt-1">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.productId, item.color, item.size, item.quantity - 1)
                                            }
                                            className="w-10 h-10 rounded-lg bg-[var(--kama-beige)] hover:bg-[var(--kama-gold-light)] transition-colors flex items-center justify-center text-lg font-bold"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center font-semibold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.productId, item.color, item.size, item.quantity + 1)
                                            }
                                            className="w-10 h-10 rounded-lg bg-[var(--kama-beige)] hover:bg-[var(--kama-gold-light)] transition-colors flex items-center justify-center text-lg font-bold"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeItem(item.productId, item.color, item.size)}
                                        className="w-10 h-10 rounded-lg hover:bg-[var(--kama-error)] hover:text-white transition-colors flex items-center justify-center"
                                        aria-label="O&apos;chirish"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {/* Clear Cart Button */}
                            {items.length > 0 && (
                                <button
                                    onClick={() => setShowConfirmClear(true)}
                                    className="text-[var(--kama-gray-500)] hover:text-[var(--kama-error)] transition-colors text-sm"
                                >
                                    Buyurtmani tozalash
                                </button>
                            )}
                        </div>

                        {/* Order Summary */}
                        {items.length > 0 && (
                            <div className="lg:col-span-1">
                                <div className="card sticky top-28">
                                    <h2 className="text-xl font-semibold text-[var(--kama-gray-900)] mb-4">
                                        Jami
                                    </h2>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-[var(--kama-gray-600)]">
                                            <span>Mahsulotlar:</span>
                                            <span>{totalItems} dona</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold text-[var(--kama-gray-900)]">
                                            <span>Summa:</span>
                                            <span>{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        fullWidth
                                        onClick={handleSubmitOrder}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Rasmiylashtirilmoqda..." : "Tamomlash"}
                                    </Button>

                                    <Link
                                        href="/"
                                        className="block text-center text-[var(--kama-gold-dark)] hover:text-[var(--kama-gold)] mt-4"
                                    >
                                        Xaridni davom ettirish
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Clear Confirmation Modal */}
            <Modal
                isOpen={showConfirmClear}
                onClose={() => setShowConfirmClear(false)}
                title="Buyurtmani tozalash?"
            >
                <p className="text-[var(--kama-gray-600)] mb-6">
                    Buyurtmadagi barcha mahsulotlar o&apos;chiriladi. Bu amalni bekor qilib bo&apos;lmaydi.
                </p>
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirmClear(false)}
                        fullWidth
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={() => {
                            clearCart();
                            setShowConfirmClear(false);
                        }}
                        fullWidth
                        className="!bg-[var(--kama-error)]"
                    >
                        Tozalash
                    </Button>
                </div>
            </Modal>

            {/* Order Confirmation Modal */}
            <Modal
                isOpen={showOrderConfirm}
                onClose={() => {
                    setShowOrderConfirm(false);
                    setOrderNumber(null);
                }}
                title="Buyurtma rasmiylashtirildi!"
            >
                <div className="text-center py-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--kama-success)] flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <p className="text-lg text-[var(--kama-gray-700)] mb-2">
                        Buyurtma raqamingiz:
                    </p>
                    <p className="text-4xl font-bold text-[var(--kama-gold-dark)] mb-4">
                        #{orderNumber}
                    </p>
                    <p className="text-[var(--kama-gray-500)] mb-6">
                        Iltimos, mahsulotni olish uchun sotuvchiga murojaat qiling
                    </p>
                    <Link href="/">
                        <Button size="lg" fullWidth>
                            Yangi buyurtma
                        </Button>
                    </Link>
                </div>
            </Modal>
        </div>
    );
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("uz-UZ", {
        style: "currency",
        currency: "UZS",
        maximumFractionDigits: 0,
    }).format(price);
}
