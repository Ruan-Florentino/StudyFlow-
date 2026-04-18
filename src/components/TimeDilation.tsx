import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Zap, ShieldAlert, ChevronLeft, Play, Pause, X, Activity } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { useStore } from '../store/useStore';

export const TimeDilation = ({ onBack }: { onBack: () => void }) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes
  const [dilationFactor, setDilationFactor] = useState(1);
  const { addXP } = useStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((t) => t - 1);
        // Increase dilation factor slowly over time to simulate deep flow
        setDilationFactor((d) => Math.min(d + 0.005, 5)); 
      }, 1000);
    } else if (time <= 0 && isActive) {
      setIsActive(false);
      addXP(500 * Math.floor(dilationFactor)); // Massive XP for deep focus
    }
    return () => clearInterval(interval);
  }, [isActive, time, addXP, dilationFactor]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
    setDilationFactor(1);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate particles for the black hole effect
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    distance: Math.random() * 150 + 50,
    speed: Math.random() * 2 + 1,
    size: Math.random() * 3 + 1,
  }));

  return (
    <div className={cn("p-6 space-y-8 pb-32 min-h-screen transition-colors duration-1000", isActive ? "bg-black" : "bg-slate-950")}>
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
          Dilatação Temporal<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
        {/* Black Hole / Time Distortion Visual */}
        <div className="relative w-80 h-80 flex items-center justify-center mb-12">
          {/* Event Horizon */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-black shadow-[0_0_50px_rgba(168,85,247,0.5)] border border-purple-500/20 z-10"
            animate={{ 
              boxShadow: isActive 
                ? `0 0 ${50 * dilationFactor}px rgba(168,85,247,${0.5 + dilationFactor * 0.1}), inset 0 0 ${20 * dilationFactor}px rgba(0,0,0,1)` 
                : '0 0 50px rgba(168,85,247,0.5), inset 0 0 20px rgba(0,0,0,1)'
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Accretion Disk */}
          <motion.div 
            className="absolute inset-[-20%] rounded-full border-2 border-purple-500/30 border-t-purple-400 border-b-transparent opacity-50"
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: isActive ? 10 / dilationFactor : 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-[-40%] rounded-full border border-blue-500/20 border-l-blue-400 border-r-transparent opacity-30"
            animate={{ rotate: isActive ? -360 : 0 }}
            transition={{ duration: isActive ? 15 / dilationFactor : 30, repeat: Infinity, ease: "linear" }}
          />

          {/* Particles being sucked in */}
          {isActive && particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ 
                x: Math.cos(p.angle) * p.distance, 
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: p.size
              }}
              animate={{ 
                x: 0, 
                y: 0,
                opacity: [0, 1, 0],
                scale: 0
              }}
              transition={{ 
                duration: p.speed / dilationFactor, 
                repeat: Infinity,
                ease: "easeIn",
                delay: Math.random() * 2
              }}
            />
          ))}

          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.div 
              className="text-6xl font-black font-mono text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 1 / dilationFactor, repeat: Infinity }}
            >
              {formatTime(time)}
            </motion.div>
            <div className="text-purple-400 font-mono text-xs mt-2 uppercase tracking-widest">
              Fator: {dilationFactor.toFixed(2)}x
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 z-20">
          <AnimatedButton onClick={resetTimer} variant="secondary" className="p-4 rounded-full border-purple-500/30 hover:bg-purple-500/20">
            <X size={24} className="text-purple-400" />
          </AnimatedButton>
          
          <AnimatedButton 
            onClick={toggleTimer} 
            className={cn(
              "p-6 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-colors",
              isActive ? "bg-purple-600 hover:bg-purple-700" : "bg-white text-black hover:bg-gray-200"
            )}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </AnimatedButton>
        </div>

        {/* Info Text */}
        <div className="mt-12 text-center max-w-md z-20">
          <h3 className="text-xl font-bold text-white mb-2">Câmara Hiperbárica Cognitiva</h3>
          <p className="text-sm text-text-secondary">
            Entre em um estado de fluxo tão profundo que a percepção do tempo é alterada. O Fator de Dilatação aumenta seu ganho de XP exponencialmente.
          </p>
        </div>
      </div>
    </div>
  );
};
