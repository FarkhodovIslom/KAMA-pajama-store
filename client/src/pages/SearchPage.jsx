
import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { products as allProducts } from '../data/mockData';
import { useDebounce } from 'use-debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 300);
  
  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return allProducts.filter(p => p.name.toLowerCase().includes(q));
  }, [debouncedQuery]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };
  
  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-primary/30 text-text-primary rounded px-0.5">
          {part}
        </mark>
      ) : part
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Search form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск товаров..."
                className="pl-12"
              />
            </div>
            <Button type="submit">Найти</Button>
          </div>
        </form>
        
        {/* Results */}
        {debouncedQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="font-borel text-2xl mb-2">
              Результаты поиска: "{debouncedQuery}"
            </h1>
            <p className="text-text-muted mb-8">
              Найдено: {results.length} товаров
            </p>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {results.map((product, i) => (
                  <ProductCardHighlight key={product.id} product={product} query={debouncedQuery} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block text-text-muted"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
                <p className="text-text-muted text-lg mb-2">Ничего не найдено</p>
                <p className="text-text-muted text-sm">Попробуйте другой запрос</p>
              </div>
            )}
          </motion.div>
        )}
        
        {!debouncedQuery && (
          <div className="text-center py-16">
            <SearchIcon size={64} className="mx-auto text-text-muted mb-4" />
            <p className="text-text-muted text-lg">Введите запрос для поиска</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

import { ProductCard } from '../components/catalog/ProductCard';

function ProductCardHighlight({ product, query, index }) {
  return (
    <ProductCard product={product} index={index} />
  );
}
