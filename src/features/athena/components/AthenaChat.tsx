import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Trash2, History, Maximize2, Minimize2, Sidebar } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { useAthena } from '../hooks/useAthena';
import { ATHENA_MODELS, DEFAULT_MODEL } from '../constants/models';
import { ATHENA_CONFIG } from '../constants/config';
import { AIModel } from '../types/model.types';

interface AthenaChatProps {
  context?: 'home' | 'hub' | 'redacao' | 'questoes' | 'trilhas' | 'sidebar';
  greeting?: string;
  placeholder?: string;
  systemPrompt?: string;
  showSidebar?: boolean;
}

export const AthenaChat: React.FC<AthenaChatProps> = ({ 
  context = 'home', 
  greeting, 
  placeholder,
  systemPrompt,
  showSidebar: forceSidebar = false
}) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>(DEFAULT_MODEL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(forceSidebar);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    loading, 
    sendMessage, 
    clearChat 
  } = useAthena(selectedModel, context, systemPrompt);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="flex h-full w-full bg-slate-950/50 rounded-3xl overflow-hidden border border-white/5 backdrop-blur-3xl shadow-2xl relative">
      {/* Sidebar - Prototyped for now */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full border-r border-white/5 bg-black/20 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                <History size={14} />
                Histórico
              </h3>
            </div>
            <div className="flex-1 p-4 flex flex-col items-center justify-center text-center opacity-20">
              <History size={40} className="mb-4" />
              <p className="text-xs">Nenhuma sessão anterior salva</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40"
            >
              <Sidebar size={18} />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl">{ATHENA_CONFIG.ICON}</span>
                <span className="text-sm font-bold tracking-tight text-white">{ATHENA_CONFIG.NAME}</span>
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold rounded uppercase tracking-widest border border-emerald-500/20">
                  Online
                </span>
              </div>
              <span className="text-[10px] text-white/30 font-medium">{ATHENA_CONFIG.TAGLINE}</span>
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
        <div className="flex-1 overflow-y-auto no-scrollbar pt-4">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative">
                  <span className="text-4xl">{ATHENA_CONFIG.ICON}</span>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl"
                  />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {greeting || `Olá! Eu sou ${ATHENA_CONFIG.NAME}`}
                </h2>
                <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
                  Estou pronta para te guiar na jornada rumo à aprovação. Escolha um assunto ou envie uma dúvida para começarmos.
                </p>
                
                <div className="grid grid-cols-2 gap-3 mt-12 max-w-lg w-full">
                  {[
                    'Explicar Equação do 2º grau',
                    'Dicas para Redação Nota 1000',
                    'O que cai mais em Biologia?',
                    'Corrigir minha redação'
                  ].map(action => (
                    <button
                      key={action}
                      onClick={() => sendMessage(action, selectedModel)}
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all text-left"
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
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/50">Athena está pensando...</span>
              </div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-20" />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          <ChatInput onSend={(c) => sendMessage(c, selectedModel)} disabled={loading} placeholder={placeholder} />
          <div className="flex justify-between items-center mt-4 px-2">
            <div className="flex items-center gap-2 text-[9px] text-white/20 font-bold uppercase tracking-widest">
              <Shield size={10} />
              <span>Multi-LLM Protocol v2.0 — Athena Cloud</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-white/10 font-medium">
               <span>Shift + Enter nova linha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
