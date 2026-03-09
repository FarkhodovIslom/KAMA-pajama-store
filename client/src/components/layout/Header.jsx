
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useDebounce } from 'use-debounce';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount } = useCart();
  
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (debouncedQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };
  
  const isAdmin = location.pathname.startsWith('/admin');
  
  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-borel text-xl text-text-primary flex items-center gap-2">
          Kama Pajamas
        </Link>
        
        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-subtle rounded-pill px-4 py-2 flex-1 max-w-md mx-8">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            placeholder="Поиск пижам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-text-muted"
          />
        </form>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 hover:bg-subtle rounded-full"
          >
            <Search size={20} />
          </button>
          
          <Link
            to="/cart"
            className="relative flex items-center gap-2 bg-primary hover:bg-[#D090A0] text-white px-4 py-2 rounded-pill font-bold text-sm"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Корзина</span>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-primary-dark rounded-full text-xs font-bold flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-subtle rounded-full"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-surface px-4 py-3"
          >
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-subtle rounded-pill px-4 py-2">
              <Search size={18} className="text-text-muted" />
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-text-muted"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X size={18} className="text-text-muted" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
