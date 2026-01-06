"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, Modal } from "@/components/ui";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    category: Category;
    images: { url: string; isMain: boolean }[];
    variants: { color: string; size: string }[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        colors: "",
        sizes: "",
    });

    const fetchProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        setIsLoading(false);
    };

    const fetchCategories = async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const colors = formData.colors.split(",").map((c) => c.trim()).filter(Boolean);
        const sizes = formData.sizes.split(",").map((s) => s.trim()).filter(Boolean);

        // Generate variants from colors x sizes
        const variants = colors.flatMap((color) =>
            sizes.map((size) => ({ color, size, inStock: true }))
        );

        const payload = {
            name: formData.name,
            description: formData.description || null,
            price: formData.price,
            categoryId: formData.categoryId,
            variants: editingProduct ? undefined : variants,
        };

        const url = editingProduct
            ? `/api/products/${editingProduct.id}`
            : "/api/products";
        const method = editingProduct ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        setShowModal(false);
        setEditingProduct(null);
        setFormData({ name: "", description: "", price: 0, categoryId: "", colors: "", sizes: "" });
        fetchProducts();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        setShowDeleteConfirm(null);
        fetchProducts();
    };

    const openEditModal = (product: Product) => {
        const colors = [...new Set(product.variants.map((v) => v.color))].join(", ");
        const sizes = [...new Set(product.variants.map((v) => v.size))].join(", ");

        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: "",
            price: product.price,
            categoryId: product.categoryId,
            colors,
            sizes,
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            price: 0,
            categoryId: categories[0]?.id || "",
            colors: "Белый, Розовый, Серый",
            sizes: "S, M, L, XL",
        });
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-[var(--kama-gray-900)]">
                    Товары
                </h1>
                <Button onClick={openCreateModal} disabled={categories.length === 0}>
                    + Добавить товар
                </Button>
            </div>

            {categories.length === 0 && !isLoading && (
                <Card className="bg-[var(--kama-warning)] border-none mb-6">
                    <p className="text-[var(--kama-gray-800)]">
                        Сначала создайте хотя бы одну категорию.{" "}
                        <Link href="/admin/categories" className="underline font-medium">
                            Создать категорию →
                        </Link>
                    </p>
                </Card>
            )}

            {isLoading ? (
                <div className="grid gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-[var(--kama-gray-500)] mb-4">Товаров пока нет</p>
                    {categories.length > 0 && (
                        <Button onClick={openCreateModal}>Создать первый товар</Button>
                    )}
                </Card>
            ) : (
                <div className="space-y-3">
                    {products.map((product) => (
                        <Card key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-[var(--kama-beige)] flex items-center justify-center overflow-hidden">
                                    {product.images[0] ? (
                                        <img
                                            src={product.images[0].url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gold-light)" strokeWidth="1">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--kama-gray-900)]">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-[var(--kama-gray-500)]">
                                        {product.category.name} • {formatPrice(product.price)}
                                    </p>
                                    <p className="text-xs text-[var(--kama-gray-400)]">
                                        {product.variants.length} вариантов
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>
                                    Изменить
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(product.id)}
                                    className="text-[var(--kama-error)]"
                                >
                                    Удалить
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingProduct ? "Редактировать товар" : "Новый товар"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--kama-gray-700)] mb-2">
                            Название
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--kama-gray-200)] focus:border-[var(--kama-gold)] focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--kama-gray-700)] mb-2">
                            Категория
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--kama-gray-200)] focus:border-[var(--kama-gold)] focus:outline-none"
                            required
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--kama-gray-700)] mb-2">
                            Цена (UZS)
                        </label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--kama-gray-200)] focus:border-[var(--kama-gold)] focus:outline-none"
                            required
                        />
                    </div>
                    {!editingProduct && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-[var(--kama-gray-700)] mb-2">
                                    Цвета (через запятую)
                                </label>
                                <input
                                    type="text"
                                    value={formData.colors}
                                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--kama-gray-200)] focus:border-[var(--kama-gold)] focus:outline-none"
                                    placeholder="Белый, Розовый, Серый"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--kama-gray-700)] mb-2">
                                    Размеры (через запятую)
                                </label>
                                <input
                                    type="text"
                                    value={formData.sizes}
                                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--kama-gray-200)] focus:border-[var(--kama-gold)] focus:outline-none"
                                    placeholder="S, M, L, XL"
                                />
                            </div>
                        </>
                    )}
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowModal(false)} fullWidth>
                            Отмена
                        </Button>
                        <Button type="submit" fullWidth>
                            {editingProduct ? "Сохранить" : "Создать"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                isOpen={!!showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(null)}
                title="Удалить товар?"
            >
                <p className="text-[var(--kama-gray-600)] mb-6">
                    Это действие нельзя отменить.
                </p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)} fullWidth>
                        Отмена
                    </Button>
                    <Button onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} fullWidth className="!bg-[var(--kama-error)]">
                        Удалить
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "UZS",
        maximumFractionDigits: 0,
    }).format(price);
}
