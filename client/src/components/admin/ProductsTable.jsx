
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import { useDebounce } from 'use-debounce';

export function ProductsTable() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const perPage = 10;
  const totalPages = Math.ceil(total / perPage);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: perPage.toString(),
        sort: 'newest',
      });
      
      if (debouncedSearch) {
        query.append('search', debouncedSearch);
      }
      
      const data = await api.get(`/api/products?${query.toString()}`);
      
      // Update data keeping existing schema naming in mind 
      const mapped = (data.products || []).map(p => ({
        ...p,
        category: p.category_name, // ui expects .category 
        inStock: p.in_stock
      }));
      
      setProducts(mapped);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearch]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);
  
  const handleDelete = async (id) => {
    if (confirm('Удалить товар?')) {
      try {
        await api.delete(`/api/products/${id}`);
        // Optionally fetchProducts() or filter locally. Filtering locally is snappier.
        setProducts(products.filter(p => p.id !== id));
        setTotal(t => Math.max(0, t - 1));
      } catch (err) {
        console.error('Failed to delete product', err);
        alert('Ошибка при удалении товара');
      }
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <Input
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link to="/admin/products/new">
          <Button>
            <Plus size={18} className="mr-2" />
            Добавить товар
          </Button>
        </Link>
      </div>
      
      {/* Table */}
      <div className="bg-surface rounded-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-subtle">
              <tr>
                <th className="text-left p-4 font-extrabold text-xs uppercase text-text-muted">ID</th>
                <th className="text-left p-4 font-extrabold text-xs uppercase text-text-muted">Название</th>
                <th className="text-left p-4 font-extrabold text-xs uppercase text-text-muted">Категория</th>
                <th className="text-left p-4 font-extrabold text-xs uppercase text-text-muted">Цена</th>
                <th className="text-left p-4 font-extrabold text-xs uppercase text-text-muted">Статус</th>
                <th className="text-right p-4 font-extrabold text-xs uppercase text-text-muted">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">Загрузка...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">Товары не найдены</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-border hover:bg-subtle/50"
                    >
                      <td className="p-4 text-sm text-text-muted">#{product.id}</td>
                      <td className="p-4 font-semibold text-sm">{product.name}</td>
                      <td className="p-4 text-sm text-text-muted">{product.category}</td>
                      <td className="p-4 font-bold text-primary-dark">{formatPrice(product.price)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-badge text-xs font-bold ${
                          product.inStock 
                            ? 'bg-[#C8E8CC] text-[#2D5A3D]' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {product.inStock ? 'В наличии' : 'Нет'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/products/${product.id}/edit`}>
                            <button className="p-2 rounded-lg hover:bg-subtle text-text-muted hover:text-primary-dark transition-colors">
                              <Edit size={18} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <span className="text-sm text-text-muted">
              Страница {page} из {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
