"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/contexts/CartContext";
import CartItemComponent from "@/components/cart/CartItem";
import OrderForm from "@/components/cart/OrderForm";

export default function CartPage() {
    const {
        items,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
    } = useCart();
    const { showToast } = useToast();
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [orderNumber, setOrderNumber] = useState<number | null>(null);

    const handleOrderSuccess = (orderId: number) => {
        setOrderNumber(orderId);
        showToast("Заказ успешно оформлен!", "success");
    };

    // Order confirmation view
    if (orderNumber) {
        return (
            <main className="container">
                <div className="confirmation">
                    <div className="confirmation-icon">
                        <FontAwesomeIcon icon={faCheck} style={{ color: "#155724" }} />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 8 }}>
                        Заказ оформлен!
                    </h1>
                    <p style={{ color: "var(--text-muted)", marginBottom: 8 }}>Номер вашего заказа:</p>
                    <p style={{ fontSize: 36, fontWeight: 800, color: "var(--primary-dark)", marginBottom: 20 }}>
                        #{orderNumber}
                    </p>
                    <p style={{ color: "var(--text-muted)", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
                        Свяжитесь с менеджером для уточнения деталей заказа
                    </p>
                    <Link href="/" className="btn-primary">Новый заказ</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 24 }}>
                Ваш заказ
            </h1>

            {items.length === 0 ? (
                <div className="cart-empty">
                    <div className="cart-empty-icon">
                        <FontAwesomeIcon icon={faShoppingBag} style={{ color: "var(--text-muted)" }} />
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Корзина пуста</h2>
                    <p className="cart-empty-text">Добавьте товары из каталога</p>
                    <Link href="/" className="btn-primary">Перейти в каталог</Link>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
                    {/* Desktop: 2-column layout */}
                    <style>{`@media (min-width: 900px) { .cart-layout { grid-template-columns: 2fr 1fr !important; } }`}</style>
                    <div className="cart-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
                        {/* Items List */}
                        <div>
                            <div className="cart-items-list">
                                {items.map((item) => (
                                    <CartItemComponent
                                        key={`${item.productId}-${item.color}-${item.size}`}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </div>

                            {/* Clear Cart */}
                            {items.length > 0 && (
                                <button
                                    onClick={() => setShowConfirmClear(true)}
                                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "8px 0", fontFamily: "inherit" }}
                                >
                                    Очистить корзину
                                </button>
                            )}
                        </div>

                        {/* Order Form */}
                        <OrderForm
                            items={items}
                            totalPrice={totalPrice}
                            onSuccess={handleOrderSuccess}
                            onClearCart={clearCart}
                        />
                    </div>
                </div>
            )}

            {/* Clear Confirmation */}
            {showConfirmClear && (
                <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
                    onClick={() => setShowConfirmClear(false)}
                >
                    <div
                        style={{ background: "var(--surface)", borderRadius: "var(--radius-card)", padding: 24, maxWidth: 380, width: "100%", boxShadow: "var(--shadow-hover)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Очистить корзину?</h3>
                        <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: 14 }}>
                            Все товары будут удалены. Это действие нельзя отменить.
                        </p>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowConfirmClear(false)}>
                                Отмена
                            </button>
                            <button
                                className="btn-primary"
                                style={{ flex: 1, background: "var(--error)" }}
                                onClick={() => { clearCart(); setShowConfirmClear(false); }}
                            >
                                Очистить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
