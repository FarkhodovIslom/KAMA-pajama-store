"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    categoryName?: string | null;
    discountPrice?: number | null;
    isNew?: boolean;
    isHit?: boolean;
    colors?: { id: string; name: string; hexCode: string }[];
    variants?: { color: string; size: string; inStock: boolean }[];
}

export default function ProductCard({
    id,
    name,
    price,
    image,
    categoryName,
    discountPrice,
    isNew,
    isHit,
    colors = [],
    variants = [],
}: ProductCardProps) {
    const { addItem } = useCart();
    const [showAdded, setShowAdded] = useState(false);

    const hasStock = variants.some((v) => v.inStock) || variants.length === 0;
    const availableSizes = [...new Set(variants.filter((v) => v.inStock).map((v) => v.size))];
    const hasDiscount = discountPrice != null && discountPrice < price;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!hasStock) return;

        const defaultColor = colors[0]?.name || "Белый";
        const defaultSize = availableSizes[0] || "M";

        addItem({
            productId: id,
            name,
            price: discountPrice || price,
            color: defaultColor,
            size: defaultSize,
            quantity: 1,
            image,
        });

        setShowAdded(true);
        setTimeout(() => setShowAdded(false), 2000);
    };

    return (
        <Link href={`/product/${id}`} className="block">
            <div className="product-card">
                {/* Image */}
                <div className="product-image">
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
                        />
                    ) : (
                        <span style={{ opacity: 0.3, fontSize: 48 }}>👗</span>
                    )}

                    {/* Out of Stock Overlay */}
                    {!hasStock && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                            <span className="product-badge out-of-stock">Нет в наличии</span>
                        </div>
                    )}

                    {/* Badges */}
                    <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 5, zIndex: 4 }}>
                        {hasDiscount && (
                            <span className="product-badge sale">
                                −{Math.round((1 - discountPrice! / price) * 100)}%
                            </span>
                        )}
                        {isNew && <span className="product-badge new">Новинка</span>}
                        {isHit && <span className="product-badge hit">Хит</span>}
                    </div>
                </div>

                {/* Body */}
                <div className="product-body">
                    {categoryName && <div className="product-cat">{categoryName}</div>}
                    <div className="product-name">{name}</div>

                    {/* Size tags */}
                    {availableSizes.length > 0 && (
                        <div className="product-sizes">
                            {availableSizes.slice(0, 3).map((s) => (
                                <span key={s} className="product-size-tag">{s}</span>
                            ))}
                            {availableSizes.length > 3 && (
                                <span className="product-size-tag">+{availableSizes.length - 3}</span>
                            )}
                        </div>
                    )}

                    {/* Price */}
                    <div className="product-price">
                        {hasDiscount ? formatPrice(discountPrice!) : formatPrice(price)}
                        {hasDiscount && <span className="price-old">{formatPrice(price)}</span>}
                    </div>

                    {/* Add to Cart */}
                    {hasStock && (
                        <button
                            className="btn-add-cart"
                            onClick={handleQuickAdd}
                            style={showAdded ? { background: "#D4EDDA", borderColor: "var(--success)", color: "var(--success)" } : undefined}
                        >
                            {showAdded ? (
                                <><FontAwesomeIcon icon={faCheck} style={{ width: 12, height: 12 }} /> Добавлено</>
                            ) : (
                                <><FontAwesomeIcon icon={faCartPlus} style={{ width: 12, height: 12 }} /> В корзину</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
