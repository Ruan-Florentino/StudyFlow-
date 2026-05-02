import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { useHaptic } from '../../hooks/useHaptic';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "className" | "size"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string; // Permitir sobrescritas manuais com cautela
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  disabled,
  ...props
}, ref) => {
  const haptic = useHaptic();

  const baseClasses = "relative inline-flex items-center justify-center font-bold outline-none overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[#00E88F] text-black shadow-[0_0_20px_rgba(0,232,143,0.3)] hover:shadow-[0_0_30px_rgba(0,232,143,0.5)]",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/5",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
    danger: "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)]",
    glass: "bg-white/5 text-white backdrop-blur-md border border-white/10 hover:bg-white/10"
  };

  const sizes = {
    sm: "h-9 px-4 text-xs rounded-xl",
    md: "h-12 px-6 text-sm rounded-2xl",
    lg: "h-14 px-8 text-base rounded-2xl"
  };

  const widthClass = fullWidth ? "w-full" : "";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      if (variant === 'danger') {
        haptic('heavy');
      } else if (variant === 'primary') {
        haptic('medium');
      } else {
        haptic('light');
      }
      onClick?.(e);
    }
  };

  return (
    <motion.button
      ref={ref}
      whileTap={(!disabled && !loading) ? { scale: 0.96 } : undefined}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2 flex items-center">{icon}</span>}
          {children as React.ReactNode}
          {icon && iconPosition === 'right' && <span className="ml-2 flex items-center">{icon}</span>}
        </>
      )}
      
      {/* Shine effect for primary */}
      {variant === 'primary' && !disabled && !loading && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent hover:animate-shimmer" />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
