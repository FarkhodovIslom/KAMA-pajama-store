
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCategories } from '../../hooks/useCategories';

export function CategoriesTable() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      addCategory({ name: newName.trim(), slug: newSlug.trim() });
      setNewName('');
      setNewSlug('');
      setIsAdding(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
  };

  const handleSave = (id) => {
    if (editName.trim()) {
      updateCategory(id, { name: editName.trim(), slug: editSlug.trim() });
    }
    setEditingId(null);
    setEditName('');
    setEditSlug('');
  };

  const handleDelete = (id) => {
    if (confirm('Удалить категорию? Все товары этой категории потеряют её.')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add new category */}
      <div className="bg-surface rounded-card p-4 shadow-soft">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-3"
            >
              <Input
                placeholder="Название категории"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                autoFocus
              />
              <Input
                placeholder="Slug (опционально)"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Button onClick={handleAdd}>
                <Check size={18} />
              </Button>
              <Button variant="ghost" onClick={() => setIsAdding(false)}>
                <X size={18} />
              </Button>
            </motion.div>
          ) : (
            <Button onClick={() => setIsAdding(true)}>
              <Plus size={18} className="mr-2" />
              Добавить категорию
            </Button>
          )}
        </AnimatePresence>
      </div>

      {/* Categories list */}
      <div className="bg-surface rounded-card shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-subtle">
            <tr>
              <th className="text-left p-4 font-extrabold text-xs uppercase text-text-muted">ID</th>
              <th className="text-left p-4 font-extrabold text-xs uppercase text-text-muted">Название</th>
              <th className="text-left p-4 font-extrabold text-xs uppercase text-text-muted">Slug</th>
              <th className="text-right p-4 font-extrabold text-xs uppercase text-text-muted">Действия</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {categories.map((category) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-t border-border"
                >
                  <td className="p-4 text-sm text-text-muted">#{category.id}</td>
                  <td className="p-4">
                    {editingId === category.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave(category.id)}
                        autoFocus
                        className="max-w-xs"
                      />
                    ) : (
                      <span className="font-semibold">{category.name}</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-text-muted font-mono">
                    {editingId === category.id ? (
                      <Input
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave(category.id)}
                        className="max-w-xs"
                      />
                    ) : (
                      category.slug
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {editingId === category.id ? (
                        <>
                          <button
                            onClick={() => handleSave(category.id)}
                            className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 rounded-lg hover:bg-subtle text-text-muted transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 rounded-lg hover:bg-subtle text-text-muted hover:text-primary-dark transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {categories.length === 0 && (
          <div className="p-8 text-center text-text-muted">
            Категорий пока нет
          </div>
        )}
      </div>
    </div>
  );
}
