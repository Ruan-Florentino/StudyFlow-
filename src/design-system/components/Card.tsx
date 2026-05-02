import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface CardProps extends Omit<HTMLMotionProps<"div">, "className"> {
  variant?: 'solid' | 'glass' | 'gradient' | 'outlined';
  hoverLift?: boolean;
  shine?: boolean;
  className?: string; // Permitir sobrescritas manuais
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'solid',
  hoverLift = false,
  shine = false,
  className = '',
  ...props
}, ref) => {
  
  const baseClasses = "relative rounded-3xl overflow-hidden transition-all duration-300";
  
  const variants = {
    solid: "bg-[#141416]",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10",
    gradient: "bg-gradient-to-br from-[#1c1c20] to-[#0a0a0b] border border-white/5",
    outlined: "bg-transparent border border-white/10"
  };

  const hoverClasses = hoverLift ? "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer" : "";

  return (
    <motion.div
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {/* Opcional Shine no Hover */}
      {shine && (
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent bg-[length:200%_200%] bg-left-bottom opacity-0 hover:opacity-100 hover:bg-right-top transition-all duration-700 pointer-events-none" />
      )}
      
      {/* Content wrapper para focar Z-Index em cima do shine opcional */}
      <div className="relative z-10 w-full h-full">
        {children as React.ReactNode}
      </div>
    </motion.div>
  );
});

Card.displayName = 'Card';
