"use client";

import { useState, useEffect } from "react";
import { Button, Card, Modal, Input } from "@/components/ui";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    sortOrder: number;
    _count?: { products: number };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", sortOrder: 0 });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const fetchCategories = async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingCategory
            ? `/api/categories/${editingCategory.id}`
            : "/api/categories";
        const method = editingCategory ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: "", slug: "", sortOrder: 0 });
        fetchCategories();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/categories/${id}`, { method: "DELETE" });
        setShowDeleteConfirm(null);
        fetchCategories();
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            sortOrder: category.sortOrder,
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({ name: "", slug: "", sortOrder: categories.length });
        setShowModal(true);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-zа-я0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .replace(/[а-я]/g, (char) => {
                const map: Record<string, string> = {
                    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j",
                    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
                    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
                    ч: "ch", ш: "sh", щ: "sh", ы: "y", э: "e", ю: "yu", я: "ya",
                };
                return map[char] || char;
            });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-[var(--text)]">
                    Категории
                </h1>
                <Button onClick={openCreateModal}>
                    + Добавить категорию
                </Button>
            </div>

            {isLoading ? (
                <div className="grid gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-[var(--text-muted)] mb-4">Нет категорий</p>
                    <Button onClick={openCreateModal}>Добавить первую категорию</Button>
                </Card>
            ) : (
                <div className="space-y-3">
                    {categories.map((category) => (
                        <Card key={category.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--subtle)] flex items-center justify-center text-lg font-semibold text-[var(--primary-dark)]">
                                    {category.sortOrder + 1}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--text)]">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        /{category.slug} • {category._count?.products || 0} товаров
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditModal(category)}
                                >
                                    Редактировать
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(category.id)}
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
                title={editingCategory ? "Редактировать категорию" : "Новая категория"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Название"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                            const name = e.target.value;
                            setFormData({
                                ...formData,
                                name,
                                slug: editingCategory ? formData.slug : generateSlug(name),
                            });
                        }}
                        required
                    />
                    <Input
                        label="URL (slug)"
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                    />
                    <Input
                        label="Порядковый номер"
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowModal(false)} fullWidth>
                            Отмена
                        </Button>
                        <Button type="submit" fullWidth>
                            {editingCategory ? "Сохранить" : "Создать"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(null)}
                title="Удалить категорию?"
            >
                <p className="text-[var(--text-muted)] mb-6">
                    Все товары в этой категории будут удалены. Это действие нельзя отменить.
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
