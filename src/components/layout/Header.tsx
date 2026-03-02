"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

interface HeaderProps {
    cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const isCartPage = pathname === "/cart";

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sticky top-0 z-40 bg-[var(--kama-white)]/80 backdrop-blur-md border-b border-[var(--kama-gray-200)]"
        >
            <div className="container flex items-center justify-between h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-lg shadow-amber-500/30"
                    >
                        <span className="text-white font-bold text-xl">K</span>
                    </motion.div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-[var(--gradient-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                        KAMA
                    </span>
                </Link>

                {/* Search Bar (Hidden on Mobile, shown on tablet+) */}
                <form
                    onSubmit={handleSearch}
                    className="hidden md:flex flex-1 max-w-md mx-8 relative"
                >
                    <input
                        type="text"
                        placeholder="Mahsulotlarni qidirish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--kama-gray-100)] border-transparent focus:bg-white focus:border-[var(--kama-gold)] focus:ring-2 focus:ring-[var(--kama-gold)]/20 transition-all text-sm outline-none placeholder:text-[var(--kama-gray-400)] text-[var(--kama-gray-900)]"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--kama-gray-400)]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </form>

                {/* Cart Button */}
                <Link href="/cart">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex items-center gap-2 px-5 py-3 rounded-full transition-colors ${isCartPage
                            ? "bg-[var(--kama-primary)] text-white shadow-lg shadow-amber-500/25"
                            : "bg-white text-[var(--kama-gray-700)] shadow-sm hover:shadow-md border border-[var(--kama-gray-100)]"
                            }`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <span className="font-semibold">Buyurtma</span>
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--kama-accent)] text-white text-sm font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </motion.div>
                </Link>
            </div>
        </motion.header>
    );
}
