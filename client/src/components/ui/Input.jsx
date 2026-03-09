
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(({ 
  className,
  error,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-4 py-3 rounded-button bg-[#FEF8F6] border border-border',
        'placeholder:text-text-muted text-text-primary font-normal',
        'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
        'transition-all duration-200',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
