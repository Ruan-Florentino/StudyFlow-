import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Sliders, Zap, Eye, Wind, Sun } from 'lucide-react';
import { useStore } from '../store';

export const RealityTuner = ({ onBack }: { onBack: () => void }) => {
  const { themeColor, setThemeColor } = useStore();
  const [constants, setConstants] = useState({
    gravity: 9.81,
    lightSpeed: 299792,
    entropy: 0.001,
    neuralSync: 0.999,
    timeDilation: 1.0
  });

  const handleTweak = (key: keyof typeof constants, val: number) => {
    setConstants(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#E4E3E0] text-[#141414] font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-[#141414] p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-[#141414] hover:text-[#E4E3E0] p-1 transition-colors border border-[#141414]">
            <ChevronLeft size={20} />
          </button>
          <span className="italic font-serif text-xs opacity-50 uppercase tracking-widest">System / Reality / Tuner</span>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-tighter flex items-center gap-4">
          <span className="flex items-center gap-1"><Zap size={12} className="text-orange-500" /> Kernel: v9.9.9</span>
          <span className="opacity-30">|</span>
          <span>Status: Unstable</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12">
        {/* Sidebar: Controls */}
        <div className="md:col-span-4 border-r border-[#141414] p-8 space-y-12 overflow-y-auto custom-scrollbar">
          <section className="space-y-6">
            <div className="flex items-center gap-2 opacity-50">
              <Sliders size={14} />
              <h3 className="italic font-serif text-xs uppercase tracking-widest">Physical Constants</h3>
            </div>
            
            <div className="space-y-8">
              {Object.entries(constants).map(([key, val]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold">
                    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-orange-600">{val.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={val * 2} 
                    step={val / 100}
                    value={val}
                    onChange={(e) => handleTweak(key as any, parseFloat(e.target.value))}
                    className="w-full accent-[#141414] h-1 bg-black/10 appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 opacity-50">
              <Sun size={14} />
              <h3 className="italic font-serif text-xs uppercase tracking-widest">Visual Spectrum</h3>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#141414', '#F3F4F6', '#FF4E00', '#000000'].map(color => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`aspect-square border border-[#141414] transition-transform hover:scale-110 ${themeColor === color ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Main: Visualization */}
        <div className="md:col-span-8 p-12 flex flex-col justify-center items-center relative bg-white/30">
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#141414 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <motion.div 
            animate={{ 
              rotate: constants.entropy * 1000,
              scale: constants.gravity / 9.81,
              opacity: constants.neuralSync
            }}
            className="w-64 h-64 border-2 border-[#141414] flex items-center justify-center relative"
          >
            <div className="absolute inset-0 border border-dashed border-[#141414]/30 animate-spin-slow" />
            <div className="text-center space-y-2">
              <div className="text-4xl font-serif italic">Reality</div>
              <div className="text-[10px] uppercase tracking-[0.5em] opacity-50">Is Malleable</div>
            </div>
            
            {/* Floating particles based on constants */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, (Math.random() - 0.5) * 200 * constants.timeDilation],
                  y: [0, (Math.random() - 0.5) * 200 * constants.timeDilation],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2 / constants.timeDilation, repeat: Infinity }}
                className="absolute w-1 h-1 bg-orange-500 rounded-full"
              />
            ))}
          </motion.div>

          <div className="mt-16 max-w-md text-center space-y-4">
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-[10px] uppercase opacity-30">Stability</div>
                <div className="text-xl font-bold">{(constants.neuralSync * 100).toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase opacity-30">Flow</div>
                <div className="text-xl font-bold">{constants.timeDilation.toFixed(2)}x</div>
              </div>
            </div>
            <p className="text-[10px] leading-relaxed opacity-50 italic font-serif">
              "A realidade não é o que você vê, mas o que você escolhe processar. Ajuste os parâmetros para encontrar sua frequência ideal de existência."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
