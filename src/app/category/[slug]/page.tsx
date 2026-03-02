"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
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
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-[var(--kama-gray-500)] mb-8">
                    <Link href="/" className="hover:text-[var(--kama-primary)] transition-colors">Bosh sahifa</Link>
                    <span>/</span>
                    <span className="text-[var(--kama-gray-900)] font-medium">{category?.name || "..."}</span>
                </div>

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
                        <div className="flex justify-between items-end mb-8">
                            <h1 className="text-3xl font-bold text-[var(--kama-gray-900)]">
                                {category.name}
                            </h1>
                            <p className="text-sm font-medium text-[var(--kama-gray-500)] pb-1">
                                {category.products.length} ta mahsulot
                            </p>
                        </div>

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
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--kama-primary-light)" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path d="M21 15l-5-5L5 21" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-[var(--kama-gray-700)] mb-2">
                                    Mahsulotlar tez orada paydo bo&apos;ladi
                                </h2>
                                <p className="text-[var(--kama-gray-500)]">
                                    Bu toifada hozircha mahsulot yo&apos;q
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-xl font-semibold text-[var(--kama-gray-700)] mb-2">
                            Toifa topilmadi
                        </h2>
                        <Link href="/" className="btn btn-primary mt-4">
                            Bosh sahifaga qaytish
                        </Link>
                    </div>
                )}
            </main>

            {/* Floating Cart Bar (Sticky Bottom) */}
            {totalItems > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-50 pointer-events-none">
                    <div className="container max-w-4xl mx-auto flex justify-end">
                        <Link
                            href="/cart"
                            className="pointer-events-auto flex items-center gap-4 bg-[var(--kama-primary)] text-white px-6 py-4 rounded-full shadow-xl hover:bg-[var(--kama-primary-dark)] hover:-translate-y-1 transition-all"
                        >
                            <span className="font-bold text-lg">Savatchaga o'tish</span>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold text-sm">
                                {totalItems}
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
