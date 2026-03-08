"use client";

import { ProductCard } from "@/components/catalog";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    categoryId: string;
    category?: { name: string };
    images: {
        id: string;
        url: string;
        color: string | null;
        isMain: boolean;
        sortOrder: number;
    }[];
    variants: {
        id: string;
        color: string;
        size: string;
        inStock: boolean;
    }[];
}

export default function CategoryProductGrid({ products }: { products: Product[] }) {
    // Extract unique colors from variants
    const getColors = (product: Product) => {
        const colorMap = new Map<string, { id: string; name: string; hexCode: string }>();
        product.variants.forEach((variant) => {
            if (!colorMap.has(variant.color)) {
                // Generate hex code from color name (simple mapping)
                const hexCode = getColorHex(variant.color);
                colorMap.set(variant.color, {
                    id: variant.id,
                    name: variant.color,
                    hexCode,
                });
            }
        });
        return Array.from(colorMap.values());
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--kama-beige)] flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--kama-primary-light)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-[var(--kama-gray-700)] mb-2">
                    Mahsulotlar tez orada paydo bo&apos;ladi
                </h2>
                <p className="text-[var(--kama-gray-500)]">
                    Bu toifada hozircha mahsulot yo&apos;q
                </p>
            </div>
        );
    }

    return (
        <div className="grid-products">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className={`animate-slide-up stagger-${Math.min(index % 6, 5) + 1}`}
                >
                    <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.images.find(img => img.isMain)?.url || product.images[0]?.url}
                        categoryName={product.category?.name}
                        colors={getColors(product)}
                        variants={product.variants}
                    />
                </div>
            ))}
        </div>
    );
}

// Simple color name to hex mapping
function getColorHex(colorName: string): string {
    const colorMap: Record<string, string> = {
        // English
        white: "#FFFFFF",
        black: "#1A1A1A",
        gray: "#808080",
        grey: "#808080",
        pink: "#FFB6C1",
        red: "#E53935",
        blue: "#1E88E5",
        green: "#43A047",
        yellow: "#FDD835",
        purple: "#8E24AA",
        brown: "#795548",
        navy: "#5C6BC0",
        violet: "#9C27B0",
        turquoise: "#00BCD4",
        cream: "#FFFDD0",
        beige: "#F5F5DC",
        // Uzbek
        oq: "#FFFFFF",
        qora: "#1A1A1A",
        kulrang: "#808080",
        pushti: "#FFB6C1",
        qizil: "#E53935",
        "ko'k": "#1E88E5",
        yashil: "#43A047",
        sariq: "#FDD835",
        binafsha: "#8E24AA",
        jigarrang: "#795548",
        zangori: "#5C6BC0",
        fioletoviy: "#9C27B0",
        beji: "#F5F5DC",
    };

    const normalized = colorName.toLowerCase().trim();
    return colorMap[normalized] || "#E0E0E0";
}
