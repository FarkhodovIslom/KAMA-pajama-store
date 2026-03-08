"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faShoppingBag, faCog } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";

export default function BottomNav() {
    const pathname = usePathname();
    const { totalItems } = useCart();

    const navItems = [
        { name: "Каталог", href: "/", icon: faHome },
        { name: "Поиск", href: "/search", icon: faSearch },
        {
            name: "Корзина",
            href: "/cart",
            icon: faShoppingBag,
            badge: totalItems > 0 ? (totalItems > 99 ? "99+" : totalItems) : null,
        },
        { name: "Админ", href: "/admin", icon: faCog },
    ];

    if (pathname.includes("/admin")) {
        return null;
    }

    return (
        <div className="bottom-nav">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`bottom-nav-item ${isActive ? "active" : ""}`}
                    >
                        <div style={{ position: "relative" }}>
                            <FontAwesomeIcon icon={item.icon} style={{ width: 22, height: 22 }} />
                            {item.badge && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "-6px",
                                        right: "-8px",
                                        background: "var(--error)",
                                        color: "#fff",
                                        fontSize: "9px",
                                        fontWeight: 800,
                                        width: "16px",
                                        height: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "50%",
                                        border: "2px solid var(--surface)",
                                    }}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}
