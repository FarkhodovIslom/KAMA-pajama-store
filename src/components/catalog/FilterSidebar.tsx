"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface FilterSidebarProps {
    categories: { id: string; name: string; slug: string; _count?: { products: number } }[];
    allSizes: string[];
    allColors: string[];
    currentCategory?: string;
    currentSizes?: string[];
    currentColors?: string[];
    currentMinPrice?: string;
    currentMaxPrice?: string;
}

export default function FilterSidebar({
    categories,
    allSizes,
    allColors,
    currentCategory,
    currentSizes = [],
    currentColors = [],
    currentMinPrice,
    currentMaxPrice,
}: FilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const sp = new URLSearchParams(searchParams.toString());
            // Always reset page when filters change
            sp.delete("page");
            for (const [key, value] of Object.entries(params)) {
                if (value === null || value === "") {
                    sp.delete(key);
                } else {
                    sp.set(key, value);
                }
            }
            return sp.toString();
        },
        [searchParams]
    );

    const updateFilter = (params: Record<string, string | null>) => {
        const qs = createQueryString(params);
        router.push(pathname + (qs ? `?${qs}` : ""), { scroll: false });
    };

    const toggleArrayParam = (key: string, value: string, current: string[]) => {
        const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        updateFilter({ [key]: next.length > 0 ? next.join(",") : null });
    };

    const hasFilters = currentCategory || currentSizes.length > 0 || currentColors.length > 0 || currentMinPrice || currentMaxPrice;

    const clearAll = () => {
        router.push(pathname, { scroll: false });
    };

    return (
        <aside className="catalog-sidebar">
            {/* Categories */}
            <div className="sidebar-card">
                <div className="section-title-sm">Категория</div>
                <button
                    className={`cat-btn ${!currentCategory ? "active" : ""}`}
                    onClick={() => updateFilter({ category: null })}
                >
                    Все
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`cat-btn ${currentCategory === cat.slug ? "active" : ""}`}
                        onClick={() => updateFilter({ category: cat.slug })}
                    >
                        {cat.name}
                        {cat._count && (
                            <span style={{ opacity: 0.5, fontSize: 12, marginLeft: 4 }}>
                                {cat._count.products}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Sizes */}
            {allSizes.length > 0 && (
                <div className="sidebar-card">
                    <div className="section-title-sm">Размер</div>
                    <div className="size-tags">
                        {allSizes.map((size) => (
                            <button
                                key={size}
                                className={`size-tag ${currentSizes.includes(size) ? "active" : ""}`}
                                onClick={() => toggleArrayParam("sizes", size, currentSizes)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Colors */}
            {allColors.length > 0 && (
                <div className="sidebar-card">
                    <div className="section-title-sm">Цвет</div>
                    <div className="size-tags">
                        {allColors.map((color) => (
                            <button
                                key={color}
                                className={`size-tag ${currentColors.includes(color) ? "active" : ""}`}
                                onClick={() => toggleArrayParam("colors", color, currentColors)}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Price */}
            <div className="sidebar-card">
                <div className="section-title-sm">Цена (сум)</div>
                <div className="price-row">
                    <input
                        className="price-input"
                        type="number"
                        placeholder="от"
                        defaultValue={currentMinPrice || ""}
                        onBlur={(e) => updateFilter({ minPrice: e.target.value || null })}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                updateFilter({ minPrice: (e.target as HTMLInputElement).value || null });
                            }
                        }}
                    />
                    <input
                        className="price-input"
                        type="number"
                        placeholder="до"
                        defaultValue={currentMaxPrice || ""}
                        onBlur={(e) => updateFilter({ maxPrice: e.target.value || null })}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                updateFilter({ maxPrice: (e.target as HTMLInputElement).value || null });
                            }
                        }}
                    />
                </div>
            </div>

            {/* Reset */}
            {hasFilters && (
                <button className="btn-reset-filters" onClick={clearAll}>
                    <FontAwesomeIcon icon={faFilterCircleXmark} style={{ width: 12, height: 12, marginRight: 6 }} />
                    Сбросить фильтры
                </button>
            )}
        </aside>
    );
}
