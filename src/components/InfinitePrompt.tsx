import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Send, Sparkles, Terminal } from 'lucide-react';
import { aiService } from '../services/aiService';
import Markdown from 'react-markdown';

export const InfinitePrompt = ({ onBack }: { onBack: () => void }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: 'Você chegou ao espaço de reflexão livre. Sem pressão de pontuação: apenas clareza sobre seu próximo passo. O que você quer construir agora?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await aiService.chat(
        `O usuário chegou ao espaço de reflexão da Athena. Responda de forma acolhedora, prática e clara, ajudando a organizar próximos passos de estudo. Input do usuário: ${userMsg}`,
        messages.map(m => ({ role: m.role, text: m.content }))
      );
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'A conexão oscilou, mas continuo aqui com você. Pode seguir.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" />
            <h1 className="text-sm font-bold uppercase tracking-[0.3em]">Espaço Aberto</h1>
          </div>
        </div>
        <div className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Modo Reflexão: ativo</div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-12">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-white/5 p-4 rounded-2xl' : ''}`}>
                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-4 opacity-30">
                    <Terminal size={12} />
                    <span className="text-[10px] uppercase tracking-widest font-mono">Athena</span>
                  </div>
                )}
                <div className={`prose prose-invert prose-sm max-w-none ${msg.role === 'model' ? 'font-serif text-xl italic leading-relaxed text-white/80' : 'font-sans text-base'}`}>
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-1">
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-8 border-t border-white/5 bg-[#080808]">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="O que você quer organizar agora?"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pr-16 focus:outline-none focus:border-white/20 transition-colors resize-none h-24 font-sans text-lg placeholder:text-white/10"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-4 bottom-4 p-3 bg-white text-black rounded-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-white/10 mt-4 uppercase tracking-widest font-mono">
          As mensagens desta tela nao sao salvas automaticamente.
        </p>
      </div>
    </div>
  );
};
