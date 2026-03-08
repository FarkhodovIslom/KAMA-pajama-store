"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import ImageGallery from "@/components/product/ImageGallery";
import SizeSelector from "@/components/product/SizeSelector";

interface ProductImage {
    id: string;
    url: string;
    color: string | null;
    isMain: boolean;
}

interface ProductVariant {
    id: string;
    color: string;
    size: string;
    inStock: boolean;
}

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: ProductImage[];
    variants: ProductVariant[];
}

export default function ProductDetails({ product }: { product: Product }) {
    const { addItem } = useCart();

    const initialColors = [...new Set(product.variants?.map((v) => v.color) || [])];
    const initialSizes = [...new Set(product.variants?.map((v) => v.size) || [])];

    const [selectedColor, setSelectedColor] = useState<string>(initialColors[0] || "");
    const [selectedSize, setSelectedSize] = useState<string>(initialSizes[0] || "");
    const [quantity, setQuantity] = useState(1);
    const [showAddedFeedback, setShowAddedFeedback] = useState(false);

    const colors = initialColors;
    const sizes = initialSizes;

    // Get main image for cart
    const displayImages = product.images.filter(
        (img) => !img.color || img.color === selectedColor
    );
    const mainImage = displayImages[0]?.url || product.images[0]?.url;

    // Check if selected combination is in stock
    const selectedVariant = product.variants?.find(
        (v) => v.color === selectedColor && v.size === selectedSize
    );
    const isInStock = selectedVariant?.inStock ?? true;

    const handleAddToCart = () => {
        if (!isInStock) return;

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            color: selectedColor,
            size: selectedSize,
            quantity,
            image: mainImage,
        });

        setShowAddedFeedback(true);
        setTimeout(() => setShowAddedFeedback(false), 2000);
        setQuantity(1);
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        // Reset size to first available for new color
        const variantForColor = product.variants?.find(v => v.color === color && v.inStock);
        if (variantForColor) {
            setSelectedSize(variantForColor.size);
        }
    };

    return (
        <div className="detail-grid">
            {/* Image Gallery */}
            <ImageGallery
                images={product.images}
                selectedColor={selectedColor}
                productName={product.name}
            />

            {/* Product Info */}
            <div>
                <h1 className="detail-name">{product.name}</h1>

                <div className="detail-price">
                    <span className="detail-price-current">{formatPrice(product.price)}</span>
                </div>

                {product.description && (
                    <p className="detail-desc">{product.description}</p>
                )}

                {/* Color Selection */}
                {colors.length > 0 && (
                    <div className="detail-options">
                        <div className="detail-option-label">
                            Цвет: <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{selectedColor}</span>
                        </div>
                        <div className="detail-colors">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    className={`detail-size ${selectedColor === color ? "active" : ""}`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Selection using SizeSelector component */}
                <SizeSelector
                    sizes={sizes}
                    variants={product.variants || []}
                    selectedColor={selectedColor}
                    selectedSize={selectedSize}
                    onChange={setSelectedSize}
                />

                {/* Quantity & Add to Cart */}
                <div className="detail-actions" style={{ marginTop: 24 }}>
                    <div className="detail-qty">
                        <button
                            className="detail-qty-btn"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <FontAwesomeIcon icon={faMinus} style={{ width: 12, height: 12 }} />
                        </button>
                        <span className="detail-qty-num">{quantity}</span>
                        <button
                            className="detail-qty-btn"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            <FontAwesomeIcon icon={faPlus} style={{ width: 12, height: 12 }} />
                        </button>
                    </div>

                    <button
                        className={`btn-primary detail-add-btn ${showAddedFeedback ? "!bg-[var(--success)]" : ""}`}
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                        style={{ opacity: isInStock ? 1 : 0.5, cursor: isInStock ? "pointer" : "not-allowed" }}
                    >
                        {showAddedFeedback ? (
                            <>
                                <FontAwesomeIcon icon={faCheck} style={{ width: 16, height: 16 }} />
                                Добавлено!
                            </>
                        ) : !isInStock ? (
                            "Нет в наличии"
                        ) : (
                            "Добавить в корзину"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
