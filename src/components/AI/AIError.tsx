import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface AIErrorProps {
  message: string;
  onRetry?: () => void;
}

export function AIError({ message, onRetry }: AIErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
        border: '1px solid rgba(239,68,68,0.3)',
      }}
    >
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-400 mb-1">
            Erro na IA
          </p>
          <p className="text-xs text-white/70 mb-2">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 hover:text-red-300"
            >
              <RefreshCw size={12} />
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
