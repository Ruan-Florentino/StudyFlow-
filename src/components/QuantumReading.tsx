import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Play, Pause, RotateCcw, ChevronLeft, BookOpen, FastForward } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';

export const QuantumReading = ({ onBack }: { onBack: () => void }) => {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(400);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [mode, setMode] = useState<'input' | 'rsvp' | 'bionic'>('input');

  const handleStartRSVP = () => {
    const splitWords = text.trim().split(/\s+/).filter(w => w.length > 0);
    if (splitWords.length === 0) return;
    setWords(splitWords);
    setWordIndex(0);
    setIsPlaying(true);
    setMode('rsvp');
  };

  const handleStartBionic = () => {
    if (!text.trim()) return;
    setMode('bionic');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && mode === 'rsvp' && wordIndex < words.length) {
      const msPerWord = 60000 / wpm;
      interval = setInterval(() => {
        setWordIndex(i => {
          if (i + 1 >= words.length) {
            setIsPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, msPerWord);
    }
    return () => clearInterval(interval);
  }, [isPlaying, wordIndex, words.length, wpm, mode]);

  const renderBionic = (textStr: string) => {
    return textStr.split(/\s+/).map((word, i) => {
      const mid = Math.ceil(word.length / 2);
      return (
        <span key={i} className="mr-1.5 leading-relaxed text-lg">
          <b className="font-black text-white">{word.slice(0, mid)}</b>
          <span className="text-white/60">{word.slice(mid)}</span>
        </span>
      );
    });
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 animate-in slide-in-from-right duration-500 min-h-screen">
      <header className="flex items-center gap-4">
        <AnimatedButton onClick={mode === 'input' ? onBack : () => { setMode('input'); setIsPlaying(false); }} variant="secondary" className="p-2 rounded-full">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-2xl font-premium-title italic text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
          Leitura Quântica<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      {mode === 'input' && (
        <GlassCard className="p-6 space-y-6 relative overflow-hidden group border-blue-500/20 bg-blue-500/5">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FastForward size={120} className="text-blue-500" />
          </div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-blue-400">Aceleração Cognitiva</h3>
            <p className="text-sm text-text-secondary">Cole seu texto para treinar leitura dinâmica (RSVP) ou leitura biônica. Aumente sua velocidade de absorção em até 3x.</p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole o texto que deseja ler rapidamente..."
            className="w-full h-48 bg-black/20 border border-blue-500/20 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-blue-500/50 transition-colors relative z-10"
          />

          <div className="flex gap-4 relative z-10">
            <AnimatedButton onClick={handleStartRSVP} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white" disabled={!text.trim()}>
              <Zap size={20} className="mr-2" />
              Modo RSVP (Flash)
            </AnimatedButton>
            <AnimatedButton onClick={handleStartBionic} variant="secondary" className="flex-1 py-4 border-blue-500/30 hover:border-blue-500/60" disabled={!text.trim()}>
              <BookOpen size={20} className="mr-2 text-blue-400" />
              Leitura Biônica
            </AnimatedButton>
          </div>
        </GlassCard>
      )}

      {mode === 'rsvp' && (
        <div className="space-y-8 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-2 w-full max-w-md">
            <div className="flex justify-between text-xs text-text-secondary font-mono mb-2">
              <span>Velocidade: {wpm} WPM</span>
              <span>Progresso: {Math.round((wordIndex / (words.length || 1)) * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="200" 
              max="1000" 
              step="50"
              value={wpm} 
              onChange={(e) => setWpm(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <GlassCard className="w-full max-w-2xl h-64 flex items-center justify-center relative overflow-hidden border-blue-500/30 shadow-[0_0_30px_rgba(96,165,250,0.15)]">
            {/* Focus lines */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-blue-500/20 -translate-y-1/2" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-500/20 -translate-x-1/2" />
            
            <div className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {words[wordIndex] || "FIM"}
            </div>
          </GlassCard>

          <div className="flex items-center gap-6">
            <AnimatedButton onClick={() => { setWordIndex(0); setIsPlaying(false); }} variant="secondary" className="p-4 rounded-full">
              <RotateCcw size={24} />
            </AnimatedButton>
            <AnimatedButton 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="p-6 rounded-full bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
            </AnimatedButton>
          </div>
        </div>
      )}

      {mode === 'bionic' && (
        <GlassCard className="p-8 border-blue-500/20 bg-black/40">
          <div className="prose prose-invert max-w-none">
            <p className="text-justify">
              {renderBionic(text)}
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
