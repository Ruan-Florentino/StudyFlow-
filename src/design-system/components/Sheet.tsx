import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { createPortal } from 'react-dom';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Sheet = ({ isOpen, onClose, children, title }: SheetProps) => {
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Esc to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleDragEnd = (_: any, info: any) => {
    // Se arrastou pra baixo com velocidade ou passou de 100px
    if (info.velocity.y > 200 || info.offset.y > 100) {
      onClose();
    }
  };

  if (typeof document === 'undefined') return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[100] flex flex-col justify-end pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false} // Only drag by the handle
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            onDragEnd={handleDragEnd}
            className="relative w-full max-h-[90vh] bg-[#141416] rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col env-safe-bottom"
          >
            {/* Handle container for dragging */}
            <div 
              className="w-full flex justify-center items-center py-4 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
            </div>

            {title && (
              <div className="px-6 pb-4">
                <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
              </div>
            )}

            {/* Scrollable content */}
            <div className="px-6 pb-8 overflow-y-auto w-full no-scrollbar overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Portal into the main wrapper to keep it contained within the 440px max width
  return createPortal(content, document.getElementById('root-wrapper') || document.body);
};
