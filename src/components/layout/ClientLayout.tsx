"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
    children: ReactNode;
    header: ReactNode;
    footer: ReactNode;
    bottomNav: ReactNode;
    cartSidebar: ReactNode;
}

export default function ClientLayout({
    children,
    header,
    footer,
    bottomNav,
    cartSidebar,
}: ClientLayoutProps) {
    const pathname = usePathname();
    const isAdmin = pathname?.includes("/admin") || false;

    if (isAdmin) {
        return (
            <div className="admin-font-override flex-1 flex flex-col">
                {children}
            </div>
        );
    }

    return (
        <>
            {header}
            {cartSidebar}
            <div className="flex-1 flex flex-col" style={{ paddingTop: "66px" }}>
                {children}
            </div>
            {footer}
            {bottomNav}
        </>
    );
}
