"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMinus, faPlus, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
    onRemove: (productId: string, color: string, size: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const itemKey = `${item.productId}-${item.color}-${item.size}`;

    return (
        <div className="cart-item">
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
                    <FontAwesomeIcon icon={faShoppingBag} style={{ color: "var(--text-muted)" }} />
                )}
            </div>

            {/* Info */}
            <div className="cart-item-body">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-meta">
                    {item.color} · {item.size}
                </div>

                <div className="cart-item-bottom">
                    {/* Quantity */}
                    <div className="cart-item-qty">
                        <button
                            className="cart-qty-btn"
                            onClick={() => onUpdateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                        >
                            <FontAwesomeIcon icon={faMinus} style={{ width: 10, height: 10 }} />
                        </button>
                        <span className="cart-qty-num">{item.quantity}</span>
                        <button
                            className="cart-qty-btn"
                            onClick={() => onUpdateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                        >
                            <FontAwesomeIcon icon={faPlus} style={{ width: 10, height: 10 }} />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="cart-item-price">
                        {formatPrice(item.price * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                        className="cart-item-remove"
                        onClick={() => onRemove(item.productId, item.color, item.size)}
                        aria-label="Удалить"
                    >
                        <FontAwesomeIcon icon={faTrash} style={{ width: 14, height: 14 }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
