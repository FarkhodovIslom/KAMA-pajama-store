"use client";

import { useState, useEffect } from "react";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faBoxOpen,
    faLayerGroup,
    faClipboardList,
    faGear,
    faArrowLeft,
    faBars,
    faXmark,
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
    { href: "/admin", label: "Главная", icon: faHome },
    { href: "/admin/products", label: "Товары", icon: faBoxOpen },
    { href: "/admin/categories", label: "Категории", icon: faLayerGroup },
    { href: "/admin/orders", label: "Заказы", icon: faClipboardList },
    { href: "/admin/settings", label: "Настройки", icon: faGear },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Login page should not have the sidebar chrome
    const isLoginPage = pathname?.includes("/admin/login");

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin" || pathname?.endsWith("/admin");
        return pathname?.includes(href);
    };

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Close mobile sidebar on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    // Login page — render children only, no sidebar
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Get current page title
    const currentPage = NAV_ITEMS.find((item) => isActive(item.href));

    return (
        <div className="admin-root">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="admin-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`admin-sidebar-nav ${sidebarOpen ? "open" : ""} ${collapsed ? "collapsed" : ""}`}
            >
                {/* Logo */}
                <div className="admin-sidebar-logo">
                    <Link href="/admin" className="admin-sidebar-logo-link">
                        <span className="admin-sidebar-logo-icon">🌸</span>
                        {!collapsed && <span className="admin-sidebar-logo-text">KAMA</span>}
                    </Link>
                    {/* Mobile close */}
                    <button
                        className="admin-sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Закрыть меню"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="admin-sidebar-items">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-sidebar-link ${isActive(item.href) ? "active" : ""}`}
                            title={collapsed ? item.label : undefined}
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className="admin-sidebar-link-icon"
                            />
                            {!collapsed && (
                                <span className="admin-sidebar-link-label">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Bottom section */}
                <div className="admin-sidebar-bottom">
                    {/* Collapse toggle (desktop only) */}
                    <button
                        className="admin-sidebar-collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={collapsed ? "Развернуть" : "Свернуть"}
                    >
                        <FontAwesomeIcon
                            icon={collapsed ? faChevronRight : faChevronLeft}
                        />
                    </button>

                    {/* Back to store */}
                    <Link
                        href="/"
                        className="admin-sidebar-link admin-sidebar-back"
                        title={collapsed ? "В каталог" : undefined}
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="admin-sidebar-link-icon"
                        />
                        {!collapsed && (
                            <span className="admin-sidebar-link-label">В каталог</span>
                        )}
                    </Link>
                </div>
            </aside>

            {/* Main content area */}
            <div className={`admin-main ${collapsed ? "sidebar-collapsed" : ""}`}>
                {/* Top bar */}
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button
                            className="admin-mobile-toggle"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Открыть меню"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        <h1 className="admin-topbar-title">
                            {currentPage?.label || "Админ"}
                        </h1>
                    </div>
                </header>

                {/* Page content */}
                <main className="admin-page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}