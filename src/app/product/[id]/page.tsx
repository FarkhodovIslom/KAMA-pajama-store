"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui";
import { useCart } from "@/contexts/CartContext";

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
    category: {
        name: string;
        slug: string;
    };
}

export default function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { totalItems, addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [showAddedFeedback, setShowAddedFeedback] = useState(false);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setProduct(data);
                    // Set default selections
                    const colors = [...new Set(data.variants?.map((v: ProductVariant) => v.color) || [])];
                    const sizes = [...new Set(data.variants?.map((v: ProductVariant) => v.size) || [])];
                    if (colors.length > 0) setSelectedColor(colors[0] as string);
                    if (sizes.length > 0) setSelectedSize(sizes[0] as string);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header cartCount={totalItems} />
                <main className="container py-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="aspect-square bg-[var(--kama-beige)] rounded-3xl animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-8 w-3/4 bg-[var(--kama-beige)] rounded animate-pulse" />
                            <div className="h-6 w-1/4 bg-[var(--kama-beige)] rounded animate-pulse" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen">
                <Header cartCount={totalItems} />
                <main className="container py-8 text-center">
                    <h1 className="text-2xl font-semibold text-[var(--kama-gray-700)] mb-4">
                        Товар не найден
                    </h1>
                    <Link href="/" className="btn btn-primary">
                        Вернуться на главную
                    </Link>
                </main>
            </div>
        );
    }

    const colors = [...new Set(product.variants?.map((v) => v.color) || [])];
    const sizes = [...new Set(product.variants?.map((v) => v.size) || [])];

    // Filter images by selected color
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

    return (
        <div className="min-h-screen">
            <Header cartCount={totalItems} />

            <main className="container py-8">
                {/* Back Button */}
                <Link
                    href={`/category/${product.category.slug}`}
                    className="inline-flex items-center gap-2 text-[var(--kama-gray-600)] hover:text-[var(--kama-gold)] transition-colors mb-6"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Назад к {product.category.name}</span>
                </Link>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <div className="relative aspect-square bg-gradient-to-br from-[var(--kama-beige)] to-[var(--kama-rose)] rounded-3xl overflow-hidden">
                        {mainImage ? (
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 834px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gold-light)" strokeWidth="1">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--kama-gray-900)] mb-2">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-semibold text-[var(--kama-gold-dark)]">
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        {product.description && (
                            <p className="text-[var(--kama-gray-600)]">
                                {product.description}
                            </p>
                        )}

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-[var(--kama-gray-700)] mb-3">
                                    Цвет: <span className="font-normal">{selectedColor}</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`min-w-[60px] h-[60px] px-4 rounded-xl border-2 transition-all font-medium ${selectedColor === color
                                                    ? "border-[var(--kama-gold)] bg-[var(--kama-gold-light)] text-[var(--kama-gray-900)]"
                                                    : "border-[var(--kama-gray-200)] bg-white text-[var(--kama-gray-600)] hover:border-[var(--kama-gold-light)]"
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {sizes.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-[var(--kama-gray-700)] mb-3">
                                    Размер
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {sizes.map((size) => {
                                        const variant = product.variants?.find(
                                            (v) => v.color === selectedColor && v.size === size
                                        );
                                        const available = variant?.inStock ?? true;

                                        return (
                                            <button
                                                key={size}
                                                onClick={() => available && setSelectedSize(size)}
                                                disabled={!available}
                                                className={`min-w-[60px] h-[60px] px-4 rounded-xl border-2 transition-all font-medium ${!available
                                                        ? "border-[var(--kama-gray-200)] bg-[var(--kama-gray-100)] text-[var(--kama-gray-400)] cursor-not-allowed line-through"
                                                        : selectedSize === size
                                                            ? "border-[var(--kama-gold)] bg-[var(--kama-gold-light)] text-[var(--kama-gray-900)]"
                                                            : "border-[var(--kama-gray-200)] bg-white text-[var(--kama-gray-600)] hover:border-[var(--kama-gold-light)]"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--kama-gray-700)] mb-3">
                                Количество
                            </label>
                            <div className="inline-flex items-center gap-4 bg-white rounded-xl border border-[var(--kama-gray-200)] p-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 rounded-lg bg-[var(--kama-beige)] hover:bg-[var(--kama-gold-light)] transition-colors flex items-center justify-center text-xl font-bold"
                                >
                                    −
                                </button>
                                <span className="w-12 text-center text-xl font-semibold">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 rounded-lg bg-[var(--kama-beige)] hover:bg-[var(--kama-gold-light)] transition-colors flex items-center justify-center text-xl font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="pt-4">
                            <Button
                                size="lg"
                                fullWidth
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                                className={showAddedFeedback ? "!bg-[var(--kama-success)]" : ""}
                            >
                                {showAddedFeedback ? (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Добавлено!
                                    </>
                                ) : !isInStock ? (
                                    "Нет в наличии"
                                ) : (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <path d="M16 10a4 4 0 0 1-8 0" />
                                        </svg>
                                        Добавить в заказ
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
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
