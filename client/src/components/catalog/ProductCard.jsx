
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatPrice } from '../../lib/utils';
import { getProductPlaceholder } from '../../data/mockData';
import { useCart } from '../../hooks/useCart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFan, faWater, faChild } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../lib/api';

export function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const placeholder = getProductPlaceholder(product);
  const firstVariant = product.variants.find(v => v.stockQty > 0) || product.variants[0];
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (firstVariant && product.inStock) {
      addItem(product, firstVariant, 1);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="group bg-surface rounded-card overflow-hidden shadow-soft transition-all duration-200 hover:shadow-soft-hover hover:-translate-y-1">
          {/* Image */}
          <div 
            className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
            style={{ backgroundColor: !product.image ? placeholder : undefined }}
          >
            {product.image && (
              <img 
                src={`${BASE_URL}${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
            
            {!product.image && (
              <span className="opacity-80">
                {product.category === 'Женские' && <FontAwesomeIcon icon={faFan} />}
                {product.category === 'Мужские' && <FontAwesomeIcon icon={faWater} />}
                {product.category === 'Детские' && <FontAwesomeIcon icon={faChild} />}
              </span>
            )}

            {product.inStock ? null : (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white/90 px-4 py-2 rounded-badge font-bold text-text-primary">
                  Нет в наличии
                </span>
              </div>
            )}
            <Badge variant={product.badge} />
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-text-muted font-semibold mb-1">
              {product.category}
            </p>
            <h3 className="font-extrabold text-sm mb-2 line-clamp-2 text-text-primary group-hover:text-primary-dark transition-colors">
              {product.name}
            </h3>
            
            {/* Sizes */}
            <div className="flex flex-wrap gap-1 mb-3">
              {product.variants.slice(0, 4).map((v) => (
                <span 
                  key={v.id}
                  className={`px-2 py-0.5 rounded-lg text-[11px] ${
                    v.stockQty > 0 
                      ? 'bg-subtle text-text-muted' 
                      : 'bg-gray-100 text-gray-400 line-through'
                  }`}
                >
                  {v.size}
                </span>
              ))}
              {product.variants.length > 4 && (
                <span className="px-2 py-0.5 rounded-lg text-[11px] bg-subtle text-text-muted">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
            
            {/* Price & Button */}
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-primary-dark text-lg">
                {formatPrice(product.price)}
              </span>
              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex items-center gap-1.5 bg-subtle border border-[#F0D8E0] hover:bg-[#F4DCE4] hover:border-primary text-primary-dark px-3 py-2 rounded-button text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag size={16} />
                В корзину
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
