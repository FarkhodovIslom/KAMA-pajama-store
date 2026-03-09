
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary hover:bg-[#D090A0] text-white',
  ghost: 'bg-subtle border border-[#F0D8E0] hover:bg-[#F4DCE4] text-primary-dark',
  outline: 'bg-transparent border-2 border-primary hover:bg-primary hover:text-white text-primary',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  disabled,
  onClick,
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-bold rounded-button transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
