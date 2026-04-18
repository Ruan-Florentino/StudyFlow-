import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, ShieldAlert, Zap, Loader2 } from 'lucide-react';
import { GlassCard, AnimatedButton } from './UI';
import { aiService } from '../services/aiService';
import clsx from 'clsx';

export const SocraticDuel = ({ onBack }: { onBack: () => void }) => {
  const [topic, setTopic] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStart = async () => {
    if (!topic.trim()) return;
    setIsStarted(true);
    setIsTyping(true);
    try {
      const initialMsg = await aiService.socraticDebate(topic, `Vamos debater sobre ${topic}. Faça sua primeira pergunta provocativa.`, []);
      setMessages([{ role: 'model', text: initialMsg }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    
    try {
      const response = await aiService.socraticDebate(topic, userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-32 h-full flex flex-col animate-in fade-in duration-700">
      <header className="flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-premium-title italic uppercase text-red-500">Arena Socrática</h2>
          <p className="text-xs text-text-secondary font-premium-mono uppercase tracking-widest">Debate IA Implacável</p>
        </div>
      </header>

      {!isStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-[50px] rounded-full" />
            <ShieldAlert size={80} className="text-red-500 relative z-10 animate-pulse" />
          </div>
          
          <div className="text-center space-y-2 max-w-xs">
            <h3 className="text-xl font-bold">Defenda suas Ideias</h3>
            <p className="text-sm text-text-secondary">A IA assumirá o papel de um examinador rigoroso. Escolha um tema e prepare-se para ter suas premissas questionadas.</p>
          </div>

          <div className="w-full max-w-xs space-y-4">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Tema (ex: Revolução Francesa, Ética AI)"
              className="w-full bg-black/20 border border-red-500/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors text-center"
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
            <AnimatedButton onClick={handleStart} className="w-full bg-red-500 text-black border-red-500 hover:bg-red-400">
              <div className="flex items-center justify-center gap-2 font-bold">
                <Zap size={18} fill="currentColor" />
                INICIAR DUELO
              </div>
            </AnimatedButton>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 bg-black/20 border border-white/5 rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
          
          <div className="p-3 bg-white/5 border-b border-white/5 text-center">
            <span className="text-[10px] font-premium-mono font-bold text-red-500 uppercase tracking-[0.3em]">Tema: {topic}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                  "flex flex-col max-w-[85%]",
                  msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <span className="text-[10px] font-bold text-text-secondary uppercase mb-1 px-1">
                  {msg.role === 'user' ? 'Você' : 'Socrates AI'}
                </span>
                <div className={clsx(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-white/10 text-white rounded-tr-sm" 
                    : "bg-red-500/10 border border-red-500/20 text-red-50 rounded-tl-sm"
                )}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex flex-col max-w-[85%] mr-auto items-start">
                <span className="text-[10px] font-bold text-text-secondary uppercase mb-1 px-1">Socrates AI</span>
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 rounded-tl-sm">
                  <Loader2 size={16} className="animate-spin text-red-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-black/40 border-t border-white/5">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Sua argumentação..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
              />
              <AnimatedButton 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="px-4 bg-red-500 text-black border-red-500"
              >
                <Send size={18} />
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
