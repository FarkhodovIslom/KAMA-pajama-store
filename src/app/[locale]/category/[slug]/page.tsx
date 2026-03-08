import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/catalog/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { prisma } from "@/lib/db";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const categories = await prisma.category.findMany({ select: { slug: true } });
    return categories.map((c) => ({ slug: c.slug }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kama-store.uz";

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const [category, productCount] = await Promise.all([
        prisma.category.findUnique({ where: { slug } }),
        prisma.product.count({ where: { category: { slug }, isActive: true } }),
    ]);

    if (!category) return { title: "Категория не найдена | KAMA" };

    const title = `${category.name} | KAMA Пижамы`;
    const description = `${productCount} товаров. Качественные ${category.name.toLowerCase()} от KAMA. Доставка по Узбекистану.`;

    return {
        title,
        description,
        alternates: { canonical: `${SITE_URL}/category/${slug}` },
        openGraph: { type: "website", locale: "ru_RU", title, description },
        twitter: { card: "summary_large_image", title, description },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                where: { isActive: true },
                include: {
                    images: { orderBy: { sortOrder: "asc" } },
                    variants: true,
                    category: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!category) {
        return (
            <main className="container" style={{ paddingTop: 40, textAlign: "center" }}>
                <div className="empty-state">
                    <div className="empty-state-icon">😔</div>
                    <h1 className="empty-state-title">Категория не найдена</h1>
                    <Link href="/" className="btn-primary">Вернуться в каталог</Link>
                </div>
            </main>
        );
    }

    const getColors = (product: typeof category.products[0]) => {
        const colorMap = new Map<string, { id: string; name: string; hexCode: string }>();
        product.variants.forEach((v) => {
            if (!colorMap.has(v.color)) {
                colorMap.set(v.color, { id: v.id, name: v.color, hexCode: "#E0E0E0" });
            }
        });
        return Array.from(colorMap.values());
    };

    return (
        <main className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
            {/* Breadcrumbs */}
            <nav className="detail-breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                <Link href="/">Каталог</Link>
                <FontAwesomeIcon icon={faChevronRight} style={{ width: 10, height: 10, opacity: 0.4 }} />
                <span style={{ color: "var(--text)", fontWeight: 500 }}>{category.name}</span>
            </nav>

            {/* Heading */}
            <div className="catalog-heading">
                <h1>
                    {category.name}
                    <span className="catalog-count">{category.products.length} товаров</span>
                </h1>
            </div>

            {/* Product Grid */}
            {category.products.length > 0 ? (
                <div className="product-grid">
                    {category.products.map((product) => {
                        const mainImage = product.images.find((img) => img.isMain)?.url || product.images[0]?.url;
                        return (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                discountPrice={product.discountPrice}
                                image={mainImage}
                                categoryName={product.category?.name}
                                colors={getColors(product)}
                                variants={product.variants}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">🌸</div>
                    <h2 className="empty-state-title">Скоро здесь появятся товары</h2>
                    <p className="empty-state-text">В этой категории пока нет товаров</p>
                </div>
            )}
        </main>
    );
}
