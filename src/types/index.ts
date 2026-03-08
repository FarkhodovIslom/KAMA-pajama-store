// Centralized TypeScript interfaces for the KAMA pajama store

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  products?: Product[];
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  price: number;
  discountPrice: number | null;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  color: string | null;
  isMain: boolean;
  sortOrder: number;
  productId: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  inStock: boolean;
  productId: string;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  customerName: string | null;
  customerPhone: string | null;
  comment: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: number;
  productId: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image?: string | null;
}

export interface Admin {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  logoUrl: string | null;
  primaryColor: string;
  storeName: string;
}

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = ["PENDING", "COMPLETED", "CANCELLED"];
