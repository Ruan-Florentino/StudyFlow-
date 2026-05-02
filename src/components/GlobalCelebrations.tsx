import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCelebrationStore } from '../store/useCelebrationStore';
import { Confetti, Button, Card } from '../design-system/components';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export const GlobalCelebrations = () => {
  const { xpEvents, removeXPEvent, showLevelUp, newLevel, closeLevelUp } = useCelebrationStore();
  const haptic = useHaptic();
  
  useEffect(() => {
    if (showLevelUp) {
      haptic('success');
      setTimeout(() => haptic('heavy'), 200);
      setTimeout(() => haptic('heavy'), 400);
    }
  }, [showLevelUp, haptic]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[1000]">
        <AnimatePresence>
          {xpEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 1, y: event.y, x: event.x, scale: 0.5 }}
              animate={{ opacity: 0, y: event.y - 120, x: event.x + (Math.random() * 40 - 20), scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              onAnimationComplete={() => removeXPEvent(event.id)}
              className="absolute font-black text-[#00E88F] text-2xl"
              style={{ textShadow: '0 4px 20px rgba(0, 232, 143, 0.8), 0 0 10px rgba(0, 232, 143, 0.5)' }}
            >
              +{event.amount} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showLevelUp && (
          <div className="absolute inset-0 z-[1001] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <Confetti trigger={1} duration={5000} />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-full max-w-sm relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#00E88F]/20 to-transparent blur-3xl -z-10 rounded-full" />
              
              <Card variant="gradient" className="p-8 text-center border-[#00E88F]/30 overflow-visible relative">
                <motion.div 
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 bg-gradient-to-br from-[#00E88F] to-[#00A867] rounded-full mx-auto flex items-center justify-center border-4 border-[#1c1c20] shadow-[0_0_40px_rgba(0,232,143,0.5)] -mt-16 mb-6"
                >
                  <Trophy size={48} className="text-black" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-[#00E88F] font-bold tracking-widest text-sm uppercase mb-2 flex items-center justify-center gap-2">
                    <Sparkles size={14} /> Subiu de Nível! <Sparkles size={14} />
                  </p>
                  <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">
                    NÍVEL {newLevel}
                  </h2>
                  <p className="text-white/60 mb-8 leading-relaxed">
                    Você está dominando sua jornada de estudos. O próximo nível será ainda mais épico!
                  </p>
                  
                  <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg"
                    onClick={closeLevelUp}
                    className="text-lg group"
                  >
                    🚀 Continuar evoluindo
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
