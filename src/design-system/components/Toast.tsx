import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import { useHaptic } from '../../hooks/useHaptic';
import { createPortal } from 'react-dom';

const ToastItem = ({ toast }: { toast: any }) => {
  const { removeToast } = useToastStore();
  const haptic = useHaptic();

  useEffect(() => {
    // Trigger haptic based on toast type
    if (toast.type === 'error') haptic('error');
    else if (toast.type === 'success') haptic('success');
    else if (toast.type === 'warning') haptic('warning');
    else haptic('light');

    const duration = toast.duration || 4000;
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, removeToast, haptic]);

  const icons = {
    success: <CheckCircle2 className="text-[#00E88F] shrink-0" size={20} />,
    error: <XCircle className="text-rose-500 shrink-0" size={20} />,
    warning: <AlertCircle className="text-amber-500 shrink-0" size={20} />,
    info: <Info className="text-cyan-400 shrink-0" size={20} />
  };

  const borders = {
    success: "border-[#00E88F]/30",
    error: "border-rose-500/30",
    warning: "border-amber-500/30",
    info: "border-cyan-400/30"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.2, right: 1 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100 || info.velocity.x > 500) {
          removeToast(toast.id);
        }
      }}
      className={`relative w-full max-w-[360px] bg-[#141416]/90 backdrop-blur-xl border ${borders[toast.type]} rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex gap-3 pointer-events-auto touch-pan-y`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-sm font-bold text-white truncate">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs text-white/60 mt-0.5 line-clamp-2">{toast.message}</p>
        )}
      </div>
      <button 
        onClick={() => removeToast(toast.id)}
        className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastProvider = () => {
  const { toasts } = useToastStore();
  
  if (typeof document === 'undefined') return null;

  const content = (
    <div className="absolute top-safe-area-inset-top z-[200] w-full flex justify-center p-4 pointer-events-none mt-4">
      <div className="flex flex-col gap-2 w-full max-w-[360px] items-center">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  return createPortal(content, document.getElementById('root-wrapper') || document.body);
};
