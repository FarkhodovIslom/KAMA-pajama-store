"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBagShopping, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  const handleCheckout = () => {
    closeCart();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="cart-overlay open"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className="cart-sidebar"
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1101, transform: "translateX(0)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title">Корзина ({totalItems})</h2>
          <button className="cart-close" onClick={closeCart}>
            <FontAwesomeIcon icon={faXmark} style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <FontAwesomeIcon icon={faShoppingCart} />
            </div>
            <p className="cart-empty-text">Корзина пуста 🌸</p>
            <button className="btn-primary" onClick={closeCart}>
              Продолжить покупки
            </button>
          </div>
        ) : (
          <div className="cart-items">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="cart-item"
              >
                {/* Image */}
                <div className="cart-item-img">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={90}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faBagShopping} style={{ color: "var(--text-muted)" }} />
                  )}
                </div>

                {/* Body */}
                <div className="cart-item-body">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">
                    Размер: {item.size} · {item.color}
                  </div>

                  <div className="cart-item-bottom">
                    {/* Quantity */}
                    <div className="cart-item-qty">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="cart-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span className="cart-subtotal-label">Итого</span>
              <span className="cart-subtotal-value">{formatPrice(totalPrice)}</span>
            </div>
            <Link href="/cart" onClick={closeCart}>
              <button className="btn-primary cart-checkout">
                Оформить заказ
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}