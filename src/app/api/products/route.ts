import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateProductSchema, formatZodErrors } from "@/lib/validations";
import { verifySession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        images: true,
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await verifySession(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = CreateProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: formatZodErrors(result.error) },
        { status: 400 }
      );
    }

    const { name, slug, description, price, discountPrice, isActive, categoryId, images, variants } = result.data;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        discountPrice,
        isActive,
        categoryId,
        images: images?.length
          ? {
              create: images.map((img) => ({
                url: img.url,
                color: img.color,
                isMain: img.isMain,
                sortOrder: img.sortOrder,
              })),
            }
          : undefined,
        variants: variants?.length
          ? {
              create: variants.map((v) => ({
                color: v.color,
                size: v.size,
                inStock: v.inStock,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
