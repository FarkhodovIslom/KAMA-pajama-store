"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[var(--kama-gray-50)]">
            <div className="w-20 h-20 rounded-2xl bg-[var(--kama-rose)] flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--kama-primary)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--kama-gray-900)] mb-2">
                Xatolik yuz berdi
            </h1>
            <p className="text-[var(--kama-gray-500)] mb-8 max-w-sm">
                Uzr, kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko&apos;ring.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="px-6 py-3 rounded-xl bg-[var(--kama-primary)] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                    Qayta urinish
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 rounded-xl border border-[var(--kama-gray-200)] text-[var(--kama-gray-700)] font-semibold hover:bg-[var(--kama-gray-100)] transition-colors"
                >
                    Bosh sahifa
                </Link>
            </div>
        </div>
    );
}
