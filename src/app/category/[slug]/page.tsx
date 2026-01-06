"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { ProductCard } from "@/components/catalog";
import { useCart } from "@/contexts/CartContext";

interface Product {
    id: string;
    name: string;
    price: number;
    images: { url: string; isMain: boolean }[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
    products: Product[];
}

export default function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const { totalItems } = useCart();
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/categories/by-slug/${slug}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setCategory(data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [slug]);

    return (
        <div className="min-h-screen">
            <Header cartCount={totalItems} />

            <main className="container py-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--kama-gray-600)] hover:text-[var(--kama-gold)] transition-colors mb-6"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Назад к категориям</span>
                </Link>

                {isLoading ? (
                    <>
                        <div className="h-10 w-48 bg-[var(--kama-beige)] rounded-lg animate-pulse mb-8" />
                        <div className="grid-products">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="card aspect-[3/4] animate-pulse bg-[var(--kama-beige)]" />
                            ))}
                        </div>
                    </>
                ) : category ? (
                    <>
                        <h1 className="text-3xl font-bold text-[var(--kama-gray-900)] mb-8">
                            {category.name}
                        </h1>

                        {category.products.length > 0 ? (
                            <div className="grid-products">
                                {category.products.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className={`animate-slide-up stagger-${Math.min(index % 6, 5) + 1}`}
                                    >
                                        <ProductCard
                                            id={product.id}
                                            name={product.name}
                                            price={product.price}
                                            image={product.images[0]?.url}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--kama-beige)] flex items-center justify-center">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gold)" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path d="M21 15l-5-5L5 21" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-[var(--kama-gray-700)] mb-2">
                                    Товары скоро появятся
                                </h2>
                                <p className="text-[var(--kama-gray-500)]">
                                    В этой категории пока нет товаров
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-xl font-semibold text-[var(--kama-gray-700)] mb-2">
                            Категория не найдена
                        </h2>
                        <Link href="/" className="btn btn-primary mt-4">
                            Вернуться на главную
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
