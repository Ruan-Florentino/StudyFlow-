import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, RefreshCw, Trash2, Shield, Info, MoreVertical } from 'lucide-react';
import { useAIUI } from '../../hooks/useAIUI';
import { useAIChat } from '../../hooks/useAIChat';
import { STUDY_AGENTS, AgentKey } from '../../config/aiAgents';
import { AI_BRAND } from '../../config/aiBranding';
import ReactMarkdown from 'react-markdown';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

export function AgentChatPage() {
  const { selectedAgent, setAgent, currentSessionId, setSession } = useAIUI();
  const { messages, loading, sendMessage, error, activeSessionId, clearHistory } = useAIChat(selectedAgent, currentSessionId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agent = selectedAgent ? STUDY_AGENTS[selectedAgent] : STUDY_AGENTS.TUTOR;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput('');
  };

  const handleBack = () => {
    setAgent('TUTOR'); // Reset or something
    setSession(null);
    // Logic to go back to Hub? 
    // Usually handled by App.tsx rendering Hub if selectedAgent is null or specific state
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] bg-background relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-background/50 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors border border-white/5"
          >
            <ChevronLeft size={20} className="text-white/60" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg border border-white/10">
               {agent.icon}
             </div>
             <div>
               <h3 className="font-black text-white leading-none">{agent.name}</h3>
               <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em] mt-1">{AI_BRAND.name} Intelligence</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={clearHistory}
            className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all text-white/20"
            title="Limpar conversa"
          >
            <Trash2 size={18} />
          </button>
          <button className="p-2 hover:bg-white/5 text-white/20 rounded-xl transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-2xl"
              >
                {agent.icon}
              </motion.div>
              <div className="max-w-xs">
                <h4 className="text-xl font-bold text-white mb-2">{AI_BRAND.greeting}!</h4>
                <p className="text-sm text-white/40 italic">"{agent.tagline}"</p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full max-w-sm pt-8">
                {['Explique este assunto...', 'Gere um cronograma...', 'Corrija minha redação...'].map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(s)}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-left text-xs text-white/60 font-medium"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl shadow-inner ${
                  msg.role === 'user' ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10'
                }`}>
                  {msg.role === 'user' ? '👤' : agent.icon}
                </div>
                <div className={`flex flex-col space-y-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-5 rounded-[2rem] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-black font-semibold rounded-tr-none' 
                      : 'bg-white/5 border border-white/5 text-white/90 rounded-tl-none backdrop-blur-md'
                  }`}>
                    <div className="markdown-body">
                      {msg.role === 'model' ? <ReactMarkdown>{msg.parts}</ReactMarkdown> : <p>{msg.parts}</p>}
                    </div>
                  </div>
                  <span className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">
                    {format(msg.timestamp, 'HH:mm', { locale: ptBR })}
                  </span>
                </div>
              </motion.div>
            ))
          )}

          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl animate-pulse">
                {agent.icon}
              </div>
              <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] rounded-tl-none backdrop-blur-md">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs text-center flex items-center justify-center gap-2">
              <Shield size={14} />
              <span>{AI_BRAND.errorText}</span>
            </div>
          )}
          <div ref={messagesEndRef} className="h-20" />
        </div>
      </div>

      {/* Input Section */}
      <footer className="p-6 border-t border-white/5 bg-background/80 backdrop-blur-xl sticky bottom-0 z-20">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-2 bg-[#111] border border-white/10 rounded-[2.5rem] p-2 pr-4 shadow-2xl focus-within:border-primary/30 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={`Fale com ${agent.name}...`}
                className="flex-1 bg-transparent border-none p-4 text-sm text-white outline-none resize-none h-[60px] no-scrollbar placeholder:text-white/20"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </form>
          <div className="flex justify-between items-center mt-4 px-2">
             <div className="flex items-center gap-2 text-[9px] text-white/20 font-bold uppercase tracking-widest">
                <Shield size={10} />
                <span>Enviado via Sage Cloud Protocol</span>
             </div>
             <div className="flex items-center gap-3">
                <button className="text-[10px] text-white/30 font-bold hover:text-white/60 transition-colors flex items-center gap-1">
                  <Info size={12} /> Sugestões
                </button>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
