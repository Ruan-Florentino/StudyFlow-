import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hexagon, ChevronLeft, Send, Network, Cpu, Brain, Zap, Eye } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { aiService } from '../services/aiService';

const PERSONAS = [
  { id: 'architect', name: 'O Arquiteto', role: 'Lógica & Estrutura', icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', personaKey: 'logical' as const },
  { id: 'oracle', name: 'O Oráculo', role: 'Intuição & Padrões', icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', personaKey: 'creative' as const },
  { id: 'scientist', name: 'O Cientista', role: 'Evidência & Análise', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', personaKey: 'skeptic' as const },
];

export const HiveMind = ({ onBack }: { onBack: () => void }) => {
  const [topic, setTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [discussion, setDiscussion] = useState<{personaId: string, text: string}[]>([]);
  const [currentPersona, setCurrentPersona] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [discussion, currentPersona]);

  const startSync = async () => {
    if (!topic.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setDiscussion([]);

    try {
      // Sequence of responses from different personas
      const sequence = ['architect', 'oracle', 'scientist', 'architect', 'oracle'];
      let currentHistory: any[] = [];

      for (const pId of sequence) {
        setCurrentPersona(pId);
        const persona = PERSONAS.find(p => p.id === pId)!;
        
        const response = await aiService.generateMastermindResponse(
          topic, 
          currentHistory.map(h => ({ sender: h.personaId, text: h.text })), 
          persona.personaKey
        );

        const newMsg = { personaId: pId, text: response };
        setDiscussion(prev => [...prev, newMsg]);
        currentHistory.push(newMsg);
        
        // Small delay for realism
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Erro na Mente Colmeia:", error);
    } finally {
      setIsProcessing(false);
      setCurrentPersona(null);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 min-h-screen bg-black relative overflow-hidden">
      {/* Hexagonal Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'103.92304845413264\' viewBox=\'0 0 60 103.92304845413264\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 103.92304845413264l-30-17.32050807568877v-34.64101615137754l30-17.32050807568877 30 17.32050807568877v34.64101615137754zM15 77.94228634059948l15 8.660254037844386 15-8.660254037844386v-17.32050807568877l-15-8.660254037844386-15 8.660254037844386z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundSize: '60px 103.9px' }} />

      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]">
          Mente Colmeia<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Personas Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="p-4 border-blue-500/20 bg-blue-950/10 text-center">
            <Network size={32} className="mx-auto text-blue-400 mb-2" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Nós Ativos</h3>
          </GlassCard>
          
          {PERSONAS.map(p => {
            const Icon = p.icon;
            const isThinking = currentPersona === p.id;
            const hasContributed = discussion.some(d => d.personaId === p.id);
            
            return (
              <GlassCard key={p.id} className={cn(
                "p-4 transition-all duration-500", 
                p.border, 
                isThinking ? p.bg : (hasContributed ? "bg-white/10" : "bg-white/5 opacity-50"),
                isThinking && "ring-1 ring-white/30"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-black/50", p.color)}>
                    <Icon size={20} className={isThinking ? "animate-pulse" : ""} />
                  </div>
                  <div>
                    <h4 className={cn("text-sm font-bold", p.color)}>{p.name}</h4>
                    <p className="text-xs text-gray-400">{p.role}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Discussion Area */}
        <GlassCard className="lg:col-span-3 flex flex-col h-[65vh] border-blue-500/20 bg-black/60 backdrop-blur-xl">
          <div className="p-6 border-b border-blue-500/20 bg-blue-950/20">
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Insira um conceito complexo para o conselho debater..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startSync()}
                disabled={isProcessing}
                className="flex-1 bg-black/50 border border-blue-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
              />
              <AnimatedButton 
                onClick={startSync}
                disabled={!topic.trim() || isProcessing}
                className="px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 font-bold tracking-widest uppercase"
              >
                {isProcessing ? <Hexagon className="animate-spin" /> : 'Sincronizar'}
              </AnimatedButton>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!isProcessing && discussion.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-blue-500/30 space-y-4">
                <Hexagon size={64} className="animate-pulse" />
                <p className="text-sm font-mono uppercase tracking-widest">Aguardando input neural...</p>
              </div>
            )}

            <AnimatePresence>
              {discussion.map((msg, i) => {
                const persona = PERSONAS.find(p => p.id === msg.personaId)!;
                const Icon = persona.icon;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex gap-4"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-black/50", persona.border, persona.color)}>
                      <Icon size={20} />
                    </div>
                    <div className={cn("flex-1 p-4 rounded-2xl rounded-tl-none border bg-black/40", persona.border)}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("text-xs font-bold uppercase tracking-wider", persona.color)}>{persona.name}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{msg.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {isProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-gray-700 bg-black/50 text-gray-500">
                  <Hexagon size={20} className="animate-spin" />
                </div>
                <div className="flex-1 p-4 rounded-2xl rounded-tl-none border border-gray-700 bg-black/40 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
