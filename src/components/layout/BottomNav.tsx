"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

export default function BottomNav() {
    const pathname = usePathname();
    const { totalItems } = useCart();

    const navItems = [
        {
            name: "Asosiy",
            href: "/",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            )
        },
        {
            name: "Savat",
            href: "/cart",
            icon: (
                <div className="relative">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[var(--kama-error)] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {totalItems > 99 ? '99+' : totalItems}
                        </span>
                    )}
                </div>
            )
        },
        {
            name: "Admin",
            href: "/admin",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
            )
        }
    ];

    // Don't show bottom nav in admin routes to prevent conflicts with admin layout
    if (pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
            <div className="bg-white/90 backdrop-blur-md border-t border-[var(--kama-gray-200)] px-6 py-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
                <nav className="flex items-center justify-around h-14 relative">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center w-full h-full text-[var(--kama-gray-500)] transition-colors"
                            >
                                <div className={`relative z-10 flex flex-col items-center gap-1 transition-transform duration-200 ${isActive ? 'text-[var(--kama-gold)] -translate-y-1' : 'hover:text-[var(--kama-gray-900)]'}`}>
                                    {item.icon}
                                    <span className={`text-[10px] font-medium transition-opacity ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                        {item.name}
                                    </span>
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-[var(--kama-gold)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
