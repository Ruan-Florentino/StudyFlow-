import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useCelebrationStore } from '../store/useCelebrationStore';
import { Confetti, Button, Card } from '../design-system/components';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';
import { springs } from '../lib/animations';

export const GlobalCelebrations = () => {
  const { xpEvents, removeXPEvent, showLevelUp, newLevel, closeLevelUp } = useCelebrationStore();
  const haptic = useHaptic();
  const reduceMotion = useReducedMotion();
  
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
              initial={{ opacity: 1, y: event.y, x: event.x, scale: reduceMotion ? 1 : 0.5 }}
              animate={{
                opacity: 0,
                y: reduceMotion ? event.y - 48 : event.y - 120,
                x: reduceMotion ? event.x : event.x + (Math.random() * 40 - 20),
                scale: reduceMotion ? 1.1 : 1.5
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.7 : 1.5, ease: "easeOut" }}
              onAnimationComplete={() => removeXPEvent(event.id)}
              className="absolute font-black text-primary text-2xl"
              style={{ textShadow: '0 4px 20px rgba(0, 232, 143, 0.8), 0 0 10px rgba(0, 232, 143, 0.5)' }}
            >
              +{event.amount} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1001] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            {!reduceMotion && <Confetti trigger={1} duration={5000} />}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0, y: 42 }}
              animate={reduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 1.04, opacity: 0, y: -10 }}
              transition={reduceMotion ? { duration: 0.12 } : springs.bouncy}
              className="w-full max-w-sm relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent blur-3xl -z-10 rounded-full" />
              
              <Card variant="gradient" className="p-8 text-center border-primary/30 overflow-visible relative">
                <motion.div 
                  initial={reduceMotion ? { opacity: 0 } : { rotate: -120, scale: 0 }}
                  animate={reduceMotion ? { opacity: 1 } : { rotate: 0, scale: 1 }}
                  transition={reduceMotion ? { duration: 0.12 } : { ...springs.bouncy, delay: 0.2 }}
                  className="w-24 h-24 bg-gradient-to-br from-primary to-primary-deep rounded-full mx-auto flex items-center justify-center border-4 border-[#1c1c20] shadow-[0_0_40px_rgba(0,232,143,0.5)] -mt-16 mb-6"
                >
                  <Trophy size={48} className="text-black" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-primary font-bold tracking-widest text-sm uppercase mb-2 flex items-center justify-center gap-2">
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
