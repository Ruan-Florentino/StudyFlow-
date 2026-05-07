import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { springs } from '../../../lib/animations/easings';
import { Shield, Trash2, History, Sidebar, Plus, MessageSquare } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { useAthena } from '../hooks/useAthena';
import { ATHENA_MODELS, DEFAULT_MODEL } from '../constants/models';
import type { ChatSession } from '../types/chat.types';
import { ATHENA_CONFIG } from '../constants/config';
import { AIModel } from '../types/model.types';

interface AthenaChatProps {
  context?: 'home' | 'hub' | 'redacao' | 'questoes' | 'trilhas' | 'sidebar';
  greeting?: string;
  placeholder?: string;
  systemPrompt?: string;
  showSidebar?: boolean;
  /** Abre a sidebar de sessões por padrão (útil em telas de histórico embutido). */
  defaultSidebarOpen?: boolean;
  /** Chat reduzido para a home (sem sidebar, layout mais baixo). */
  compact?: boolean;
  /** No modo compact, ainda permite abrir a lista de conversas salvas (localStorage). */
  sidebarInCompact?: boolean;
}

export const AthenaChat: React.FC<AthenaChatProps> = ({ 
  context = 'home', 
  greeting, 
  placeholder,
  systemPrompt,
  showSidebar: forceSidebar = false,
  defaultSidebarOpen = false,
  compact = false,
  sidebarInCompact = false,
}) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>(DEFAULT_MODEL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(forceSidebar || defaultSidebarOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const allowSidebar = !compact || sidebarInCompact;
  const sidebarTransition = reduceMotion
    ? { duration: 0.15, ease: [0.22, 1, 0.36, 1] as const }
    : springs.soft;

  const {
    messages,
    loading,
    sendMessage,
    clearChat,
    sessions,
    loadSession,
    deleteSession,
  } = useAthena(selectedModel, context, systemPrompt);

  const handleNewChat = () => {
    clearChat();
    if (compact && sidebarInCompact) setIsSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    const session: ChatSession | null = loadSession(id);
    if (session) {
      const nextModel = ATHENA_MODELS.find((x) => x.id === session.modelId);
      if (nextModel) setSelectedModel(nextModel);
    }
    if (compact && sidebarInCompact) setIsSidebarOpen(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div
      className={
        compact
          ? 'flex h-full min-h-0 w-full bg-slate-950/40 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative'
          : 'flex h-full w-full bg-slate-950/50 rounded-3xl overflow-hidden border border-white/5 backdrop-blur-3xl shadow-2xl relative'
      }
    >
      <AnimatePresence>
        {allowSidebar && isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={sidebarTransition}
            className="h-full border-r border-white/5 bg-black/20 flex flex-col overflow-hidden shrink-0"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2 min-w-0">
                <History size={14} />
                <span className="truncate">Histórico</span>
              </h3>
              <button
                type="button"
                onClick={handleNewChat}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200 ease-out shrink-0"
                title="Nova conversa"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center opacity-30 px-4 py-12">
                  <MessageSquare size={32} className="mb-3" />
                  <p className="text-xs leading-relaxed">
                    Nenhuma sessão salva ainda. Envie uma mensagem para criar a primeira.
                  </p>
                </div>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    className="group flex items-stretch gap-1 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectSession(s.id)}
                      className="flex-1 min-w-0 text-left px-3 py-2.5"
                    >
                      <p className="text-xs font-bold text-white/90 truncate">
                        {s.title?.trim() || 'Conversa'}
                      </p>
                      <p className="text-[10px] text-white/35 font-medium mt-0.5">
                        {new Date(s.lastUpdated).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(s.id);
                      }}
                      className="px-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-r-xl transition-colors"
                      title="Excluir conversa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className={
            compact
              ? 'p-2.5 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md shrink-0'
              : 'p-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md'
          }
        >
          <div className="flex items-center gap-3">
            {allowSidebar && (
            <button 
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40"
              title={isSidebarOpen ? 'Ocultar histórico de conversas' : 'Ver histórico de conversas'}
            >
              <Sidebar size={18} />
            </button>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={compact ? 'text-lg' : 'text-xl'}>{ATHENA_CONFIG.ICON}</span>
                <span className={compact ? 'text-xs font-bold tracking-tight text-white' : 'text-sm font-bold tracking-tight text-white'}>{ATHENA_CONFIG.NAME}</span>
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold rounded uppercase tracking-widest border border-emerald-500/20">
                  Online
                </span>
              </div>
              {!compact && (
              <span className="text-[10px] text-white/30 font-medium">{ATHENA_CONFIG.TAGLINE}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} />
            <button 
              onClick={clearChat}
              className="p-2.5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all text-white/20"
              title="Limpar Chat"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        {/* Messages List */}
        <div className={`flex-1 min-h-0 overflow-y-auto no-scrollbar ${compact ? 'pt-2' : 'pt-4'}`}>
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0.12 } : springs.card}
                className={
                  compact
                    ? 'h-full flex flex-col items-center justify-center p-4 text-center'
                    : 'h-full flex flex-col items-center justify-center p-8 text-center'
                }
              >
                <div
                  className={
                    compact
                      ? 'w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3 relative'
                      : 'w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative'
                  }
                >
                  <span className={compact ? 'text-2xl' : 'text-4xl'}>{ATHENA_CONFIG.ICON}</span>
                  <motion.div
                    animate={
                      reduceMotion
                        ? { opacity: 0.35 }
                        : { scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                    }
                    className="absolute inset-0 bg-primary rounded-full blur-2xl"
                  />
                </div>
                <h2 className={compact ? 'text-base font-bold text-white mb-1' : 'text-2xl font-bold text-white mb-2'}>
                  {greeting || `Olá! Eu sou ${ATHENA_CONFIG.NAME}`}
                </h2>
                <p className={compact ? 'text-white/40 text-[11px] max-w-sm mx-auto leading-relaxed' : 'text-white/40 text-sm max-w-md mx-auto leading-relaxed'}>
                  Pergunte qualquer dúvida de estudo — ENEM, redação ou questões.
                </p>
                
                <div className={compact ? 'grid grid-cols-2 gap-2 mt-4 w-full max-w-md' : 'grid grid-cols-2 gap-3 mt-12 max-w-lg w-full'}>
                  {[
                    'Explicar Equação do 2º grau',
                    'Dicas para Redação Nota 1000',
                    'O que cai mais em Biologia?',
                    'Corrigir minha redação'
                  ].map(action => (
                    <button
                      key={action}
                      onClick={() => sendMessage(action, selectedModel)}
                      className={
                        compact
                          ? 'p-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all text-left'
                          : 'p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all text-left'
                      }
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))
            )}
            
            {loading && (
              <div className="p-6 flex items-center gap-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={reduceMotion ? { opacity: [0.35, 1, 0.35] } : { y: [0, -5, 0] }}
                    transition={
                      reduceMotion
                        ? { repeat: Infinity, duration: 1.1, ease: 'easeInOut' }
                        : { repeat: Infinity, duration: 0.6 }
                    }
                    className="w-1.5 h-1.5 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={reduceMotion ? { opacity: [0.35, 1, 0.35] } : { y: [0, -5, 0] }}
                    transition={
                      reduceMotion
                        ? { repeat: Infinity, duration: 1.1, ease: 'easeInOut', delay: 0.15 }
                        : { repeat: Infinity, duration: 0.6, delay: 0.2 }
                    }
                    className="w-1.5 h-1.5 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={reduceMotion ? { opacity: [0.35, 1, 0.35] } : { y: [0, -5, 0] }}
                    transition={
                      reduceMotion
                        ? { repeat: Infinity, duration: 1.1, ease: 'easeInOut', delay: 0.3 }
                        : { repeat: Infinity, duration: 0.6, delay: 0.4 }
                    }
                    className="w-1.5 h-1.5 bg-primary rounded-full"
                  />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary/50">
                  {ATHENA_CONFIG.NAME} está pensando...
                </span>
              </div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className={compact ? 'h-8' : 'h-20'} />
        </div>

        {/* Input Area */}
        <div className={compact ? 'p-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent shrink-0' : 'p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent'}>
          <ChatInput onSend={(c) => sendMessage(c, selectedModel)} disabled={loading} placeholder={placeholder} />
          <div className={`flex justify-between items-center px-2 ${compact ? 'mt-2' : 'mt-4'}`}>
            <div className="flex items-center gap-2 text-[9px] text-white/20 font-bold uppercase tracking-widest">
              <Shield size={10} />
              <span>{ATHENA_CONFIG.NAME} · DeepSeek</span>
            </div>
            {!compact && (
            <div className="flex items-center gap-1 text-[9px] text-white/10 font-medium">
               <span>Shift + Enter nova linha</span>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
