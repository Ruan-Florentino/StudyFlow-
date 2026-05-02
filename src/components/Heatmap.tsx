import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './UI';

export const Heatmap = ({ data }: { data: { date: string, count: number }[] }) => {
  const today = new Date();
  const days = Array.from({ length: 91 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (90 - i));
    return d.toISOString().split('T')[0];
  });

  const getIntensity = (date: string) => {
    const entry = data.find(d => d.date === date);
    if (!entry || entry.count === 0) return 'bg-white/5 border-white/5';
    if (entry.count < 5) return 'bg-primary/30 border-primary/10';
    if (entry.count < 10) return 'bg-primary/50 border-primary/20';
    if (entry.count < 20) return 'bg-primary/80 border-primary/30';
    return 'bg-primary shadow-[0_0_15px_rgba(0,255,148,0.8)] border-primary/40';
  };

  return (
    <div className="flex flex-col gap-1 w-full overflow-x-auto no-scrollbar py-2">
      <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
        {days.map((date, i) => (
          <motion.div
            key={date}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.005, ease: "easeOut" }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
            className={cn(
              "w-3 h-3 rounded-[3px] border transition-all duration-300", 
              getIntensity(date)
            )}
            title={`${date}: ${data.find(d => d.date === date)?.count || 0} questões`}
          />
        ))}
      </div>
    </div>
  );
};
