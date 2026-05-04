import React from 'react';
import { Bot } from 'lucide-react';
import { useAIUI } from '../../hooks/useAIUI';
import { ATHENA_CONFIG } from '../../features/athena/constants/config';

export function FloatingAIButton() {
  const { openChat, isOpen, setViewMode } = useAIUI();

  if (isOpen) return null;

  const handleOpen = () => {
    setViewMode('sidebar');
    openChat('Geral');
  };

  return (
    <button
      onClick={handleOpen}
      title={ATHENA_CONFIG.TAGLINE}
      className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-full shadow-2xl text-white hover:scale-110 active:scale-95 transition-all group overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.4)]"
    >
      <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
      <div className="relative z-10 flex items-center justify-center">
        <span className="text-xl">{ATHENA_CONFIG.ICON}</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border-2 border-black" />
      </div>
    </button>
  );
}
