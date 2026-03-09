
import { cn } from '../../lib/utils';

const colorMap = {
  'Тёмно-синий': '#4A5568',
  'Розовый': '#F8CEDD',
  'Зелёный': '#C8E8CC',
  'Синий': '#C0D8F0',
  'Золотой': '#F8E8B0',
  'Белый': '#F5F5F5',
  'Оранжевый': '#F8D8A8',
  'Чёрный': '#2D3748',
  'Серый': '#A0AEC0',
  'Фиолетовый': '#D8C8F0',
  ' Бежевый': '#F5E6D3',
};

export function ColorSelector({ variants, selectedColor, onSelect }) {
  const colors = [...new Set(variants.map(v => v.color.trim()))];
  
  return (
    <div>
      <p className="text-sm font-semibold text-text-muted mb-2">
        Цвет: {selectedColor}
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const variant = variants.find(v => v.color.trim() === color);
          const inStock = variant && variant.stockQty > 0;
          
          return (
            <button
              key={color}
              onClick={() => inStock && onSelect(color)}
              disabled={!inStock}
              title={color}
              className={cn(
                'w-10 h-10 rounded-full transition-all flex items-center justify-center',
                selectedColor === color && 'ring-2 ring-primary ring-offset-2',
                !inStock && 'opacity-40 cursor-not-allowed'
              )}
              style={{ backgroundColor: colorMap[color] || '#F8CEDD' }}
            >
              {!inStock && (
                <span className="text-xs text-gray-500">✕</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
