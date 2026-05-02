import React from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-[#1c1c20] rounded-full flex items-center justify-center text-white/40 mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00E88F]/10 to-transparent rounded-full opacity-50" />
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white tracking-tight mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-white/50 max-w-[260px] mb-8 leading-relaxed">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button variant="glass" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
