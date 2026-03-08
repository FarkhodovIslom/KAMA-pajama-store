import Link from "next/link";
import { Metadata } from "next";
import SearchProductGrid from "@/components/catalog/SearchProductGrid";
import { prisma } from "@/lib/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
    title: "Поиск | KAMA Пижамы",
    description: "Поиск товаров в каталоге KAMA.",
};

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const query = typeof params.q === "string" ? params.q : "";

    let products: any[] = [];
    if (query) {
        products = await prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                images: true,
                variants: true,
                category: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }

    return (
        <main className="container" style={{ paddingTop: 28, paddingBottom: 40, minHeight: "60vh" }}>
            <div style={{ marginBottom: 24 }}>
                <Link
                    href="/"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-muted)", textDecoration: "none", marginBottom: 12 }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} style={{ width: 14, height: 14 }} />
                    Вернуться в каталог
                </Link>

                <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 4 }}>
                    Результаты поиска
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                    {query ? (
                        <>По запросу &laquo;{query}&raquo; найдено {products.length} товаров</>
                    ) : (
                        <>Введите запрос для поиска</>
                    )}
                </p>
            </div>

            {products.length > 0 ? (
                <SearchProductGrid products={products} />
            ) : query ? (
                <div className="search-empty">
                    <div className="search-empty-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                        Ничего не найдено
                    </h2>
                    <p style={{ color: "var(--text-muted)", maxWidth: 400, marginBottom: 20, fontSize: 14 }}>
                        По запросу &laquo;{query}&raquo; ничего не найдено. Попробуйте другой запрос.
                    </p>
                    <Link href="/" className="btn-primary">Перейти в каталог</Link>
                </div>
            ) : (
                <div className="search-empty">
                    <div className="search-empty-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                        Введите запрос
                    </h2>
                    <p style={{ color: "var(--text-muted)", maxWidth: 400, fontSize: 14 }}>
                        Начните вводить название товара для поиска
                    </p>
                </div>
            )}
        </main>
    );
}
