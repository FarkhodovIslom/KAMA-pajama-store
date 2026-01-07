"use client";

import Header from "@/components/layout/Header";
import { CategoryCard } from "@/components/catalog";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: {
    products: number;
  };
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

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
    <div className="min-h-screen bg-[var(--background)]">
      <Header cartCount={totalItems} />

      <main className="container py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-[var(--gradient-primary)] drop-shadow-sm tracking-tight">
            KAMAga xush kelibsiz
          </h1>
          <p className="text-xl text-[var(--kama-gray-600)] max-w-2xl mx-auto font-medium leading-relaxed">
            O&apos;zingiz va yaqinlaringiz uchun mukammal pijamani topish uchun toifani tanlang
          </p>
        </motion.div>

        {/* Categories Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid-categories"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="card h-56 animate-pulse bg-gradient-to-br from-indigo-50/50 to-pink-50/50 border border-white/50"
                />
              ))}
            </motion.div>
          ) : categories.length > 0 ? (
            <motion.div
              key="content"
              variants={container}
              initial="hidden"
              animate="show"
              className="grid-categories"
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={item}
                  className="h-full"
                >
                  <CategoryCard
                    id={category.id}
                    name={category.name}
                    slug={category.slug}
                    icon={category.icon}
                    productCount={category._count.products}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
              className="text-center py-24"
            >
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-tr from-indigo-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10"></div>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--kama-primary)" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--kama-gray-800)] mb-3">
                Katalog bo&apos;sh
              </h2>
              <p className="text-[var(--kama-gray-500)] text-lg">
                Mahsulot toifalari tez orada paydo bo&apos;ladi
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
