
import { useState, useEffect } from 'react';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useCategories } from '../../hooks/useCategories';
import { api } from '../../lib/api';

const PREDEFINED_COLORS = [
  'Красный', 'Синий', 'Зелёный', 'Чёрный', 'Белый', 'Серый', 
  'Розовый', 'Бордовый', 'Бежевый', 'Коричневый', 'Жёлтый', 'Фиолетовый', 'Голубой'
];

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

  const [variantsState, setVariantsState] = useState({ sizes: '', colors: [], stockQty: '' });
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);

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
            // Group variants for editing
            // Group variants for editing
            const uniqueSizes = [...new Set(data.variants.map(v => v.size))].join(', ');
            const uniqueColors = [...new Set(data.variants.map(v => v.color))];
            // We take the stockQty from the first one as an average/common value for the edit form
            const defaultQty = data.variants[0]?.stockQty || 0;
            
            setVariantsState({
              sizes: uniqueSizes,
              colors: uniqueColors,
              stockQty: defaultQty
            });
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

  const handleVariantChange = (field, value) => {
    setVariantsState(prev => ({ ...prev, [field]: value }));
  };

  const addColor = (color) => {
    if (color && !variantsState.colors.includes(color)) {
      setVariantsState(prev => ({ ...prev, colors: [...prev.colors, color] }));
    }
  };

  const removeColor = (colorToRemove) => {
    setVariantsState(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== colorToRemove)
    }));
  };

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
      // Generate combinations
      const sizeArray = variantsState.sizes.split(',').map(s => s.trim()).filter(Boolean);
      const colorArray = variantsState.colors;
      const generatedVariants = [];
      const stockPerCombo = parseInt(variantsState.stockQty) || 0;
      
      if (sizeArray.length > 0 && colorArray.length > 0) {
        sizeArray.forEach(size => {
          colorArray.forEach(color => {
            generatedVariants.push({ size, color, stockQty: stockPerCombo });
          });
        });
      } else if (sizeArray.length > 0) {
        // Sizes only
        sizeArray.forEach(size => {
          generatedVariants.push({ size, color: '', stockQty: stockPerCombo });
        });
      } else if (colorArray.length > 0) {
        // Colors only
        colorArray.forEach(color => {
          generatedVariants.push({ size: 'Standard', color, stockQty: stockPerCombo });
        });
      } else {
        // Fallback or empty
        generatedVariants.push({ size: 'Standard', color: '', stockQty: stockPerCombo });
      }

      formData.append('variants', JSON.stringify(generatedVariants));

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
              <label className="block text-sm font-semibold text-text-primary mb-2">Варианты</label>
              <div className="grid grid-cols-1 gap-4 p-4 border border-border rounded-lg bg-background">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Размеры (через запятую)</label>
                  <Input 
                    placeholder="M, L, XL" 
                    value={variantsState.sizes} 
                    onChange={e => handleVariantChange('sizes', e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Цвета</label>
                  <div className="relative mb-3">
                    <button
                      type="button"
                      onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                      className="w-full flex items-center justify-between border border-border rounded-button px-4 py-3 text-sm focus:outline-none focus:border-primary bg-background text-left text-text-muted"
                    >
                      <span>Выберите цвет для добавления...</span>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isColorDropdownOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isColorDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-10 w-full mt-2 bg-surface rounded-card shadow-soft border border-border overflow-hidden max-h-60 overflow-y-auto"
                        >
                          {PREDEFINED_COLORS.map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                addColor(c);
                                setIsColorDropdownOpen(false);
                              }}
                              disabled={variantsState.colors.includes(c)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                variantsState.colors.includes(c) 
                                  ? 'opacity-50 cursor-not-allowed bg-subtle text-text-muted'
                                  : 'hover:bg-subtle text-text-primary focus:bg-subtle focus:outline-none'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Selected Colors Badges */}
                  <div className="flex flex-wrap gap-2">
                    {variantsState.colors.map(color => (
                      <span 
                        key={color} 
                        className="inline-flex items-center gap-1 bg-subtle text-text-primary px-3 py-1 rounded-full text-sm font-medium border border-[#F0D8E0]"
                      >
                        {color}
                        <button 
                          type="button" 
                          onClick={() => removeColor(color)}
                          className="hover:text-red-500 transition-colors focus:outline-none"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    {variantsState.colors.length === 0 && (
                      <span className="text-sm text-text-muted italic">Цвета не выбраны</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Остаток (для каждой комбинации)</label>
                  <Input 
                    type="number" 
                    placeholder="Количество" 
                    value={variantsState.stockQty} 
                    onChange={e => handleVariantChange('stockQty', e.target.value)} 
                    required 
                  />
                  <p className="text-xs text-text-muted mt-2">
                    При сохранении будут созданы все возможные комбинации размеров и цветов, каждой будет присвоен указанный остаток.
                  </p>
                </div>
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
