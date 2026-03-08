"use client";

import ProductCard from "@/components/catalog/ProductCard";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    categoryId: string;
    category?: { name: string };
    images: { id: string; url: string; isMain: boolean; color: string | null; sortOrder: number }[];
    variants: { id: string; color: string; size: string; inStock: boolean }[];
}

export default function SearchProductGrid({ products }: { products: Product[] }) {
    if (products.length === 0) return null;

    // Extract unique colors from variants
    const getColors = (product: Product) => {
        const colorMap = new Map<string, { id: string; name: string; hexCode: string }>();
        product.variants.forEach((variant) => {
            if (!colorMap.has(variant.color)) {
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

    return (
        <div className="product-grid" style={{ marginBottom: "48px" }}>
            {products.map((product) => {
                const mainImage = product.images.find(img => img.isMain)?.url || product.images[0]?.url;

                return (
                    <div key={product.id} className="animate-fade-in">
                        <ProductCard
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={mainImage}
                            categoryName={product.category?.name}
                            colors={getColors(product)}
                            variants={product.variants}
                        />
                    </div>
                );
            })}
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
