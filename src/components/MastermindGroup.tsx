import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ChevronLeft, Send, Sparkles, Brain, Lightbulb, ShieldAlert } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { aiService } from '../services/aiService';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  sender: 'user' | 'skeptic' | 'creative' | 'logical' | 'system';
  text: string;
}

const PERSONAS = {
  user: { name: 'Você', color: 'text-white', bg: 'bg-white/10', icon: null },
  skeptic: { name: 'O Cético', color: 'text-red-400', bg: 'bg-red-500/10', icon: ShieldAlert },
  creative: { name: 'O Criativo', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Lightbulb },
  logical: { name: 'O Lógico', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Brain },
  system: { name: 'Sistema', color: 'text-gray-400', bg: 'bg-transparent', icon: null }
};

export const MastermindGroup = ({ onBack }: { onBack: () => void }) => {
  const [topic, setTopic] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startDiscussion = async () => {
    if (!topic.trim()) return;
    setIsStarted(true);
    setMessages([
      { id: '1', sender: 'system', text: `Iniciando simulação de grupo sobre: "${topic}"...` },
      { id: '2', sender: 'system', text: 'Conectando personas neurais...' }
    ]);

    setIsTyping('logical');
    try {
      const initialResponse = await aiService.generateMastermindResponse(topic, [], 'logical');
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'logical', text: initialResponse }]);
      
      setIsTyping('creative');
      const secondResponse = await aiService.generateMastermindResponse(topic, [{sender: 'logical', text: initialResponse}], 'creative');
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'creative', text: secondResponse }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { id: Date.now().toString(), sender: 'user' as const, text: userMsg }];
    setMessages(newMessages);

    // Decide who responds based on random chance or round-robin
    const responders: ('skeptic' | 'creative' | 'logical')[] = ['skeptic', 'creative', 'logical'];
    // Shuffle and pick 1 or 2
    const shuffled = responders.sort(() => 0.5 - Math.random());
    const numResponders = Math.random() > 0.5 ? 2 : 1;
    const selectedResponders = shuffled.slice(0, numResponders);

    let currentHistory = [...newMessages];

    for (const responder of selectedResponders) {
      setIsTyping(responder);
      try {
        const response = await aiService.generateMastermindResponse(topic, currentHistory, responder);
        const newMsg = { id: Date.now().toString(), sender: responder, text: response };
        currentHistory = [...currentHistory, newMsg];
        setMessages(currentHistory);
      } catch (error) {
        console.error(error);
      }
    }
    setIsTyping(null);
  };

  if (!isStarted) {
    return (
      <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 min-h-screen bg-black flex flex-col items-center justify-center">
        <AnimatedButton onClick={onBack} variant="ghost" className="absolute top-6 left-6 text-white/50 hover:text-white">
          <ChevronLeft size={24} />
        </AnimatedButton>
        
        <GlassCard className="max-w-xl w-full p-8 space-y-6 border-indigo-500/30 bg-indigo-500/5">
          <div className="flex items-center justify-center mb-8">
            <Users size={64} className="text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-premium-title italic text-indigo-400">Mente Colmeia</h2>
            <p className="text-text-secondary text-sm">
              Discuta qualquer tópico com um painel de IAs especializadas: O Lógico, O Criativo e O Cético.
            </p>
          </div>
          
          <div className="space-y-4 pt-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Qual tópico vamos debater?"
              className="w-full bg-black/50 border border-indigo-500/30 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-400 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && startDiscussion()}
            />
            <AnimatedButton 
              onClick={startDiscussion}
              disabled={!topic.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-widest uppercase disabled:opacity-50"
            >
              Iniciar Simulação
            </AnimatedButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="app-shell-premium pt-6 md:pt-8 pb-32 md:pb-36 min-h-screen bg-black flex flex-col h-screen">
      <header className="flex items-center justify-between shrink-0 mb-6">
        <div className="flex items-center gap-4">
          <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-indigo-500/30 text-indigo-400">
            <ChevronLeft size={20} />
          </AnimatedButton>
          <div>
            <h2 className="text-xl font-premium-title italic text-indigo-400">Mente Colmeia</h2>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest">Tópico: {topic}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['logical', 'creative', 'skeptic'].map(r => {
            const P = PERSONAS[r as keyof typeof PERSONAS];
            const Icon = P.icon;
            return (
              <div key={r} className={cn("p-2 rounded-full border border-white/10", P.bg, P.color)}>
                {Icon && <Icon size={16} />}
              </div>
            );
          })}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const persona = PERSONAS[msg.sender];
            const Icon = persona.icon;
            
            if (msg.sender === 'system') {
              return (
                <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <span className="text-[10px] uppercase tracking-widest text-white/30">{msg.text}</span>
                </motion.div>
              );
            }

            const isUser = msg.sender === 'user';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn("flex flex-col max-w-[85%]", isUser ? "ml-auto items-end" : "mr-auto items-start")}
              >
                {!isUser && (
                  <div className={cn("flex items-center gap-1 mb-1 ml-2", persona.color)}>
                    {Icon && <Icon size={12} />}
                    <span className="text-[10px] uppercase tracking-widest font-bold">{persona.name}</span>
                  </div>
                )}
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  isUser ? "bg-indigo-600 text-white rounded-tr-sm" : cn("border border-white/10 rounded-tl-sm backdrop-blur-md", persona.bg)
                )}>
                  {isUser ? msg.text : (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-text-secondary ml-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs italic">{PERSONAS[isTyping as keyof typeof PERSONAS].name} está digitando...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 pt-4 mt-4 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Adicione à discussão..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
          disabled={!!isTyping}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || !!isTyping}
          className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
