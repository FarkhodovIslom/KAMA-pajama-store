import Link from "next/link";
import { Card } from "@/components/ui";

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-[var(--kama-gray-900)] mb-8">
                Boshqaruv paneli
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                <Link href="/admin/categories">
                    <Card interactive className="h-full">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--kama-lavender)] flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gray-700)" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--kama-gray-900)]">Kategoriyalar</h2>
                                <p className="text-sm text-[var(--kama-gray-500)]">Mahsulot kategoriyalarini boshqarish</p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/products">
                    <Card interactive className="h-full">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--kama-rose)] flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gray-700)" strokeWidth="2">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--kama-gray-900)]">Mahsulotlar</h2>
                                <p className="text-sm text-[var(--kama-gray-500)]">Mahsulot qo&apos;shish va tahrirlash</p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/orders">
                    <Card interactive className="h-full">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--kama-mint)] flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gray-700)" strokeWidth="2">
                                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                                    <rect x="9" y="3" width="6" height="4" rx="1" />
                                    <line x1="9" y1="12" x2="15" y2="12" />
                                    <line x1="9" y1="16" x2="15" y2="16" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--kama-gray-900)]">Buyurtmalar</h2>
                                <p className="text-sm text-[var(--kama-gray-500)]">Buyurtmalarni ko&apos;rish va boshqarish</p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
