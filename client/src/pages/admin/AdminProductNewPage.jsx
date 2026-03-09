
import { useState, useEffect } from 'react';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useCategories } from '../../hooks/useCategories';
import { api } from '../../lib/api';

export function AdminProductNewPage() {
  const { isAdmin } = useAuth();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [form, setForm] = useState({
    name: '',
    category_id: '',
    price: '',
    in_stock: true,
    popular: false,
    description: '',
  });

  const [variants, setVariants] = useState([{ size: 'Standard', color: 'Base', stockQty: 10 }]);
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      api.get(`/api/products/${id}`)
        .then(data => {
          setForm({
            name: data.name || '',
            category_id: data.category_id ? String(data.category_id) : '',
            price: data.price || '',
            in_stock: data.in_stock,
            popular: data.popular,
            description: data.description || '',
          });
          setExistingImages(data.images || []);
          if (data.variants && data.variants.length > 0) {
            setVariants(data.variants);
          }
        })
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  if (!isAdmin) return <Navigate to="/admin/login" />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const v = [...variants];
    v[index][field] = value;
    setVariants(v);
  };

  const addVariant = () => setVariants([...variants, { size: '', color: '', stockQty: 0 }]);
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category_id', form.category_id);
      formData.append('in_stock', form.in_stock);
      formData.append('popular', form.popular);
      formData.append('variants', JSON.stringify(variants));

      if (isEdit) {
        formData.append('keepImages', JSON.stringify(existingImages));
      }

      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      if (isEdit) {
        await api.put(`/api/products/${id}`, formData);
      } else {
        await api.post('/api/products', formData);
      }
      
      navigate('/admin/products');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Ошибка при сохранении: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Назад к товарам
        </Link>

        <h1 className="font-borel text-3xl mb-8">
          {isEdit ? 'Редактировать товар' : 'Добавить товар'}
        </h1>

        {fetching ? (
          <div>Загрузка...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface rounded-card shadow-soft p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Название</label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Категория</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full border border-border rounded-button px-4 py-3 focus:outline-none focus:border-primary bg-background"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Цена (сум)</label>
                <Input name="price" type="number" value={form.price} onChange={handleChange} min="0" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Описание</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-border rounded-button px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Изображения</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={e => setFiles(e.target.files)}
                className="w-full border border-border rounded-button px-4 py-2"
              />
              {isEdit && existingImages.length > 0 && (
                <div className="mt-2 text-sm text-text-muted">
                  Текущих изображений: {existingImages.length}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Варианты (Размер / Цвет / Кол-во)</label>
              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Input placeholder="Размер (напр. M)" value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)} required />
                    <Input placeholder="Цвет" value={v.color} onChange={e => handleVariantChange(i, 'color', e.target.value)} required />
                    <Input type="number" placeholder="Остаток" value={v.stockQty} onChange={e => handleVariantChange(i, 'stockQty', e.target.value)} required />
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" onClick={addVariant} className="mt-2">
                  <Plus size={16} className="mr-1" /> Добавить вариант
                </Button>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="in_stock" name="in_stock" checked={form.in_stock} onChange={handleChange} className="w-4 h-4 accent-primary" />
                <label htmlFor="in_stock" className="text-sm font-semibold text-text-primary">В наличии</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="popular" name="popular" checked={form.popular} onChange={handleChange} className="w-4 h-4 accent-primary" />
                <label htmlFor="popular" className="text-sm font-semibold text-text-primary">Популярный товар</label>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button type="submit" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить товар'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/admin/products')}>
                Отмена
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
