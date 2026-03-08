"use client";

export default function SortSelect({ currentSort }: { currentSort: string }) {
    return (
        <form>
            <select
                className="sort-select"
                name="sort"
                defaultValue={currentSort}
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value === "newest") {
                        url.searchParams.delete("sort");
                    } else {
                        url.searchParams.set("sort", e.target.value);
                    }
                    url.searchParams.delete("page");
                    window.location.href = url.toString();
                }}
            >
                <option value="newest">Новинки</option>
                <option value="price_asc">Цена ↑</option>
                <option value="price_desc">Цена ↓</option>
                <option value="name">По названию</option>
            </select>
        </form>
    );
}
