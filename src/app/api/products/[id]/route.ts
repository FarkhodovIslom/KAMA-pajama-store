import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UpdateProductSchema, formatZodErrors } from "@/lib/validations";
import { verifySession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { isMain: "desc" },
        },
        variants: {
          orderBy: [{ color: "asc" }, { size: "asc" }],
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifySession(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const result = UpdateProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: formatZodErrors(result.error) },
        { status: 400 }
      );
    }

    const { name, slug, description, price, discountPrice, isActive, categoryId, images } = result.data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(price && { price }),
        ...(discountPrice !== undefined && { discountPrice }),
        ...(isActive !== undefined && { isActive }),
        ...(categoryId && { categoryId }),
        ...(images !== undefined && {
          images: {
            deleteMany: {},
            create: images.map((img) => ({
              url: img.url,
              color: img.color,
              isMain: img.isMain,
              sortOrder: img.sortOrder,
            })),
          },
        }),
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifySession(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
