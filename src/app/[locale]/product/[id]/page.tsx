import Link from "next/link";
import { Metadata } from "next";
import ProductDetails from "@/components/catalog/ProductDetails";
import ProductCard from "@/components/catalog/ProductCard";
import { prisma } from "@/lib/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kama-store.uz";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { images: true, category: true },
    });

    if (!product) return { title: "Товар не найден | KAMA" };

    const mainImageRel = product.images.find(img => img.isMain)?.url || product.images[0]?.url;
    const mainImage = mainImageRel
        ? mainImageRel.startsWith("http") ? mainImageRel : `${SITE_URL}${mainImageRel}`
        : undefined;

    const title = `${product.name} | KAMA Пижамы`;
    const description = product.description || `Качественная пижама ${product.name} от KAMA. Доставка по Узбекистану.`;

    return {
        title,
        description,
        alternates: { canonical: `${SITE_URL}/product/${id}` },
        openGraph: {
            type: "website",
            locale: "ru_RU",
            title,
            description,
            images: mainImage ? [{ url: mainImage, width: 800, height: 800, alt: product.name }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: mainImage ? [mainImage] : [],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            images: { orderBy: { sortOrder: "asc" } },
            variants: true,
            category: { select: { slug: true, name: true, id: true } },
        },
    });

    if (!product) {
        return (
            <main className="container" style={{ paddingTop: 40, textAlign: "center" }}>
                <div className="empty-state">
                    <div className="empty-state-icon">😔</div>
                    <h1 className="empty-state-title">Товар не найден</h1>
                    <p className="empty-state-text">Возможно, он был удалён или ссылка неверна</p>
                    <Link href="/" className="btn-primary">Вернуться в каталог</Link>
                </div>
            </main>
        );
    }

    // Fetch similar products (same category, excluding current)
    const similarProducts = await prisma.product.findMany({
        where: {
            isActive: true,
            categoryId: product.category.id,
            id: { not: product.id },
        },
        include: {
            images: true,
            variants: true,
            category: true,
        },
        take: 4,
        orderBy: { createdAt: "desc" },
    });

    const getColors = (p: typeof similarProducts[0]) => {
        const colorMap = new Map<string, { id: string; name: string; hexCode: string }>();
        p.variants.forEach((v) => {
            if (!colorMap.has(v.color)) {
                colorMap.set(v.color, { id: v.id, name: v.color, hexCode: "#E0E0E0" });
            }
        });
        return Array.from(colorMap.values());
    };

    return (
        <main className="product-detail">
            <div className="container">
                {/* Breadcrumbs */}
                <nav className="detail-breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <Link href="/">Каталог</Link>
                    <FontAwesomeIcon icon={faChevronRight} style={{ width: 10, height: 10, opacity: 0.4 }} />
                    <Link href={`/?category=${product.category.slug}`}>{product.category.name}</Link>
                    <FontAwesomeIcon icon={faChevronRight} style={{ width: 10, height: 10, opacity: 0.4 }} />
                    <span style={{ color: "var(--text)", fontWeight: 500 }}>{product.name}</span>
                </nav>
            </div>

            <ProductDetails product={product as any} />

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <section className="related">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Похожие товары</h2>
                            <Link href={`/?category=${product.category.slug}`} className="btn-ghost btn-sm">
                                Все в категории
                            </Link>
                        </div>

                        <div className="product-grid">
                            {similarProducts.map((sp) => {
                                const mainImage = sp.images.find((img) => img.isMain)?.url || sp.images[0]?.url;
                                return (
                                    <ProductCard
                                        key={sp.id}
                                        id={sp.id}
                                        name={sp.name}
                                        price={sp.price}
                                        discountPrice={sp.discountPrice}
                                        image={mainImage}
                                        categoryName={sp.category?.name}
                                        colors={getColors(sp)}
                                        variants={sp.variants}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
