import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AthenaChat } from '../features/athena/components/AthenaChat';
import { ATHENA_CONFIG } from '../features/athena/constants/config';
import { Activity, Brain, Lock, Shield, Sparkles, Zap } from 'lucide-react';
import { AuroraBackground } from '../components/fx/AuroraBackground';
import { useUserAccess } from '../hooks/useUserAccess';
import { aiPremiumCopy } from '../lib/productDisclosure';

export function AIHub() {
  const { isPremium } = useUserAccess();

  return (
    <div className="app-shell-premium athena-hub-shell relative mx-auto flex w-full max-w-7xl flex-1 flex-col min-h-0 min-w-0 overflow-x-hidden pt-4 md:pt-8">
      <AuroraBackground intensity="subtle" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-page-hero athena-command-hero mb-4 flex shrink-0 flex-col gap-5 md:mb-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="athena-signal flex h-14 w-14 shrink-0 items-center justify-center rounded-[24px] border border-primary/25 bg-primary/10 shadow-[0_18px_42px_rgba(var(--hub-primary-rgb),0.16)] sm:h-16 sm:w-16">
              <span className="relative z-10 text-3xl sm:text-4xl">{ATHENA_CONFIG.ICON}</span>
            </div>
            <div className="min-w-0">
              <div className="premium-kicker mb-2">Athena V3</div>
              <h1 className="truncate text-3xl font-black tracking-tight text-white sm:text-4xl">
                <span className="neon-text-soft">Athena</span> Command
              </h1>
              <p className="mt-1 max-w-xl truncate text-[10px] font-medium uppercase tracking-widest text-white/50 sm:text-xs">
                IA de estudo, revisao e estrategia em tempo real
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-3 gap-2 lg:w-auto lg:min-w-[24rem]">
            <div className="premium-stat-tile rounded-2xl border border-white/10 px-3 py-2 text-right">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Status</span>
              <span className="mt-1 flex items-center justify-end gap-1.5 text-[11px] font-bold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Online
              </span>
            </div>
            <div className="premium-stat-tile rounded-2xl border border-white/10 px-3 py-2 text-right">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Modo</span>
              <span className="mt-1 flex items-center justify-end gap-1.5 text-[11px] font-bold text-cyan-200">
                <Activity size={12} /> Chat vivo
              </span>
            </div>
            <div className="premium-stat-tile rounded-2xl border border-white/10 px-3 py-2 text-right">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Fluxo</span>
              <span className="mt-1 flex items-center justify-end gap-1.5 text-[11px] font-bold text-violet-200">
                <Sparkles size={12} /> Contextual
              </span>
            </div>
          </div>
        </motion.div>

        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-list-card mb-4 flex shrink-0 flex-col gap-2 rounded-2xl border border-primary/25 bg-primary/[0.06] px-4 py-3 md:flex-row md:items-center md:justify-between"
            role="status"
          >
            <div className="flex min-w-0 gap-3">
              <div className="mt-0.5 shrink-0 rounded-lg border border-primary/30 bg-primary/10 p-2">
                <Lock size={16} className="text-primary" aria-hidden />
              </div>
              <p className="text-xs leading-relaxed text-white/80 md:text-sm">{aiPremiumCopy.banner}</p>
            </div>
            <Link
              to="/premium"
              className="shrink-0 py-2 text-center text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-white md:py-0 md:text-right"
            >
              Ver Premium
            </Link>
          </motion.div>
        )}

        <div className="min-h-0 flex-1 rounded-[28px]">
          <AthenaChat context="hub" showSidebar={true} defaultSidebarOpen={false} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 hidden grid-cols-1 gap-4 md:mt-6 md:grid md:grid-cols-3"
        >
          <div className="premium-list-card flex items-center gap-3 rounded-2xl p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Zap size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Velocidade</span>
              <span className="text-xs font-bold text-white/70">Resposta guiada</span>
            </div>
          </div>

          <div className="premium-list-card flex items-center gap-3 rounded-2xl p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Brain size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Modelos</span>
              <span className="text-xs font-bold text-white/70">Modelos selecionados</span>
            </div>
          </div>

          <div className="premium-list-card flex items-center gap-3 rounded-2xl p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Shield size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Arquitetura</span>
              <span className="text-xs font-bold text-white/70">Chat protegido</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
