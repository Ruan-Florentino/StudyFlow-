import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Headphones, Activity, ChevronLeft, Play, Pause, Volume2, Brain } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';

const FREQUENCIES = [
  { id: 'gamma', name: 'Ondas Gamma (40Hz)', desc: 'Foco extremo, processamento de informações e aprendizado de alto nível.', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { id: 'beta', name: 'Ondas Beta (20Hz)', desc: 'Atenção ativa, pensamento analítico e resolução de problemas.', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'alpha', name: 'Ondas Alpha (10Hz)', desc: 'Relaxamento alerta, super-aprendizado e fluxo criativo.', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { id: 'theta', name: 'Ondas Theta (6Hz)', desc: 'Meditação profunda, intuição e consolidação de memória.', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { id: 'delta', name: 'Ondas Delta (2Hz)', desc: 'Sono profundo, cura e recuperação neural.', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
];

export const SubliminalAudio = ({ onBack }: { onBack: () => void }) => {
  const [activeFreq, setActiveFreq] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const togglePlay = (freqId: string) => {
    if (activeFreq === freqId && isPlaying) {
      stopAudio();
    } else {
      playAudio(freqId);
    }
  };

  const playAudio = (freqId: string) => {
    stopAudio();
    setActiveFreq(freqId);
    setIsPlaying(true);

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    let freqValue = 40;
    if (freqId === 'gamma') freqValue = 40;
    if (freqId === 'beta') freqValue = 20;
    if (freqId === 'alpha') freqValue = 10;
    if (freqId === 'theta') freqValue = 6;
    if (freqId === 'delta') freqValue = 2;

    // Binaural beat simulation: base frequency + offset
    const baseFreq = 200;
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq + freqValue, ctx.currentTime);

    gain.gain.setValueAtTime(volume / 100, ctx.currentTime);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc2.start();

    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    
    // Store osc2 to stop it later
    (oscillatorRef as any).osc2 = osc2;
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      if ((oscillatorRef as any).osc2) {
        (oscillatorRef as any).osc2.stop();
      }
    }
    setIsPlaying(false);
    setActiveFreq(null);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol / 100, audioCtxRef.current.currentTime);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 min-h-screen bg-black">
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={() => { stopAudio(); onBack(); }} variant="secondary" className="p-2 rounded-full border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]">
          Frequências Neurais<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center space-y-6 border-indigo-500/30 bg-indigo-950/10">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {isPlaying ? (
              <>
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-indigo-500/50"
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div 
                  className="absolute inset-4 rounded-full border-2 border-indigo-400/50"
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />
              </>
            ) : null}
            <div className="w-32 h-32 rounded-full bg-indigo-900/50 border border-indigo-500/50 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <Brain size={48} className={cn("text-indigo-400", isPlaying && "animate-pulse")} />
            </div>
          </div>
          
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-mono">
              <Volume2 size={16} />
              <span>Volume: {volume}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-full accent-indigo-500"
            />
          </div>
        </GlassCard>

        <div className="space-y-4">
          {FREQUENCIES.map(freq => (
            <GlassCard 
              key={freq.id}
              className={cn(
                "p-4 border transition-all duration-300 cursor-pointer",
                activeFreq === freq.id ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-indigo-900/20" : "border-white/10 hover:border-indigo-500/30"
              )}
              onClick={() => togglePlay(freq.id)}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", freq.bg, freq.color)}>
                  {activeFreq === freq.id && isPlaying ? <Activity size={24} className="animate-pulse" /> : <Headphones size={24} />}
                </div>
                <div className="flex-1">
                  <h4 className={cn("font-bold", freq.color)}>{freq.name}</h4>
                  <p className="text-xs text-text-secondary mt-1">{freq.desc}</p>
                </div>
                <AnimatedButton 
                  className={cn("p-3 rounded-full", activeFreq === freq.id && isPlaying ? "bg-indigo-600 text-white" : "bg-white/5 text-white hover:bg-white/10")}
                  onClick={(e: any) => { e.stopPropagation(); togglePlay(freq.id); }}
                >
                  {activeFreq === freq.id && isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </AnimatedButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
