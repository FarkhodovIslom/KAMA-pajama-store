"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui";
import ProductCard from "@/components/catalog/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    categoryId: string;
    images: { id: string; url: string; isMain: boolean }[];
    variants: { id: string; color: string; size: string; inStock: boolean }[];
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                // We fetch all products and filter on client side for simplicity
                // In production, this should be a dedicated search endpoint
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Failed to fetch products");
                const allProducts: Product[] = await res.json();

                if (query) {
                    const lowercaseQuery = query.toLowerCase();
                    const filtered = allProducts.filter(p =>
                        p.name.toLowerCase().includes(lowercaseQuery) ||
                        (p.description && p.description.toLowerCase().includes(lowercaseQuery))
                    );
                    setProducts(filtered);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Search error:", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <main className="container py-8 max-w-6xl relative min-h-[calc(100vh-80px-72px)] flex flex-col">
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--kama-gray-500)] hover:text-[var(--kama-gold)] transition-colors mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Bosh sahifaga qaytish
                </Link>

                <h1 className="text-3xl font-bold text-[var(--kama-gray-900)]">
                    Qidiruv natijalari
                </h1>
                <p className="text-[var(--kama-gray-600)] mt-2">
                    &quot;{query}&quot; bo&apos;yicha {isLoading ? "qidirilmoqda..." : `${products.length} ta mahsulot topildi`}
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 flex-1">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex flex-col gap-3">
                            <div className="aspect-[3/4] bg-[var(--kama-beige)] rounded-3xl animate-pulse" />
                            <div className="h-4 bg-[var(--kama-beige)] rounded-full w-3/4 animate-pulse" />
                            <div className="h-4 bg-[var(--kama-beige)] rounded-full w-1/2 animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 flex-1 mb-12">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <ProductCard {...product} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-16 flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--kama-beige)] flex items-center justify-center mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gray-400)" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-[var(--kama-gray-900)] mb-2">Qidiruv natija bermadi</h2>
                    <p className="text-[var(--kama-gray-500)] mb-6 max-w-sm">
                        Kechirasiz, qidiruvingiz bo&apos;yicha hech qanday mahsulot topilmadi. Boshqa so&apos;z bilan qidirib ko&apos;ring.
                    </p>
                    <Link href="/">
                        <button className="btn btn-primary">
                            Katalogni ko&apos;rish
                        </button>
                    </Link>
                </Card>
            )}

            <Footer />
            <BottomNav />
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container py-8 text-center text-[var(--kama-gray-500)]">Yuklanmoqda...</div>}>
            <SearchResults />
        </Suspense>
    );
}
