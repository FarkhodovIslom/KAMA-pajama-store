
import { motion } from 'framer-motion';
import { Plus, Minus, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/utils';
import { getProductPlaceholder } from '../../data/mockData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFan, faWater, faChild } from '@fortawesome/free-solid-svg-icons';

export function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const { product, variant, quantity } = item;
  const placeholder = getProductPlaceholder(product);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 bg-surface rounded-card p-4 shadow-soft"
    >
      {/* Image */}
      <div 
        className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl"
        style={{ backgroundColor: placeholder }}
      >
        {product.category === 'Женские' && <FontAwesomeIcon icon={faFan} />}
        {product.category === 'Мужские' && <FontAwesomeIcon icon={faWater} />}
        {product.category === 'Детские' && <FontAwesomeIcon icon={faChild} />}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-extrabold text-sm text-text-primary truncate">
          {product.name}
        </h4>
        <p className="text-xs text-text-muted mt-0.5">
          {variant.size} / {variant.color}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(product.id, variant.id, quantity - 1)}
              className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center hover:bg-[#F4DCE4] transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="font-bold text-sm w-6 text-center">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, variant.id, quantity + 1)}
              className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center hover:bg-[#F4DCE4] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {/* Price */}
          <span className="font-extrabold text-primary-dark">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>
      
      {/* Remove */}
      <button
        onClick={() => removeItem(product.id, variant.id)}
        className="self-start p-1 text-text-muted hover:text-red-500 transition-colors"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}
