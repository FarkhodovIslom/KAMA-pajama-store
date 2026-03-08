import { z } from "zod";

// ── Category ────────────────────────────────────────────────────────────

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Название обязательно").max(100),
  slug: z
    .string()
    .min(1, "Slug обязателен")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug может содержать только буквы, цифры и дефисы"),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug может содержать только буквы, цифры и дефисы")
    .optional(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
});

// ── Product ─────────────────────────────────────────────────────────────

const ProductImageInput = z.object({
  url: z.string().min(1),
  color: z.string().optional().nullable(),
  isMain: z.boolean().optional().default(false),
  sortOrder: z.number().int().min(0).optional().default(0),
});

const ProductVariantInput = z.object({
  color: z.string().min(1),
  size: z.string().min(1),
  inStock: z.boolean().optional().default(true),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Название обязательно").max(200),
  slug: z
    .string()
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug может содержать только буквы, цифры и дефисы")
    .optional()
    .nullable(),
  description: z.string().max(5000).optional().nullable(),
  price: z.number().positive("Цена должна быть больше 0"),
  discountPrice: z.number().positive().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  categoryId: z.string().min(1, "Категория обязательна"),
  images: z.array(ProductImageInput).optional(),
  variants: z.array(ProductVariantInput).optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional()
    .nullable(),
  description: z.string().max(5000).optional().nullable(),
  price: z.number().positive().optional(),
  discountPrice: z.number().positive().optional().nullable(),
  isActive: z.boolean().optional(),
  categoryId: z.string().min(1).optional(),
  images: z.array(ProductImageInput).optional(),
});

// ── Order ───────────────────────────────────────────────────────────────

const OrderItemInput = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  color: z.string().min(1),
  size: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemInput).min(1, "Корзина не может быть пустой"),
  total: z.number().positive(),
  customerName: z.string().max(100).optional().nullable(),
  customerPhone: z.string().max(20).optional().nullable(),
  comment: z.string().max(500).optional().nullable(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"], {
    error: "Недопустимый статус заказа",
  }),
});

// ── Helper ──────────────────────────────────────────────────────────────

/**
 * Format Zod validation errors into a flat object for API responses.
 */
export function formatZodErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
