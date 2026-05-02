import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AILoadingProps {
  message?: string;
  color?: string;
  glow?: string;
}

export function AILoading({ 
  message = 'IA pensando...', 
  color = '#a78bfa',
  glow = '167,139,250',
}: AILoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}, rgba(${glow},0.6))`,
          boxShadow: `0 0 20px rgba(${glow},0.6)`,
        }}
      >
        <Sparkles size={20} className="text-white" strokeWidth={2.5} />
      </motion.div>
      
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
          {message}
        </span>
      </div>
      
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
