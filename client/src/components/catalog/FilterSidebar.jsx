
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';
import { useCategories } from '../../hooks/useCategories';
import { allSizes } from '../../data/mockData';

export function FilterSidebar({ filters, onChange, onReset, isOpen, onClose }) {
  const { categories } = useCategories();
  const [priceFrom, setPriceFrom] = useState(filters.minPrice || '');
  const [priceTo, setPriceTo] = useState(filters.maxPrice || '');
  
  const handleCategoryChange = (cat) => {
    onChange({ ...filters, category: cat });
  };
  
  const handleSizeToggle = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: newSizes });
  };
  
  const handlePriceApply = () => {
    onChange({
      ...filters,
      minPrice: priceFrom ? Number(priceFrom) : null,
      maxPrice: priceTo ? Number(priceTo) : null,
    });
  };
  
  const sidebarContent = (
    <div className="space-y-5">
      {/* Category */}
      <div className="bg-surface rounded-card p-4 shadow-soft">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-muted mb-3">
          Категория
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-xl text-sm transition-all',
                filters.category === cat.slug
                  ? 'bg-[#F4DCE4] text-primary-dark font-bold'
                  : 'hover:bg-subtle text-text-primary'
              )}
            >
              {cat.name}
            </button>
          ))}
          {filters.category && (
            <button
              onClick={() => handleCategoryChange('')}
              className="w-full text-left px-3 py-2 rounded-xl text-sm text-text-muted hover:bg-subtle"
            >
              Все категории
            </button>
          )}
        </div>
      </div>
      
      {/* Sizes */}
      <div className="bg-surface rounded-card p-4 shadow-soft">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-muted mb-3">
          Размер
        </h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-semibold transition-all',
                filters.sizes.includes(size)
                  ? 'bg-primary text-white'
                  : 'bg-subtle text-text-muted hover:bg-[#F4DCE4]'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* Price */}
      <div className="bg-surface rounded-card p-4 shadow-soft">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-muted mb-3">
          Цена (сум)
        </h3>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="От"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            onBlur={handlePriceApply}
          />
          <Input
            type="number"
            placeholder="До"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            onBlur={handlePriceApply}
          />
        </div>
      </div>
      
      {/* Reset */}
      <Button
        variant="ghost"
        className="w-full"
        onClick={onReset}
      >
        Сбросить фильтры
      </Button>
    </div>
  );
  
  // Mobile drawer
  if (isOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      </AnimatePresence>
    );
  }
  
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        {sidebarContent}
      </aside>
      
      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-background z-50 p-5 overflow-y-auto lg:hidden"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-borel text-xl">Фильтры</h2>
              <button onClick={onClose} className="p-2">
                <X size={24} />
              </button>
            </div>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
