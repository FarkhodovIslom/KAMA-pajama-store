"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, Modal, Input } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ImageManager, ProductImageInput } from "@/components/admin/ImageManager";
import Image from "next/image";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    categoryId: string;
    category: Category;
    images: { url: string; isMain: boolean; color: string | null; sortOrder: number }[];
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
        images: [] as ProductImageInput[],
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
            images: formData.images,
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
        setFormData({ name: "", description: "", price: 0, categoryId: "", colors: "", sizes: "", images: [] });
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
            description: product.description || "",
            price: product.price,
            categoryId: product.categoryId,
            colors,
            sizes,
            images: product.images.map((img, idx) => ({
                url: img.url,
                isMain: img.isMain,
                color: img.color || null,
                sortOrder: img.sortOrder ?? idx,
            })),
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
            images: [],
        });
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-[var(--text)]">
                    Товары
                </h1>
                <Button onClick={openCreateModal} disabled={categories.length === 0}>
                    + Добавить товар
                </Button>
            </div>

            {categories.length === 0 && !isLoading && (
                <Card className="bg-[var(--warning)]/20 border-none mb-6">
                    <p className="text-[var(--warning)]">
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
                    <p className="text-[var(--text-muted)] mb-4">Нет товаров</p>
                    {categories.length > 0 && (
                        <Button onClick={openCreateModal}>Добавить первый товар</Button>
                    )}
                </Card>
            ) : (
                <div className="space-y-3">
                    {products.map((product) => (
                        <Card key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-[var(--subtle)] flex items-center justify-center overflow-hidden relative">
                                    {product.images[0] ? (
                                        <Image
                                            src={product.images.find(img => img.isMain)?.url || product.images[0].url}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--text)]">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {product.category.name} • {formatPrice(product.price)}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {product.variants.length} вариантов
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>
                                    Редактировать
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(product.id)}
                                    className="text-[var(--error)]"
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
                    <Input
                        label="Название"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                            Категория
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none"
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
                    <Input
                        label="Цена (UZS)"
                        type="number"
                        min="0"
                        step="1000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        required
                    />
                    {!editingProduct && (
                        <>
                            <Input
                                label="Цвета (через запятую)"
                                type="text"
                                value={formData.colors}
                                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                placeholder="Белый, Розовый, Серый"
                            />
                            <Input
                                label="Размеры (через запятую)"
                                type="text"
                                value={formData.sizes}
                                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                placeholder="S, M, L, XL"
                            />
                        </>
                    )}

                    <div className="pt-4 border-t border-[var(--border)]">
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                            Изображения товара
                        </label>
                        <ImageUpload
                            onUploadSuccess={(url) => {
                                setFormData(prev => ({
                                    ...prev,
                                    images: [
                                        ...prev.images,
                                        { url, isMain: prev.images.length === 0, color: null, sortOrder: prev.images.length }
                                    ]
                                }));
                            }}
                            onUploadError={(err) => alert(err)}
                        />
                        <ImageManager
                            images={formData.images}
                            onChange={(newImages) => setFormData({ ...formData, images: newImages })}
                            availableColors={formData.colors ? formData.colors.split(",").map(c => c.trim()).filter(Boolean) : []}
                        />
                    </div>
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
                <p className="text-[var(--text-muted)] mb-6">
                    Это действие нельзя отменить.
                </p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)} fullWidth>
                        Отмена
                    </Button>
                    <Button onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} fullWidth className="!bg-[var(--error)]">
                        Удалить
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

