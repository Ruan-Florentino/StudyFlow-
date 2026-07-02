import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Maximize2 } from 'lucide-react';
import { useAIUI } from '../../../hooks/useAIUI';
import { AthenaChat } from './AthenaChat';
import { useAppNavigation } from '../../../app/router/useAppNavigation';
import { ATHENA_CONFIG } from '../constants/config';
import { springs } from '../../../lib/animations/easings';

export function AthenaSidebar() {
  const { isOpen, closeChat, viewMode, setViewMode } = useAIUI();
  const { goTo } = useAppNavigation();
  const reduceMotion = useReducedMotion() ?? false;

  if (!isOpen || viewMode !== 'sidebar') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={reduceMotion ? { duration: 0.2, ease: [0.22, 1, 0.36, 1] } : springs.page}
        className="athena-sidebar-panel fixed bottom-0 right-0 top-0 z-[1000] flex w-full flex-col border-l shadow-2xl sm:w-[450px]"
      >
        <div className="athena-chat-header flex shrink-0 items-center justify-between gap-3 p-4 backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-3">
            <div className="athena-signal flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 shadow-[0_16px_34px_rgba(var(--hub-primary-rgb),0.15)]">
              <span className="relative z-10 text-2xl">{ATHENA_CONFIG.ICON}</span>
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black tracking-tight text-white">{ATHENA_CONFIG.NAME}</h3>
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/40">Protocol sidebar</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setViewMode('page');
                goTo('/ai');
              }}
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              title="Expandir para tela cheia"
            >
              <Maximize2 size={18} />
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
    </AnimatePresence>
  );
}
