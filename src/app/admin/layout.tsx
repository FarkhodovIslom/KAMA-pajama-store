import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--kama-gray-100)]">
            {/* Admin Header */}
            <header className="bg-white border-b border-[var(--kama-gray-200)] sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--kama-gold)] to-[var(--kama-gold-dark)] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">K</span>
                            </div>
                            <span className="font-semibold text-[var(--kama-gray-900)]">KAMA Admin</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/admin/categories"
                                className="text-[var(--kama-gray-600)] hover:text-[var(--kama-gold)] transition-colors"
                            >
                                Kategoriyalar
                            </Link>
                            <Link
                                href="/admin/products"
                                className="text-[var(--kama-gray-600)] hover:text-[var(--kama-gold)] transition-colors"
                            >
                                Mahsulotlar
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="text-[var(--kama-gray-600)] hover:text-[var(--kama-gold)] transition-colors"
                            >
                                Buyurtmalar
                            </Link>
                        </nav>
                    </div>

                    <Link
                        href="/"
                        className="text-sm text-[var(--kama-gray-500)] hover:text-[var(--kama-gold)] transition-colors"
                    >
                        ← Katalog
                    </Link>
                </div>
            </header>

            {/* Admin Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
