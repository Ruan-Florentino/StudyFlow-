import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AthenaChat } from '../features/athena/components/AthenaChat';
import { ATHENA_CONFIG } from '../features/athena/constants/config';
import { Brain, Zap, Shield, Lock } from 'lucide-react';
import { AuroraBackground } from '../components/fx/AuroraBackground';
import { useUserAccess } from '../hooks/useUserAccess';
import { aiPremiumCopy } from '../lib/productDisclosure';

export function AIHub() {
  const { isPremium } = useUserAccess();
  return (
    <div className="relative mx-auto w-full min-h-[calc(100vh-6rem)] max-w-7xl px-4 md:px-8 pt-6 md:pt-8 h-[calc(100vh-6rem)] flex flex-col">
      <AuroraBackground intensity="subtle" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5 neon-edge-subtle">
            <span className="text-3xl">{ATHENA_CONFIG.ICON}</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Intelligence <span className="neon-text-soft">Hub</span>
            </h1>
            <p className="text-xs text-white/40 font-medium uppercase tracking-widest">ATHENA V3 · DeepSeek</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-white/20 uppercase tracking-widest">Status da Rede</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistemas Operacionais
            </span>
          </div>
        </div>
      </motion.div>

      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-col gap-2 rounded-2xl border border-primary/25 bg-primary/[0.08] px-4 py-3 md:flex-row md:items-center md:justify-between"
          role="status"
        >
          <div className="flex gap-3 min-w-0">
            <div className="mt-0.5 shrink-0 rounded-lg bg-primary/15 p-2 border border-primary/30">
              <Lock size={16} className="text-primary" aria-hidden />
            </div>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed">{aiPremiumCopy.banner}</p>
          </div>
          <Link
            to="/premium"
            className="shrink-0 text-center md:text-right text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors py-2 md:py-0"
          >
            Ver Premium
          </Link>
        </motion.div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 min-h-0">
        <AthenaChat 
          context="hub"
          showSidebar={true}
        />
      </div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="p-4 glass-premium rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Zap size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Velocidade</span>
            <span className="text-xs text-white/70 font-bold">Resposta Instantânea</span>
          </div>
        </div>

        <div className="p-4 glass-premium rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Brain size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Modelos</span>
            <span className="text-xs text-white/70 font-bold">State-of-the-art LLMs</span>
          </div>
        </div>

        <div className="p-4 glass-premium rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Shield size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Arquitetura</span>
            <span className="text-xs text-white/70 font-bold">ATHENA Protocol v2</span>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
