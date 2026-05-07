import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon, ChevronLeft } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { useStore } from '../store';

export const NeuralTerminal = ({ onBack }: { onBack: () => void }) => {
  const [history, setHistory] = useState<string[]>([
    'StudyOS v2.0 Learning Console',
    'Carregando ambiente de estudo...',
    'Pronto. Digite "help" para ver os comandos.'
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { addXP } = useStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const cmd = input.trim().toLowerCase();
      setHistory(prev => [...prev, `> ${cmd}`]);
      setInput('');

      setTimeout(() => {
        let response = '';
        switch (cmd) {
          case 'help':
            response = 'Comandos disponíveis: status, boost_focus, energize, clear, quick_points';
            break;
          case 'status':
            response = 'Foco: alto. Carga cognitiva: equilibrada. Sessão ativa.';
            break;
          case 'boost_focus':
            response = 'Ativando rotina de foco... concentração reforçada.';
            break;
          case 'energize':
            response = 'Aplicando reforço motivacional. Continue no ritmo.';
            break;
          case 'quick_points':
            response = 'Bônus aplicado. +1000 XP concedidos.';
            addXP(1000);
            break;
          case 'clear':
            setHistory([]);
            return;
          default:
            response = `Comando não reconhecido: ${cmd}. Digite "help" para ver as opções.`;
        }
        setHistory(prev => [...prev, response]);
      }, 500);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 min-h-screen bg-black font-mono">
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-bold text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">
          Console de Estudos
        </h2>
      </header>

      <GlassCard className="p-6 border-emerald-500/30 bg-black/80 h-[70vh] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(16,185,129,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto space-y-2 text-emerald-400 text-sm relative z-10">
          {history.map((line, i) => (
            <div key={i} className={line.startsWith('>') ? 'text-white' : 'text-emerald-500/80'}>
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex items-center gap-2 text-emerald-400 relative z-10 border-t border-emerald-500/30 pt-4">
          <span>study@console:~$</span>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-emerald-500/30"
            autoFocus
            spellCheck={false}
          />
        </div>
      </GlassCard>
    </div>
  );
};
