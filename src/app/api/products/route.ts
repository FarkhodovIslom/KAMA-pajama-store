import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
  try {
    const body = await request.json();
    const { name, description, price, categoryId, images, variants } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Name, price and categoryId are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        images: images?.length
          ? {
              create: images.map((img: { url: string; color?: string; isMain?: boolean }) => ({
                url: img.url,
                color: img.color,
                isMain: img.isMain || false,
              })),
            }
          : undefined,
        variants: variants?.length
          ? {
              create: variants.map((v: { color: string; size: string; inStock?: boolean }) => ({
                color: v.color,
                size: v.size,
                inStock: v.inStock ?? true,
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
