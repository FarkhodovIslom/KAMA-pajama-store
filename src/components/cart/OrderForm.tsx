"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/Toast";
import { createOrderAction } from "@/lib/actions";
import { CartItem } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

const orderSchema = z.object({
    name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
    phone: z.string().min(13, "Введите корректный номер телефона").regex(/^\+998\d{9}$/, "Формат: +998 90 123 45 67"),
    comment: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
    items: CartItem[];
    totalPrice: number;
    onSuccess: (orderId: number) => void;
    onClearCart: () => void;
}

export default function OrderForm({ items, totalPrice, onSuccess, onClearCart }: OrderFormProps) {
    const { showToast } = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
    });

    const onSubmit = async (data: OrderFormData) => {
        try {
            const orderData = {
                items: items.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: totalPrice,
                customerName: data.name,
                customerPhone: data.phone,
                comment: data.comment,
            };

            const result = await createOrderAction(orderData);

            if (result.success && result.orderId) {
                onSuccess(result.orderId);
                onClearCart();
                showToast("Заказ успешно оформлен!", "success");
            } else {
                throw new Error(result.error || "Failed to create order");
            }
        } catch (error) {
            console.error("Failed to submit order:", error);
            showToast("Произошла ошибка. Попробуйте ещё раз.", "error");
        }
    };

    return (
        <div className="cart-summary" style={{ position: "sticky", top: 90 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Оформление</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label className="form-label">Ваше имя *</label>
                    <input
                        {...register("name")}
                        className="form-input"
                        placeholder="Например: Сардор"
                    />
                    {errors.name && (
                        <span style={{ color: "var(--error)", fontSize: 12, marginTop: 4, display: "block" }}>
                            {errors.name.message}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Телефон *</label>
                    <input
                        {...register("phone")}
                        className="form-input"
                        placeholder="+998 90 123 45 67"
                    />
                    {errors.phone && (
                        <span style={{ color: "var(--error)", fontSize: 12, marginTop: 4, display: "block" }}>
                            {errors.phone.message}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Комментарий (необязательно)</label>
                    <textarea
                        {...register("comment")}
                        className="form-textarea"
                        placeholder="Дополнительные пожелания..."
                    />
                </div>

                <div className="cart-total-row">
                    <span className="cart-total-label">Товаров: {items.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                    <span className="cart-total-value">{formatPrice(totalPrice)}</span>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: "100%", height: 52, fontSize: 16 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Оформляется..." : "Оформить заказ"}
                </button>
            </form>
        </div>
    );
}
