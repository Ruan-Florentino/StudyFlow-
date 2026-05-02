import React, { useState } from 'react';
import { motion } from 'motion/react';
import { doc, runTransaction, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  Star, 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Brain, 
  AlertCircle 
} from 'lucide-react';
import Markdown from 'react-markdown';
import { useStore, Question } from '../store';
import { GlassCard, AnimatedButton } from './UI';
import { aiService } from '../services/aiService';
import { playSuccessSound, triggerConfetti } from '../lib/studyUtils';

const InlineQuestionCard = ({ q }: { q: Question }) => {
  const { user, loading } = useAuth();
  const { addXP, addToHistory, toggleFavorite, favorites, reviewLater, toggleReviewLater, updateMastery } = useStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAnswer = (idx: number) => {
    if (confirmed) return;
    setSelectedOption(idx);
  };

  const confirmAnswer = async () => {
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);
    const isCorrect = selectedOption === q.resposta;
    if (isCorrect) {
      playSuccessSound();
      triggerConfetti();
    }
    const entry = {
      questionId: q.id,
      userAnswer: selectedOption,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    addToHistory(entry);
    updateMastery(q.materia, isCorrect ? 100 : 0);
    
    if (isCorrect) {
      addXP(20);
    }
    // Sync with backend
    try {
      if (!loading && user?.uid) {
        await setDoc(
          doc(db, 'users', user.uid, 'history', entry.questionId),
          entry
        );
        
        if (isCorrect) {
          await runTransaction(db, async (tx) => {
            const userRef = doc(db, 'users', user.uid);
            const snap = await tx.get(userRef);
            
            const currentXp = snap.exists() ? (snap.data().xp ?? 0) : 0;
            const newXp = currentXp + 20;
            const newLevel = Math.floor(newXp / 1000) + 1;
            
            tx.set(userRef, { 
              xp: newXp, 
              level: newLevel 
            }, { merge: true });
          });
        }
      }
    } catch (e) {
      console.error("Failed to sync from InlineQuestionCard", e);
    }
    
    setShowExplanation(true);
  };

  const explainWithAI = async () => {
    setLoadingAI(true);
    try {
      const explanation = await aiService.explainQuestion(q.pergunta, q.alternativas, q.alternativas[q.resposta]);
      setAiExplanation(explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const explainErrorWithAI = async () => {
    if (selectedOption === null) return;
    setLoadingAI(true);
    try {
      const explanation = await aiService.explainError(q.pergunta, q.alternativas, q.alternativas[q.resposta], q.alternativas[selectedOption]);
      setAiExplanation(explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <GlassCard className="p-5 space-y-6 group hover:border-primary/30 transition-colors relative overflow-hidden" glow>
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-0.5 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest ${
            q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
            q.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
            'bg-red-500/10 text-red-500'
          }`}>
            {q.difficulty}
          </span>
          <span className="px-2 py-0.5 bg-white/5 text-text-secondary text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-white/5">
            {q.prova} {q.ano}
          </span>
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-blue-500/20">
            {q.accuracyRate ?? (q.difficulty === 'Easy' ? 75 : q.difficulty === 'Medium' ? 45 : 20)}% ACERTO
          </span>
          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-purple-500/20">
            {q.materia} • {q.assunto}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toggleReviewLater(q.id)}
            className={`p-1.5 rounded-lg border transition-all ${reviewLater.includes(q.id) ? 'bg-orange-500/20 text-orange-500 border-orange-500/50' : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'}`}
            title="Revisar Depois"
          >
            <Bookmark size={14} fill={reviewLater.includes(q.id) ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => toggleFavorite(q.id)}
            className={`p-1.5 rounded-lg border transition-all ${favorites.includes(q.id) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'}`}
            title="Favoritar"
          >
            <Star size={14} fill={favorites.includes(q.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <p className="text-sm font-medium leading-relaxed text-white/90 relative z-10">{q.pergunta}</p>
      
      <div className="space-y-3 relative z-10">
        {q.alternativas.map((opt, i) => {
          let style = "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10";
          let iconColor = "bg-white/5 text-text-secondary group-hover:bg-white/10";
          
          if (selectedOption !== null) {
            if (confirmed) {
              if (i === q.resposta) {
                style = "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,255,148,0.1)]";
                iconColor = "bg-primary text-black";
              } else if (i === selectedOption) {
                style = "border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                iconColor = "bg-red-500 text-white";
              } else {
                style = "opacity-30 border-white/5 bg-transparent grayscale";
              }
            } else if (i === selectedOption) {
              style = "border-primary bg-primary/30 text-primary shadow-[0_0_15px_rgba(0,255,148,0.2)]";
              iconColor = "bg-primary text-black";
            }
          }

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(i)}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 group ${style}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-premium-mono font-bold shrink-0 mt-0.5 transition-colors ${iconColor}`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm font-medium leading-relaxed mt-1">{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {!confirmed && selectedOption !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2 relative z-10">
          <AnimatedButton onClick={confirmAnswer} className="w-full py-3" glow>
            Confirmar Resposta
          </AnimatedButton>
        </motion.div>
      )}

      {confirmed && showExplanation && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-4 pt-4 border-t border-white/10 relative z-10"
        >
          <div className={`p-4 rounded-xl border ${selectedOption === q.resposta ? 'bg-primary/5 border-primary/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              {selectedOption === q.resposta ? (
                <>
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="text-sm font-bold text-primary">Resposta Correta!</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-red-500" />
                  <span className="text-sm font-bold text-red-500">Resposta Incorreta</span>
                </>
              )}
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{q.explicacao}</p>
          </div>

          <div className="flex gap-3">
            <AnimatedButton 
              onClick={explainWithAI} 
              disabled={loadingAI}
              variant="secondary" 
              className="flex-1 border-primary/20 bg-primary/5 text-primary text-xs py-2"
            >
              {loadingAI ? <Loader2 size={16} className="animate-spin mx-auto" /> : <><Brain size={16} className="mr-2 inline-block" /> Explicar com IA</>}
            </AnimatedButton>
            
            {selectedOption !== q.resposta && (
              <AnimatedButton 
                onClick={explainErrorWithAI} 
                disabled={loadingAI}
                variant="secondary" 
                className="flex-1 border-red-500/20 bg-red-500/5 text-red-500 text-xs py-2"
              >
                {loadingAI ? <Loader2 size={16} className="animate-spin mx-auto" /> : <><AlertCircle size={16} className="mr-2 inline-block" /> Por que errei?</>}
              </AnimatedButton>
            )}
          </div>

          {aiExplanation && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-xl border border-primary/20 bg-primary/5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain size={16} className="text-primary" />
                <span className="text-xs font-premium-mono font-bold text-primary uppercase tracking-widest">Explicação da IA</span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <Markdown>{aiExplanation}</Markdown>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </GlassCard>
  );
};

export default InlineQuestionCard;
