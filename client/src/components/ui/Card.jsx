
import { cn } from '../../lib/utils';

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div 
      className={cn(
        'bg-surface rounded-card shadow-soft overflow-hidden',
        hover && 'transition-all duration-200 hover:shadow-soft-hover hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
