import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kama-store.uz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [categories, products] = await Promise.all([
        prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
        prisma.product.findMany({ select: { id: true, updatedAt: true } }),
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/cart`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
    ];

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `${SITE_URL}/category/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: "daily",
        priority: 0.8,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${SITE_URL}/product/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: "daily",
        priority: 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
