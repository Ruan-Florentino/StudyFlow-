import React from 'react';
import { useUsage } from '../hooks/useUsage';
import { cn } from './UI';

interface Props {
  onUpgradeClick?: () => void;
}

export function UsageIndicator({ onUpgradeClick }: Props) {
  const { used, limit, percentage, isExhausted } = useUsage();

  const colorClass = percentage < 50 
    ? 'bg-emerald-500' 
    : percentage < 80 
      ? 'bg-amber-500' 
      : 'bg-red-500';

  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
        <span className="text-text-secondary">IA Hoje</span>
        <span className={cn(isExhausted ? 'text-red-500' : 'text-white')}>
          {used}/{limit}
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", colorClass)} 
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      {percentage >= 80 && onUpgradeClick && (
        <button 
          onClick={onUpgradeClick}
          className="text-[9px] text-amber-500 hover:text-amber-400 uppercase tracking-widest text-right mt-1"
        >
          {isExhausted ? 'Upgrade Necessário' : 'Fazer Upgrade'}
        </button>
      )}
    </div>
  );
}
