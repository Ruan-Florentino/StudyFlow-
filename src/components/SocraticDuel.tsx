import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, Sparkles, Loader2, Quote } from 'lucide-react';
import { AnimatedButton } from './UI';
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
    <div className="app-shell-premium pt-6 md:pt-8 max-w-4xl h-full flex flex-col font-sans mx-auto w-full">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <button 
          onClick={onBack} 
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
        >
          <div className="p-2 rounded-full bg-zinc-900/50 group-hover:bg-zinc-800 border border-zinc-800/50 transition-all">
            <ChevronLeft size={18} />
          </div>
          <span className="text-sm font-medium tracking-wide">Voltar</span>
        </button>
        
        <div className="text-right">
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2 justify-end">
            Socratic Duel <Sparkles size={14} className="text-zinc-500" />
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">Dialética Pura</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex-1 flex flex-col items-center justify-center -mt-12"
          >
            <div className="w-20 h-20 mb-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Quote size={32} className="text-zinc-400 relative z-10" />
            </div>
            
            <div className="text-center mb-10 space-y-3">
              <h3 className="text-2xl font-light tracking-tight text-zinc-100">O que vamos questionar hoje?</h3>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
                A verdade emerge do diálogo. Escolha uma tese e deixe o método socrático testar sua consistência.
              </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <div className="relative group">
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: A natureza da justiça"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-700"
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
              </div>
              <AnimatedButton 
                onClick={handleStart} 
                className="w-full bg-white text-black py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                <span className="text-sm font-semibold tracking-tight">Iniciar Diálogo</span>
              </AnimatedButton>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col min-h-0 relative"
          >
            <div className="flex-1 overflow-y-auto pr-2 space-y-8 no-scrollbar pb-32">
              <div className="flex justify-center mb-8">
                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-widest">
                  Explorando: {topic}
                </span>
              </div>

              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={clsx(
                    "flex flex-col",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={clsx(
                    "max-w-[85%] sm:max-w-[75%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-zinc-100 text-black rounded-tr-sm" 
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-zinc-600 mt-2 font-medium uppercase tracking-tight px-1">
                    {msg.role === 'user' ? 'Você' : 'Sócrates'}
                  </span>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-start"
                >
                  <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 rounded-tl-sm flex items-center justify-center min-w-[60px]">
                    <span className="flex gap-1">
                      <motion.span 
                        animate={{ opacity: [1, 0.4, 1] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="w-1.5 h-1.5 bg-zinc-500 rounded-full" 
                      />
                      <motion.span 
                        animate={{ opacity: [1, 0.4, 1] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-zinc-500 rounded-full" 
                      />
                      <motion.span 
                        animate={{ opacity: [1, 0.4, 1] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-zinc-500 rounded-full" 
                      />
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-background via-background/95 to-transparent">
              <div className="relative flex items-center max-w-2xl mx-auto group">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Expanda seu pensamento..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-6 pr-16 py-4 text-sm focus:outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-600"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 p-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center text-zinc-600 mt-4 font-mono tracking-tighter">
                Método Socrático • Verita per Interrogationem
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

