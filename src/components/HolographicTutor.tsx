import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, MessageSquare, ChevronLeft, Send, Sparkles, Cpu, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { aiService } from '../services/aiService';
import Markdown from 'react-markdown';

export const HolographicTutor = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Olá. Eu sou seu Tutor Interativo. Vamos montar seu próximo passo de estudo?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'pt-BR';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setInput(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || !synthRef.current) return;
    
    synthRef.current.cancel(); // Stop current speech
    
    // Clean markdown before speaking
    const cleanText = text.replace(/[#*_~`]/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const prompt = `Você é um tutor de estudos objetivo. Responda de forma concisa, clara e direta.
      
      Histórico:
      ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
      user: ${userMsg}
      assistant:`;

      const response = await aiService.generateStudyPlan(prompt); // Using generateStudyPlan as a generic text generator
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      speakText(response);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Não consegui responder agora. Tente novamente em instantes.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 min-h-screen bg-black flex flex-col">
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <div className="flex-1">
          <h2 className="text-3xl font-premium-title italic text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
            Tutor Interativo<span className="text-white font-normal not-italic ml-1">.</span>
          </h2>
        </div>
        <AnimatedButton 
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            if (voiceEnabled && synthRef.current) synthRef.current.cancel();
          }} 
          variant="secondary" 
          className={cn("p-2 rounded-full border-cyan-500/30", voiceEnabled ? "text-cyan-400 hover:bg-cyan-500/10" : "text-gray-500 hover:bg-gray-800")}
        >
          {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </AnimatedButton>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Hologram Display */}
        <GlassCard className="lg:col-span-1 p-8 flex flex-col items-center justify-center border-cyan-500/30 bg-cyan-950/10 relative overflow-hidden min-h-[300px]">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(34,211,238,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
          
          <motion.div 
            className="relative w-48 h-48 flex items-center justify-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Hologram Base */}
            <div className="absolute bottom-0 w-32 h-8 bg-cyan-500/20 rounded-[100%] blur-md" />
            <div className="absolute bottom-2 w-16 h-4 bg-cyan-400/40 rounded-[100%] blur-sm" />
            
            {/* Avatar */}
            <div className={cn(
              "w-32 h-32 rounded-full border-2 border-cyan-400/50 flex items-center justify-center bg-cyan-950/50 backdrop-blur-sm shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300",
              isLoading && "border-cyan-300 shadow-[0_0_50px_rgba(34,211,238,0.6)] scale-105",
              isSpeaking && "border-cyan-200 shadow-[0_0_60px_rgba(34,211,238,0.8)] animate-pulse"
            )}>
              <Cpu size={64} className={cn("text-cyan-400 transition-all", (isLoading || isSpeaking) && "text-cyan-200")} />
            </div>
          </motion.div>
          
          <div className="mt-8 text-center space-y-2">
            <h3 className="text-xl font-bold text-cyan-300 font-mono tracking-widest uppercase">Mentor de Estudos</h3>
            <p className="text-xs text-cyan-500/70 font-mono">
              Status: {isLoading ? 'Processando...' : isSpeaking ? 'Falando...' : isListening ? 'Ouvindo...' : 'Online'}
            </p>
          </div>
        </GlassCard>

        {/* Chat Interface */}
        <GlassCard className="lg:col-span-2 flex flex-col border-cyan-500/20 bg-black/50 h-[60vh] lg:h-auto">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-4",
                  msg.role === 'user' 
                    ? "bg-cyan-600 text-white rounded-tr-none" 
                    : "bg-cyan-950/50 border border-cyan-500/30 text-cyan-50 rounded-tl-none"
                )}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-cyan-500/20">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-cyan-950/50 border border-cyan-500/30 rounded-2xl rounded-tl-none p-4 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-cyan-500/20 bg-cyan-950/20">
            <div className="flex gap-2 items-center">
              <AnimatedButton 
                onClick={toggleListening}
                variant="secondary"
                className={cn(
                  "p-3 rounded-xl border-cyan-500/30 transition-colors", 
                  isListening ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse" : "text-cyan-400 hover:bg-cyan-500/10"
                )}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </AnimatedButton>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Ouvindo..." : "Pergunte qualquer coisa..."}
                className="flex-1 bg-black/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <AnimatedButton 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl disabled:opacity-50 flex items-center justify-center"
              >
                <Send size={18} />
              </AnimatedButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
