import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  className?: string;
}

export const Skeleton = ({ variant = 'text', className = '' }: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-white/5 overflow-hidden relative";
  
  const variants = {
    text: "h-4 rounded-md w-full",
    circle: "rounded-full",
    rect: "rounded-xl",
    card: "rounded-3xl border border-white/5"
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
    </div>
  );
};
