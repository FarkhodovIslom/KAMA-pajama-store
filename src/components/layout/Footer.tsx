import Link from "next/link";
import { prisma } from "@/lib/db";
import { TELEGRAM_LINK, INSTAGRAM_LINK } from "@/lib/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";

export default async function Footer() {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        take: 5,
    });

    return (
        <footer className="footer" id="contacts">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div>
                        <div className="footer-brand">🌸 KAMA</div>
                        <p className="footer-desc">
                            Премиальное белье и пижамы. 100% натуральные ткани — шёлк, хлопок и велюр. С 2018 года — качество и комфорт.
                        </p>
                    </div>

                    {/* For Buyers */}
                    <div>
                        <div className="footer-title">Покупателям</div>
                        <div className="footer-links">
                            <Link href="/" className="footer-link">Каталог</Link>
                            <Link href="/search" className="footer-link">Поиск</Link>
                            <Link href="/cart" className="footer-link">Корзина</Link>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <div className="footer-title">Категории</div>
                        <div className="footer-links">
                            {categories.map((cat) => (
                                <Link key={cat.id} href={`/category/${cat.slug}`} className="footer-link">
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="footer-title">Контакты</div>
                        <div className="footer-links">
                            <a href="tel:+998901234567" className="footer-link">+998 90 123-45-67</a>
                            <a href="mailto:hello@kama.uz" className="footer-link">hello@kama.uz</a>
                            <p className="footer-desc" style={{ marginTop: "8px", maxWidth: "200px" }}>
                                Ежедневно с 10:00 до 22:00
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="footer-bottom">
                    <div className="footer-copy">
                        <FontAwesomeIcon icon={faCopyright} /> {new Date().getFullYear()} KAMA Sleepwear. Все права защищены.
                    </div>
                    <div className="footer-social">
                        <a
                            href={TELEGRAM_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn"
                            aria-label="Telegram"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.5 2L2 10.5l6.5 2.5 10-7.5-8.5 8.5 8.5 4z" />
                            </svg>
                        </a>
                        <a
                            href={INSTAGRAM_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn"
                            aria-label="Instagram"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}