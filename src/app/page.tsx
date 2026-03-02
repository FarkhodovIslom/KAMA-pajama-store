"use client";

import Header from "@/components/layout/Header";
import { CategoryCard } from "@/components/catalog";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/layout/Footer";

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

      <main className="container max-w-4xl py-12 flex flex-col items-center">
        {/* Header / Logo Area */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-[0.2em] text-[var(--kama-primary)] uppercase">
            Kama
          </h1>
        </div>

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
                  className="card h-48 animate-pulse bg-white border border-[var(--kama-gray-100)]"
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
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-tr from-amber-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
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

        {/* Call Consultant Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="https://t.me/example"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-sm hover:shadow-md border border-[var(--kama-gray-100)] transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--kama-champagne)] flex items-center justify-center text-[var(--kama-primary)] group-hover:bg-[var(--kama-primary)] group-hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <span className="font-semibold text-[var(--kama-gray-800)]">Konsultantni chaqirish</span>
          </a>
        </motion.div>
      </main>
    </div>
  );
}
