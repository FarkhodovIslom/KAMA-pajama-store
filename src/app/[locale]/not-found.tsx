import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sahifa topilmadi",
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[var(--kama-gray-50)]">
            <div className="w-24 h-24 rounded-2xl bg-[var(--kama-lavender)] flex items-center justify-center mb-6">
                <span className="text-5xl font-black text-[var(--kama-gray-400)]">?</span>
            </div>
            <p className="text-7xl font-black text-[var(--kama-gray-200)] mb-4 leading-none">404</p>
            <h1 className="text-2xl font-bold text-[var(--kama-gray-900)] mb-2">
                Sahifa topilmadi
            </h1>
            <p className="text-[var(--kama-gray-500)] mb-8 max-w-sm">
                Siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi mumkin.
            </p>
            <Link
                href="/"
                className="px-8 py-3 rounded-xl bg-[var(--kama-primary)] text-white font-semibold hover:opacity-90 transition-opacity"
            >
                Bosh sahifaga qaytish
            </Link>
        </div>
    );
}
