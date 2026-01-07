"use client";

import Header from "@/components/layout/Header";
import { CategoryCard } from "@/components/catalog";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: {
    products: number;
  };
}

export default function HomePage() {
  const { totalItems } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Header cartCount={totalItems} />

      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--kama-gray-900)] mb-4">
            KAMAga xush kelibsiz
          </h1>
          <p className="text-lg text-[var(--kama-gray-500)] max-w-2xl mx-auto">
            O&apos;zingiz va yaqinlaringiz uchun mukammal pijamani topish uchun toifani tanlang
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid-categories">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="card h-48 animate-pulse bg-[var(--kama-beige)]"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid-categories">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`animate-slide-up stagger-${Math.min(index % 6, 5) + 1}`}
              >
                <CategoryCard
                  id={category.id}
                  name={category.name}
                  slug={category.slug}
                  icon={category.icon}
                  productCount={category._count.products}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--kama-beige)] flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gold)" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--kama-gray-700)] mb-2">
              Katalog bo&apos;sh
            </h2>
            <p className="text-[var(--kama-gray-500)]">
              Mahsulot toifalari tez orada paydo bo&apos;ladi
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
