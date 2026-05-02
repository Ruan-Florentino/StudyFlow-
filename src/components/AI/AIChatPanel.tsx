import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, RefreshCw, ChevronDown } from 'lucide-react';
import { useAIUI } from '../../hooks/useAIUI';
import { useAIChat } from '../../hooks/useAIChat';
import { STUDY_AGENTS, AgentKey } from '../../config/aiAgents';
import { auth } from '../../lib/firebase';
import ReactMarkdown from 'react-markdown';
import { GEMINI_MODELS, GeminiModelKey } from '../../config/aiModels';
import { AI_BRAND } from '../../config/aiBranding';

import { UsageIndicator } from '../UsageIndicator';

export function AIChatPanel() {
  const { isOpen, closeChat, selectedAgent, setAgent, viewMode } = useAIUI();
  const { messages, loading, sendMessage, error } = useAIChat(selectedAgent || null);
  const [input, setInput] = useState('');
  const [showModels, setShowModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModelKey>('PRO');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (selectedAgent) {
      setSelectedModel(STUDY_AGENTS[selectedAgent].model as GeminiModelKey);
    }
  }, [selectedAgent]);

  if (!isOpen || viewMode !== 'sidebar') return null;

  const agent = selectedAgent ? STUDY_AGENTS[selectedAgent] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input, selectedModel);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity" 
        onClick={closeChat}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 top-12 sm:top-0 sm:left-auto sm:right-0 sm:w-[400px] bg-black border-t sm:border-t-0 sm:border-l border-white/10 z-[60] flex flex-col shadow-2xl rounded-t-3xl sm:rounded-none overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br from-emerald-500 to-emerald-600 border border-white/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {AI_BRAND.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight tracking-tight">
                {AI_BRAND.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/50 uppercase font-medium tracking-widest">{AI_BRAND.tagline}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <UsageIndicator />
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowModels(!showModels)}
                className="px-2 py-1 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider rounded bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 transition"
              >
                {GEMINI_MODELS[selectedModel]?.name}
                <ChevronDown size={12} />
              </button>
              <button onClick={closeChat} className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Agent Badge (if selected) */}
        {agent && (
          <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
            <span className="text-xs">{agent.icon}</span>
            <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Modo: {agent.name}</span>
          </div>
        )}

        {/* Model Selector Dropdown */}
        {showModels && (
          <div className="absolute top-[72px] right-4 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 w-[240px]">
            {Object.keys(GEMINI_MODELS).map((key) => {
              const mKey = key as GeminiModelKey;
              const model = GEMINI_MODELS[mKey];
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedModel(mKey);
                    setShowModels(false);
                  }}
                  className={`w-full flex items-start flex-col p-3 text-left transition hover:bg-white/5 ${selectedModel === key ? 'bg-primary/20' : ''}`}
                >
                  <span className="text-sm font-semibold flex items-center gap-2">
                    {model.icon} {model.name}
                  </span>
                  <span className="text-[10px] text-white/50 mt-1">{model.description}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm no-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse">
                {AI_BRAND.icon}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">{AI_BRAND.greeting}</p>
                <p className="text-sm text-white/40 leading-relaxed italic">
                  "Sua mentora de aprovação no StudyFlow."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full pt-4">
                {Object.entries(STUDY_AGENTS).slice(0, 4).map(([key, a]) => (
                  <button 
                    key={key}
                    onClick={() => setAgent(key as AgentKey)}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-left space-y-1"
                  >
                    <span className="text-lg">{a.icon}</span>
                    <p className="text-[9px] font-bold uppercase text-white/60 truncate">{a.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-black font-semibold rounded-tr-sm shadow-[0_4px_12px_rgba(0,255,148,0.2)]' 
                    : 'bg-white/10 text-white/90 rounded-tl-sm border border-white/5 backdrop-blur-sm'
                }`}
              >
                <div className="markdown-body text-sm leading-relaxed">
                  {msg.role === 'model' ? <ReactMarkdown>{msg.parts}</ReactMarkdown> : msg.parts}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-white/5 rounded-2xl rounded-tl-sm p-4 flex flex-col gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 animate-pulse">{AI_BRAND.loadingText}</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center">
              <span className="text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full">{AI_BRAND.errorText}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida ou comando..."
              className="w-full bg-[#111] border border-white/20 rounded-xl p-3 pr-12 text-sm text-white resize-none h-[64px] min-h-[64px] max-h-[120px] focus:outline-none focus:border-emerald-500/50 transition scrollbar-thin shadow-inner"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 bottom-2 p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </form>
          <div className="flex justify-between items-center mt-3 px-1">
            <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-bold">{AI_BRAND.poweredBy}</span>
            <span className="text-[8px] text-white/20 uppercase font-bold">Shift+Enter nova linha</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
