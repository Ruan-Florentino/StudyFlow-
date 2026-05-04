import React from 'react';
import { motion } from 'motion/react';
import { AthenaChat } from '../features/athena/components/AthenaChat';
import { ATHENA_CONFIG } from '../features/athena/constants/config';
import { Sparkles, Brain, Zap, Shield } from 'lucide-react';

export function AIHub() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
            <span className="text-3xl">{ATHENA_CONFIG.ICON}</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Intelligence Hub</h1>
            <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Multi-Model Adaptive Learning</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Status da Rede</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistemas Operacionais
            </span>
          </div>
        </div>
      </motion.div>

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
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Zap size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Velocidade</span>
            <span className="text-xs text-white/70 font-bold">Resposta Instantânea</span>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Brain size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Modelos</span>
            <span className="text-xs text-white/70 font-bold">State-of-the-art LLMs</span>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Shield size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Arquitetura</span>
            <span className="text-xs text-white/70 font-bold">ATHENA Protocol v2</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
