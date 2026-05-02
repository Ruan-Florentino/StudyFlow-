import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon, ChevronLeft } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { useStore } from '../store';

export const NeuralTerminal = ({ onBack }: { onBack: () => void }) => {
  const [history, setHistory] = useState<string[]>([
    'StudyOS v9.9.9 Neural Interface',
    'Establishing direct cortical connection...',
    'Connection established. Type "help" for commands.'
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
            response = 'Available commands: status, hack_focus, inject_dopamine, clear, sudo_learn';
            break;
          case 'status':
            response = 'Neural sync: 99.9%. Cognitive load: Optimal. Flow state: Active.';
            break;
          case 'hack_focus':
            response = 'Bypassing prefrontal cortex limits... Focus increased by 400%.';
            break;
          case 'inject_dopamine':
            response = 'Synthesizing digital dopamine... Motivation levels critical. You are unstoppable.';
            break;
          case 'sudo_learn':
            response = 'Executing root learning protocol. +1000 XP granted.';
            addXP(1000);
            break;
          case 'clear':
            setHistory([]);
            return;
          default:
            response = `Command not recognized: ${cmd}. Type "help" for available commands.`;
        }
        setHistory(prev => [...prev, response]);
      }, 500);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32 min-h-screen bg-black font-mono">
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-bold text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">
          Terminal Neural
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
          <span>root@brain:~#</span>
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
