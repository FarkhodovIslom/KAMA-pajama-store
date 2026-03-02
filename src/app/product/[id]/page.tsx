"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import { type Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

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
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

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
                        Mahsulot topilmadi
                    </h1>
                    <Link href="/" className="btn btn-primary">
                        Bosh sahifaga qaytish
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
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-[var(--kama-gray-500)] mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-[var(--kama-primary)] transition-colors">
                        Bosh sahifa
                    </Link>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                    <Link href={`/category/${product.category.slug}`} className="hover:text-[var(--kama-primary)] transition-colors">
                        {product.category.name}
                    </Link>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                    <span className="text-[var(--kama-gray-900)] font-medium truncate max-w-[200px] md:max-w-xs block">
                        {product.name}
                    </span>
                </nav>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-[var(--kama-beige)] rounded-3xl overflow-hidden shadow-sm">
                            {displayImages.length > 0 ? (
                                <Swiper
                                    spaceBetween={10}
                                    navigation={displayImages.length > 1}
                                    pagination={{ clickable: true }}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    modules={[FreeMode, Navigation, Thumbs, Pagination]}
                                    className="h-full w-full [--swiper-theme-color:var(--kama-primary)]"
                                >
                                    {displayImages.map((img) => (
                                        <SwiperSlide key={img.id}>
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={img.url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 834px) 100vw, 50vw"
                                                    priority={img.isMain}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : mainImage ? (
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
                                    <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gray-300)" strokeWidth="1">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path d="M21 15l-5-5L5 21" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {displayImages.length > 1 && (
                            <div className="h-24 md:h-28">
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    spaceBetween={12}
                                    slidesPerView="auto"
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="h-full w-full thumbs-swiper"
                                >
                                    {displayImages.map((img) => (
                                        <SwiperSlide key={`thumb-${img.id}`} className="!w-24 md:!w-28 !h-full opacity-60 transition-opacity [&.swiper-slide-thumb-active]:opacity-100 cursor-pointer rounded-xl overflow-hidden border-2 border-transparent [&.swiper-slide-thumb-active]:border-[var(--kama-primary)] bg-[var(--kama-beige)]">
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={img.url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="112px"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--kama-gray-900)] mb-3 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-4">
                                <p className="text-2xl font-bold text-[var(--kama-primary)]">
                                    {formatPrice(product.price)}
                                </p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--kama-success)] text-white">
                                    Yangi
                                </span>
                            </div>
                        </div>

                        {product.description && (
                            <p className="text-[var(--kama-gray-600)]">
                                {product.description}
                            </p>
                        )}

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div>
                                <label className="block font-medium text-[var(--kama-gray-900)] mb-4">
                                    Rangni tanlang: <span className="text-[var(--kama-gray-500)] ml-1">{selectedColor}</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-6 py-3 rounded-full border transition-all font-semibold ${selectedColor === color
                                                ? "border-[var(--kama-primary)] bg-[var(--kama-primary)] text-white shadow-md"
                                                : "border-[var(--kama-gray-200)] bg-white text-[var(--kama-gray-700)] hover:border-[var(--kama-primary-light)]"
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
                                <div className="flex justify-between items-center mb-4">
                                    <label className="font-medium text-[var(--kama-gray-900)]">
                                        O&apos;lchamni tanlang
                                    </label>
                                    <button className="text-sm text-[var(--kama-primary)] font-medium hover:underline">
                                        O&apos;lchamlar jadvali
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
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
                                                className={`py-3 rounded-2xl border transition-all font-semibold ${!available
                                                    ? "border-[var(--kama-gray-100)] bg-[var(--kama-gray-50)] text-[var(--kama-gray-400)] cursor-not-allowed line-through"
                                                    : selectedSize === size
                                                        ? "border-[var(--kama-primary)] bg-[var(--kama-primary)] text-white shadow-md relative"
                                                        : "border-[var(--kama-gray-200)] bg-white text-[var(--kama-gray-700)] hover:border-[var(--kama-primary-light)]"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Merged Quantity & Add to Cart Button */}
                        <div className="pt-6 mt-6 border-t border-[var(--kama-gray-100)]">
                            <div className="flex items-stretch bg-[var(--kama-primary)] rounded-full shadow-lg overflow-hidden h-16 group transition-transform hover:-translate-y-1">
                                {/* Quantity Adjuster */}
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 text-white">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center font-bold text-xl rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-bold text-lg">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center font-bold text-xl rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Add to Order Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!isInStock}
                                    className={`flex-1 flex items-center justify-center text-white font-bold text-lg transition-colors px-6 ${showAddedFeedback ? "!bg-[var(--kama-success)]" : ""
                                        } ${!isInStock ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {showAddedFeedback ? (
                                        <div className="flex items-center gap-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Qo'shildi!
                                        </div>
                                    ) : !isInStock ? (
                                        "Mavjud emas"
                                    ) : (
                                        "Buyurtmaga qo'shish"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

