
import { cn } from '../../lib/utils';

const badgeVariants = {
  hit: 'bg-primary text-white',
  new: 'bg-[#C8E8CC] text-[#2D5A3D]',
  sale: 'bg-[#F8D8A8] text-[#8B6914]',
  premium: 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white',
};

export function Badge({ variant, children, className }) {
  if (!variant) return null;
  
  return (
    <span className={cn(
      'absolute top-3 left-3 px-3 py-1 rounded-badge text-xs font-bold',
      badgeVariants[variant] || badgeVariants.hit,
      className
    )}>
      {variant === 'hit' && 'Хит'}
      {variant === 'new' && 'Новинка'}
      {variant === 'sale' && 'Скидка'}
      {variant === 'premium' && 'Премиум'}
    </span>
  );
}
