
import { cn } from '../../lib/utils';

export function SizeSelector({ variants, selectedSize, onSelect }) {
  const sizes = [...new Set(variants.map(v => v.size))];
  
  return (
    <div>
      <p className="text-sm font-semibold text-text-muted mb-2">
        Размер: {selectedSize}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const variant = variants.find(v => v.size === size);
          const inStock = variant && variant.stockQty > 0;
          
          return (
            <button
              key={size}
              onClick={() => inStock && onSelect(size)}
              disabled={!inStock}
              className={cn(
                'min-w-[50px] px-4 py-2.5 rounded-button font-bold text-sm transition-all',
                selectedSize === size
                  ? 'bg-primary text-white'
                  : inStock
                    ? 'bg-subtle text-text-primary hover:bg-[#F4DCE4] hover:border-primary border border-transparent'
                    : 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
