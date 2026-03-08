import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import ProductCard from "@/components/catalog/ProductCard";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import Pagination from "@/components/catalog/Pagination";
import SortSelect from "@/components/catalog/SortSelect";

const PRODUCTS_PER_PAGE = 12;

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    sizes?: string;
    colors?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const categorySlug = params.category || undefined;
  const sizeFilter = params.sizes?.split(",").filter(Boolean) || [];
  const colorFilter = params.colors?.split(",").filter(Boolean) || [];
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const sort = params.sort || "newest";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (sizeFilter.length > 0 || colorFilter.length > 0) {
    where.variants = {
      some: {
        inStock: true,
        ...(sizeFilter.length > 0 && { size: { in: sizeFilter } }),
        ...(colorFilter.length > 0 && { color: { in: colorFilter } }),
      },
    };
  }

  // Build orderBy
  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "name":
      orderBy = { name: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  // Fetch data
  const [products, totalCount, categories, allVariants] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
      },
      orderBy,
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.productVariant.findMany({
      where: { inStock: true },
      select: { size: true, color: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  // Unique sizes and colors for filters
  const allSizes = [...new Set(allVariants.map((v) => v.size))].sort();
  const allColors = [...new Set(allVariants.map((v) => v.color))].sort();

  // Extract colors for each product
  const getColors = (product: typeof products[0]) => {
    const colorMap = new Map<string, { id: string; name: string; hexCode: string }>();
    product.variants.forEach((variant) => {
      if (!colorMap.has(variant.color)) {
        colorMap.set(variant.color, {
          id: variant.id,
          name: variant.color,
          hexCode: "#E0E0E0",
        });
      }
    });
    return Array.from(colorMap.values());
  };

  // Category title
  const currentCategoryName = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name || "Каталог"
    : "Все пижамы";

  return (
    <main className="catalog-layout">
      <FilterSidebar
        categories={categories}
        allSizes={allSizes}
        allColors={allColors}
        currentCategory={categorySlug}
        currentSizes={sizeFilter}
        currentColors={colorFilter}
        currentMinPrice={params.minPrice}
        currentMaxPrice={params.maxPrice}
      />

      <div className="catalog-main">
        {/* Heading + Sort */}
        <div className="catalog-heading">
          <h1>
            {currentCategoryName}
            <span className="catalog-count">{totalCount} товаров</span>
          </h1>
          <SortSelect currentSort={sort} />
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <>
            <div className="product-grid">
              {products.map((product) => {
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

            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">Ничего не найдено</h2>
            <p className="empty-state-text">Попробуйте изменить фильтры или выбрать другую категорию</p>
          </div>
        )}
      </div>
    </main>
  );
}