import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateOrderSchema, formatZodErrors } from "@/lib/validations";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreateOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: formatZodErrors(result.error) },
        { status: 400 }
      );
    }

    const { items, total, customerName, customerPhone, comment } = result.data;

    const order = await prisma.order.create({
      data: {
        total,
        customerName,
        customerPhone,
        comment,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
