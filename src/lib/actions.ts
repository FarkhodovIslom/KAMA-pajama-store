"use server";

import { prisma } from "@/lib/db";
import { CreateOrderSchema } from "@/lib/validations";

export async function createOrderAction(data: any) {
    try {
        const validatedData = CreateOrderSchema.parse(data);

        const newOrder = await prisma.order.create({
            data: {
                total: validatedData.total,
                status: "PENDING",
                customerName: validatedData.customerName,
                customerPhone: validatedData.customerPhone,
                comment: validatedData.comment,
                items: {
                    create: validatedData.items.map((item) => ({
                        productId: item.productId,
                        name: item.name,
                        color: typeof item.color === "string" ? item.color : "Default",
                        size: typeof item.size === "string" ? item.size : "Default",
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        return { success: true, orderId: newOrder.id };
    } catch (error) {
        console.error("Order creation action error:", error);
        return { success: false, error: "Xatolik yuz berdi" };
    }
}
