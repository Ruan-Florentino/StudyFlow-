import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2 } from 'lucide-react';
import { useAIUI } from '../../../hooks/useAIUI';
import { AthenaChat } from './AthenaChat';
import { useAppNavigation } from '../../../app/router/useAppNavigation';

export function AthenaSidebar() {
  const { isOpen, closeChat, viewMode, setViewMode } = useAIUI();
  const { goTo } = useAppNavigation();

  if (!isOpen || viewMode !== 'sidebar') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-background border-l border-white/10 z-[1000] shadow-2xl flex flex-col"
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <span className="text-xl">🦉</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Athena</h3>
              <p className="text-[10px] text-white/40 uppercase font-medium tracking-widest">Protocol Sidebar</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setViewMode('page');
                goTo('/ai');
              }}
              className="p-2 hover:bg-white/10 rounded-xl text-white/60 transition-colors"
              title="Expandir para tela cheia"
            >
              <Maximize2 size={18} />
            </button>
            <button 
              onClick={closeChat}
              className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-white/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <AthenaChat 
            context="sidebar"
            showSidebar={false}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
