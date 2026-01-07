"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface HeaderProps {
    cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
    const pathname = usePathname();
    const isCartPage = pathname === "/cart";

    return (
        <header className="sticky top-0 z-40 bg-[var(--kama-cream)]/95 backdrop-blur-sm border-b border-[var(--kama-gray-200)]">
            <div className="container flex items-center justify-between h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--kama-gold)] to-[var(--kama-gold-dark)] flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">K</span>
                    </div>
                    <span className="text-2xl font-semibold text-[var(--kama-gray-900)]" style={{ fontFamily: "var(--font-display)" }}>
                        KAMA
                    </span>
                </Link>

                {/* Cart Button */}
                <Link
                    href="/cart"
                    className={`relative flex items-center gap-2 px-5 py-3 rounded-full transition-all ${isCartPage
                        ? "bg-[var(--kama-gold)] text-white"
                        : "bg-white shadow-sm hover:shadow-md"
                        }`}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span className="font-medium">Buyurtma</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--kama-gold)] text-white text-sm font-bold rounded-full flex items-center justify-center shadow">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}
