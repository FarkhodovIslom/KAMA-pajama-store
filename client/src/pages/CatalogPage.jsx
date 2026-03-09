
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { Button } from '../components/ui/Button';
import { useDebounce } from 'use-debounce';
import { api } from '../lib/api';
import { useCategories } from '../hooks/useCategories';

export function CatalogPage() {
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sizes: [], // Note: the backend API currently does not filter by size/colors yet, but we'll leave it in state for future
    colors: [],
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
    search: searchParams.get('q') || '',
    sort: (searchParams.get('sort') || 'newest'),
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [debouncedSearch] = useDebounce(filters.search, 300);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let active = true;
    
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.set('category', filters.category);
        if (filters.minPrice) queryParams.set('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice);
        if (debouncedSearch) queryParams.set('search', debouncedSearch);
        if (filters.sort && filters.sort !== 'newest') queryParams.set('sort', filters.sort);
        // Assuming page=1 and high limit for now since there's no UI pagination in Catalog yet
        queryParams.set('page', 1);
        queryParams.set('limit', 100);

        const data = await api.get(`/api/products?${queryParams.toString()}`);
        if (active) {
          const mappedProducts = (data.products || []).map(p => ({
            ...p,
            category: p.category_name,
            inStock: p.in_stock,
            image: p.images && p.images.length > 0 ? p.images[0] : null
          }));
          setProducts(mappedProducts);
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();
    
    return () => {
      active = false;
    };
  }, [
    filters.category, 
    filters.minPrice, 
    filters.maxPrice, 
    debouncedSearch, 
    filters.sort
  ]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Sync with URL
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.minPrice) params.set('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice) params.set('maxPrice', String(newFilters.maxPrice));
    if (newFilters.search) params.set('q', newFilters.search);
    if (newFilters.sort !== 'newest') params.set('sort', newFilters.sort);
    setSearchParams(params);
  };
  
  const handleReset = () => {
    setFilters({
      category: '',
      sizes: [],
      colors: [],
      minPrice: null,
      maxPrice: null,
      search: '',
      sort: 'newest',
    });
    setSearchParams({});
  };
  
  const getTitle = () => {
    if (filters.category) {
      const cat = categories.find(c => c.slug === filters.category);
      return cat ? cat.name : filters.category;
    }
    if (debouncedSearch) return `Поиск: "${debouncedSearch}"`;
    return 'Все пижамы';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <div className="flex-1">
            {/* Mobile filter button */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Button
                variant="ghost"
                onClick={() => setSidebarOpen(true)}
              >
                <SlidersHorizontal size={18} className="mr-2" />
                Фильтры
              </Button>
              
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
                className="bg-surface border border-border rounded-button px-3 py-2 text-sm font-semibold"
              >
                <option value="newest">Сначала новые</option>
                <option value="price-asc">Сначала дешевые</option>
                <option value="price-desc">Сначала дорогие</option>
                <option value="popular">По популярности</option>
              </select>
            </div>
            
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="font-borel text-3xl text-text-primary">
                {getTitle()}
              </h1>
              <p className="text-text-muted mt-1">
                {loading ? 'Загрузка...' : `${total} товаров`}
              </p>
            </motion.div>
            
            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface/50 rounded-card aspect-[3/4]"></div>
                ))}
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
