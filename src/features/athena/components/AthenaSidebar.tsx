import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useAIUI } from '../../../hooks/useAIUI';
import { AthenaChat } from './AthenaChat';
import { ATHENA_CONFIG } from '../constants/config';
import { springs } from '../../../lib/animations/easings';

export function AthenaSidebar() {
  const { isOpen, closeChat, viewMode } = useAIUI();
  const reduceMotion = useReducedMotion() ?? false;
  const [expanded, setExpanded] = React.useState(false);
  const shouldShow = isOpen && viewMode === 'sidebar';

  React.useEffect(() => {
    if (!shouldShow) setExpanded(false);
  }, [shouldShow]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {shouldShow && (
        <>
          <motion.button
            type="button"
            aria-label="Fechar Athena"
            className="fixed inset-0 z-[1180] cursor-default bg-black/38 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0.12 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={closeChat}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ATHENA_CONFIG.NAME}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.94, rotateX: -5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96, rotateX: -3 }}
            transition={reduceMotion ? { duration: 0.16 } : springs.soft}
            className={`athena-sidebar-panel fixed z-[1200] flex flex-col overflow-hidden rounded-[28px] border shadow-2xl outline-none ${
              expanded
                ? 'inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] md:left-auto md:right-5 md:w-[min(42rem,calc(100vw-2.5rem))]'
                : 'inset-x-3 bottom-[calc(6.25rem+env(safe-area-inset-bottom,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] sm:bottom-5 sm:left-auto sm:right-5 sm:top-5 sm:w-[min(28.5rem,calc(100vw-2.5rem))]'
            }`}
          >
            <div className="athena-chat-header flex shrink-0 items-center justify-between gap-3 p-4 backdrop-blur-xl">
              <div className="flex min-w-0 items-center gap-3">
                <div className="athena-signal flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 shadow-[0_16px_34px_rgba(var(--hub-primary-rgb),0.15)]">
                  <span className="relative z-10 text-2xl">{ATHENA_CONFIG.ICON}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black tracking-tight text-white">{ATHENA_CONFIG.NAME}</h3>
                  <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/45">Janela ativa</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  title={expanded ? 'Reduzir janela' : 'Ampliar janela'}
                >
                  {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/60 transition-colors hover:border-red-400/25 hover:bg-red-500/10 hover:text-red-300"
                  title="Fechar Athena"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 p-3">
              <AthenaChat context="sidebar" showSidebar={false} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}