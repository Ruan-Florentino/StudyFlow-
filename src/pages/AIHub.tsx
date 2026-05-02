import React, { useEffect, useState } from 'react';
import { AgentSelector } from '../components/AI/AgentSelector';
import { Activity, MessageSquare, History, Plus, Sparkles, Brain, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AI_BRAND } from '../config/aiBranding';
import { useAIUI } from '../hooks/useAIUI';
import { chatService, ChatSession } from '../services/chatService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { STUDY_AGENTS } from '../config/aiAgents';

export function AIHub() {
  const { openChat, selectedAgent } = useAIUI();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      const data = await chatService.getSessions();
      setSessions(data);
      setLoading(false);
    };
    loadSessions();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl mb-6 border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <span className="text-6xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{AI_BRAND.icon}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40 mb-6 tracking-tight leading-tight">
          Sua Inteligência <br /> de Aprovação
        </h1>
        <p className="text-xl text-white/50 font-medium leading-relaxed">
          Sage centraliza todo o conhecimento que você precisa. Escolha um agente especializado ou continue uma conversa anterior.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content: Agent Selector */}
        <div className="lg:col-span-3 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Brain className="text-emerald-400" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Agentes da {AI_BRAND.name}</h2>
            </div>
            <AgentSelector />
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center group transition-all hover:bg-white/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{sessions.length} Conversas</h3>
              <p className="text-white/40 text-sm max-w-[200px]">Histórico persistente para você nunca perder o fio da meada.</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center group transition-all hover:bg-white/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="text-blue-400" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">24/7 Online</h3>
              <p className="text-white/40 text-sm max-w-[200px]">A {AI_BRAND.name} nunca dorme. Sua vaga não espera.</p>
            </motion.div>
          </section>
        </div>

        {/* Sidebar: Recent History */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-md overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-white/80 font-bold">
                <History size={18} className="text-emerald-400" />
                <span>Histórico</span>
              </div>
              <button 
                onClick={() => openChat()}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
              >
                <Plus size={16} className="text-white/60" />
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
                ))
              ) : sessions.length === 0 ? (
                <div className="py-12 text-center opacity-30">
                  <MessageSquare className="mx-auto mb-2" size={32} />
                  <p className="text-xs uppercase font-bold tracking-widest leading-loose">Nada ainda</p>
                </div>
              ) : (
                sessions.map((session) => {
                  const agent = STUDY_AGENTS[session.agentId as keyof typeof STUDY_AGENTS];
                  return (
                    <motion.button
                      key={session.id}
                      whileHover={{ x: 4 }}
                      onClick={() => openChat(session.agentId as any, session.id)}
                      className="w-full p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left flex items-start gap-3 group"
                    >
                      <div className="text-xl mt-1">{agent?.icon || '🧠'}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{session.title}</h4>
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-tighter mt-1">
                          {formatDistanceToNow(session.updatedAt, { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-white/10 group-hover:text-white/40 mt-1 transition-colors" />
                    </motion.button>
                  );
                })
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                  <Sparkles size={14} className="text-emerald-400" />
                  <span>SAGE CLOUD</span>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Suas conversas são criptografadas e sincronizadas entre dispositivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
