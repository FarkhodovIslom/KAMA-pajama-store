import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    const { items, total } = body;

    if (!items || !items.length || total === undefined) {
      return NextResponse.json(
        { error: "Items and total are required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        total,
        items: {
          create: items.map((item: {
            productId: string;
            name: string;
            color: string;
            size: string;
            quantity: number;
            price: number;
          }) => ({
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
