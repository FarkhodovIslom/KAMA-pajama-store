"use client";

import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
    productCount: number;
}

export default function CategoryCard({ name, slug, icon, productCount }: CategoryCardProps) {
    return (
        <Link href={`/category/${slug}`} className="block h-full">
            <div className="sidebar-card" style={{ cursor: "pointer", transition: "all var(--transition)", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 12px" }}>
                    {icon ? (
                        <Image src={icon} alt={name} width={32} height={32} style={{ objectFit: "contain" }} />
                    ) : (
                        "👗"
                    )}
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "var(--text)" }}>{name}</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{productCount} товаров</p>
            </div>
        </Link>
    );
}
