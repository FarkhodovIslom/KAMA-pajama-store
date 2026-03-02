import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-[var(--kama-gray-200)] mt-20 pb-20 md:pb-12">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <Link href="/" className="inline-block flex-shrink-0 mb-4">
                            <span className="font-display font-medium text-2xl tracking-wide bg-gradient-to-r from-[var(--kama-gold-dark)] to-[var(--kama-gold-light)] bg-clip-text text-transparent">
                                KAMA
                            </span>
                        </Link>
                        <p className="text-[var(--kama-gray-500)] mb-6 text-sm leading-relaxed max-w-xs">
                            Premium pijamalar va uy kiyimlari kolleksiyasi. Qulaylik va nafislik uyg&apos;unligi sizning tanlovingiz.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-[var(--kama-beige)] flex items-center justify-center text-[var(--kama-gray-600)] hover:text-[var(--kama-gold)] hover:bg-[var(--kama-gold-light)] transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[var(--kama-beige)] flex items-center justify-center text-[var(--kama-gray-600)] hover:text-[var(--kama-gold)] hover:bg-[var(--kama-gold-light)] transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-[var(--kama-gray-900)] mb-4">Katalog</h3>
                        <ul className="space-y-3">
                            <li><Link href="/category/ayollar" className="text-[var(--kama-gray-500)] hover:text-[var(--kama-gold)] transition-colors text-sm">Ayollar uchun</Link></li>
                            <li><Link href="/category/erkaklar" className="text-[var(--kama-gray-500)] hover:text-[var(--kama-gold)] transition-colors text-sm">Erkaklar uchun</Link></li>
                            <li><Link href="/category/bolalar" className="text-[var(--kama-gray-500)] hover:text-[var(--kama-gold)] transition-colors text-sm">Bolalar uchun</Link></li>
                            <li><Link href="/category/oilaviy" className="text-[var(--kama-gray-500)] hover:text-[var(--kama-gold)] transition-colors text-sm">Oilaviy to&apos;plamlar</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-[var(--kama-gray-900)] mb-4">Ma&apos;lumot</h3>
                        <ul className="space-y-3 relative text-sm text-[var(--kama-gray-500)]">
                            <li className="flex items-start gap-3">
                                <svg className="mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span>Har kuni: 09:00 dan 22:00 gacha</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>Toshkent shahri, O&apos;zbekiston</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--kama-gray-100)] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[var(--kama-gray-400)] gap-4">
                    <p>&copy; {new Date().getFullYear()} KAMA Pajama Store. Barcha huquqlar himoyalangan.</p>
                </div>
            </div>
        </footer>
    );
}
