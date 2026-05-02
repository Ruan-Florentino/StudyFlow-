import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, Check, X, HelpCircle, Zap, Volume2, Loader2, Star } from 'lucide-react';
import { Badge } from './UI';
import { aiService } from '../services/aiService';
import { safePlayAudio } from '../lib/studyUtils';
import { useStore, usePlan } from '../store';
import { PaywallModal } from './PaywallModal';

interface FlashcardProps {
  front: string;
  back: string;
  subject?: string;
  onDifficulty?: (difficulty: 'again' | 'hard' | 'good' | 'easy') => void;
  showControls?: boolean;
  currentInterval?: number;
  easeFactor?: number;
}

const LIMIT = 10;

export const Flashcard: React.FC<FlashcardProps> = ({ 
  front, 
  back, 
  subject, 
  onDifficulty,
  showControls = true,
  currentInterval = 0,
  easeFactor = 2.5
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { dailyFlashcardsUsed, incrementFlashcardUsage } = useStore();
  const { isPremium } = usePlan();

  const formatInterval = (days: number) => {
    if (days === 0) return '< 1d';
    if (days < 30) return `${days}d`;
    if (days < 365) return `${Math.round(days / 30)}m`;
    return `${Math.round(days / 365)}a`;
  };

  const nextHard = Math.max(1, Math.round(currentInterval * 1.2));
  const nextGood = Math.round(currentInterval === 0 ? 1 : currentInterval * easeFactor);
  const nextEasy = Math.round(currentInterval === 0 ? 4 : currentInterval * easeFactor * 1.3);

  const playAudio = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (isPlaying || isLoadingAudio) return;
    
    try {
      setIsLoadingAudio(true);
      const audioData = await aiService.generateAudio(text);
      if (audioData) {
        const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await safePlayAudio(audio);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      {!isPremium && (
        <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${dailyFlashcardsUsed >= LIMIT ? 'bg-red-500' : 'bg-primary animate-pulse'}`} />
            <span className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">
              {dailyFlashcardsUsed} de {LIMIT} flashcards usados hoje
            </span>
          </div>
          <button 
            onClick={() => setShowPaywall(true)}
            className="text-[9px] font-bold text-primary hover:underline"
          >
            Assine Premium para ilimitado
          </button>
        </div>
      )}

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} feature="flashcards" />}

      <motion.div 
        className="relative w-full aspect-[3/4] cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 glass rounded-[40px] p-8 flex flex-col items-center justify-center text-center backface-hidden border-2 border-primary/20 bg-card/50 shadow-2xl">
          {subject && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">
                {subject}
              </div>
            </div>
          )}
          <button 
            onClick={(e) => playAudio(e, front)}
            className="absolute top-8 right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
            disabled={isLoadingAudio || isPlaying}
          >
            {isLoadingAudio ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className={isPlaying ? "text-primary" : ""} />}
          </button>
          <h3 className="text-2xl font-bold leading-tight text-white">{front}</h3>
          <div className="absolute bottom-10 flex items-center gap-2 text-text-secondary text-[10px] font-bold uppercase tracking-widest opacity-50">
            <RotateCw size={12} /> Toque para revelar
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 glass rounded-[40px] p-8 flex flex-col items-center justify-center text-center backface-hidden border-2 border-primary/20 bg-primary/5 shadow-2xl" style={{ transform: 'rotateY(180deg)' }}>
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <div className="px-3 py-1 bg-warning/10 border border-warning/20 rounded-full text-[10px] font-bold text-warning uppercase tracking-widest">
              Resposta
            </div>
          </div>
          <button 
            onClick={(e) => playAudio(e, back)}
            className="absolute top-8 right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
            disabled={isLoadingAudio || isPlaying}
          >
            {isLoadingAudio ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className={isPlaying ? "text-primary" : ""} />}
          </button>
          <div className="w-full max-h-full overflow-y-auto no-scrollbar py-4">
            <h3 className="text-xl font-medium text-white/90 leading-relaxed">{back}</h3>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFlipped && showControls && onDifficulty && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-4 gap-2 mt-6"
          >
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (!isPremium && dailyFlashcardsUsed >= LIMIT) {
                  setShowPaywall(true);
                  return;
                }
                incrementFlashcardUsage();
                onDifficulty('again'); 
                setIsFlipped(false); 
              }} 
              className="flex flex-col items-center gap-1 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500/20 transition-colors group"
            >
              <X size={16} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[10px]">De novo</span>
              <span className="text-[8px] uppercase font-bold opacity-60">{"< 1d"}</span>
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (!isPremium && dailyFlashcardsUsed >= LIMIT) {
                  setShowPaywall(true);
                  return;
                }
                incrementFlashcardUsage();
                onDifficulty('hard'); 
                setIsFlipped(false); 
              }} 
              className="flex flex-col items-center gap-1 p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500 hover:bg-orange-500/20 transition-colors group"
            >
              <HelpCircle size={16} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[10px]">Difícil</span>
              <span className="text-[8px] uppercase font-bold opacity-60">{formatInterval(nextHard)}</span>
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (!isPremium && dailyFlashcardsUsed >= LIMIT) {
                  setShowPaywall(true);
                  return;
                }
                incrementFlashcardUsage();
                onDifficulty('good'); 
                setIsFlipped(false); 
              }} 
              className="flex flex-col items-center gap-1 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-500 hover:bg-blue-500/20 transition-colors group"
            >
              <Check size={16} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[10px]">Bom</span>
              <span className="text-[8px] uppercase font-bold opacity-60">{formatInterval(nextGood)}</span>
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (!isPremium && dailyFlashcardsUsed >= LIMIT) {
                  setShowPaywall(true);
                  return;
                }
                incrementFlashcardUsage();
                onDifficulty('easy'); 
                setIsFlipped(false); 
              }} 
              className="flex flex-col items-center gap-1 p-3 bg-primary/10 border border-primary/20 rounded-2xl text-primary hover:bg-primary/20 transition-colors group"
            >
              <Zap size={16} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[10px]">Fácil</span>
              <span className="text-[8px] uppercase font-bold opacity-60">{formatInterval(nextEasy)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
