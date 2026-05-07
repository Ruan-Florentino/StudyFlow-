import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { easings, springs } from '../lib/animations/easings';
import { useAuth } from '../contexts/AuthContext';
import { recordQuestionAttempt } from '../lib/persistence';
import { 
  Sparkles, 
  Brain, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Trophy,
  Target,
  Zap,
  Bookmark,
  Star,
  ChevronLeft
} from 'lucide-react';
import { useStore, Question } from '../store';
import { GlassCard, AnimatedButton, Header } from './UI';
import { QuestionStatusBadge } from './QuestionStatusBadge';
import { aiService } from '../services/aiService';
import { playSuccessSound, triggerConfetti } from '../lib/studyUtils';

const MarkdownContent = lazy(() =>
  import('./shared/MarkdownContent').then((module) => ({
    default: module.MarkdownContent,
  }))
);

interface TrainingSessionProps {
  questions: Question[];
  onComplete: (correct: number, userAnswers: Record<number, number>) => void;
  onCancel: () => void;
}

const TrainingSession = ({ questions, onComplete, onCancel }: TrainingSessionProps) => {
  const { user } = useAuth();
  const { toggleFavorite, favorites, reviewLater, toggleReviewLater, recordQuestionView } =
    useStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const reduceMotion = useReducedMotion() ?? false;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!currentQuestion) return;
    recordQuestionView(currentQuestion.id);
  }, [currentIndex, currentQuestion?.id, recordQuestionView]);

  const handleAnswer = (idx: number) => {
    if (confirmed) return;
    setSelectedOption(idx);
  };

  const confirmAnswer = async () => {
    if (selectedOption === null || confirmed) return;
    
    setConfirmed(true);
    const isCorrect = selectedOption === currentQuestion.resposta;
    
    setUserAnswers(prev => ({ ...prev, [currentIndex]: selectedOption }));

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      playSuccessSound();
      triggerConfetti();
      
      // Auto-next after delay if correct
      autoNextTimeoutRef.current = setTimeout(() => {
        handleNext();
      }, 3000);
    }

    await recordQuestionAttempt({
      userId: user?.id ?? null,
      question: currentQuestion,
      userAnswer: selectedOption,
      isCorrect,
      xpAward: isCorrect ? 20 : 0,
    });

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setConfirmed(false);
      setShowExplanation(false);
      setAiExplanation('');
    } else {
      onComplete(correctCount + (selectedOption === currentQuestion.resposta ? 1 : 0), { ...userAnswers, [currentIndex]: selectedOption! });
    }
  };

  const explainWithAI = async () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    setLoadingAI(true);
    try {
      const explanation = await aiService.explainQuestion(
        currentQuestion.pergunta, 
        currentQuestion.alternativas, 
        currentQuestion.alternativas[currentQuestion.resposta]
      );
      setAiExplanation(explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const explainErrorWithAI = async () => {
    if (selectedOption === null) return;
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    setLoadingAI(true);
    try {
      const explanation = await aiService.explainError(
        currentQuestion.pergunta, 
        currentQuestion.alternativas, 
        currentQuestion.alternativas[currentQuestion.resposta], 
        currentQuestion.alternativas[selectedOption]
      );
      setAiExplanation(explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28">
      <Header 
        title={`Questão ${currentIndex + 1}`}
        subtitle={`${questions.length} restantes`}
        icon={Brain}
        color="primary"
        onBack={onCancel}
        rightContent={
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-xs font-premium-mono font-bold text-primary uppercase tracking-widest leading-none">Acertos</p>
               <p className="text-sm font-bold text-white">{correctCount}</p>
             </div>
             <div className="w-12 h-12 flex items-center justify-center relative">
               <svg className="w-full h-full -rotate-90">
                 <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/10" />
                 <motion.circle 
                    cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-primary"
                    strokeDasharray={125.6}
                    initial={{ strokeDashoffset: 125.6 }}
                    animate={{ strokeDashoffset: 125.6 - (125.6 * progress / 100) }}
                    transition={{ duration: 0.5 }}
                    strokeLinecap="round"
                 />
               </svg>
               <span className="absolute text-[10px] font-bold text-white">{currentIndex + 1}</span>
             </div>
          </div>
        }
      />

      <div className="space-y-6">
        <GlassCard className="p-6 space-y-8 relative overflow-hidden" glow>
          {/* Tags top line */}
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest ${
                currentQuestion.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                currentQuestion.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-2 py-0.5 bg-white/5 text-text-secondary text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-white/5">
                {currentQuestion.prova} {currentQuestion.ano}
              </span>
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-purple-500/20">
                {currentQuestion.materia}
              </span>
              <QuestionStatusBadge questionId={currentQuestion.id} compact />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => toggleReviewLater(currentQuestion.id)}
                className={`p-2 rounded-xl border transition-all ${reviewLater.includes(currentQuestion.id) ? 'bg-orange-500/20 text-orange-500 border-orange-500/50' : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'}`}
              >
                <Bookmark size={16} fill={reviewLater.includes(currentQuestion.id) ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={() => toggleFavorite(currentQuestion.id)}
                className={`p-2 rounded-xl border transition-all ${favorites.includes(currentQuestion.id) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'}`}
              >
                <Star size={16} fill={favorites.includes(currentQuestion.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <p className="text-lg font-medium leading-relaxed text-white/90 relative z-10">{currentQuestion.pergunta}</p>
          
          <div className="space-y-3 relative z-10">
            {currentQuestion.alternativas.map((opt, i) => {
              let style = "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10";
              let iconColor = "bg-white/5 text-text-secondary";
              
              if (selectedOption !== null) {
                if (confirmed) {
                  if (i === currentQuestion.resposta) {
                    style = "border-primary bg-primary/10 text-primary ring-1 ring-primary/30";
                    iconColor = "bg-primary text-black";
                  } else if (i === selectedOption) {
                    style = "border-red-500 bg-red-500/10 text-red-500 ring-1 ring-red-500/30";
                    iconColor = "bg-red-500 text-white";
                  } else {
                    style = "opacity-40 grayscale";
                  }
                } else if (i === selectedOption) {
                  style = "border-primary bg-primary/20 text-primary ring-2 ring-primary/50";
                  iconColor = "bg-primary text-black font-bold";
                }
              }

              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                  transition={reduceMotion ? { duration: 0.12, ease: easings.smoothOut } : springs.snappy}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all flex items-start gap-4 group ${style}`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-premium-mono font-bold shrink-0 mt-0.5 transition-colors ${iconColor}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-base font-medium leading-relaxed mt-1.5">{opt}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            {!confirmed ? (
              <AnimatedButton 
                onClick={confirmAnswer} 
                className="flex-1 py-4 text-xs font-premium-mono font-bold uppercase tracking-widest h-14" 
                glow
                disabled={selectedOption === null}
              >
                Confirmar
              </AnimatedButton>
            ) : (
              <AnimatedButton 
                onClick={handleNext} 
                className="flex-1 py-4 text-xs font-premium-mono font-bold uppercase tracking-widest h-14" 
                glow
              >
                {currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                <ChevronRight size={18} className="ml-2" />
              </AnimatedButton>
            )}
          </div>
        </GlassCard>

        <AnimatePresence>
          {confirmed && showExplanation && (
            <motion.div 
              initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: reduceMotion ? 0 : -20 }}
              transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.soft}
              className="space-y-5"
            >
              <GlassCard className={`p-6 border-${selectedOption === currentQuestion.resposta ? 'primary' : 'red-500'}/20 bg-white/5`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${selectedOption === currentQuestion.resposta ? 'primary' : 'red-500'}/10`}>
                    {selectedOption === currentQuestion.resposta ? 
                      <CheckCircle2 size={24} className="text-primary" /> : 
                      <XCircle size={24} className="text-red-500" />
                    }
                  </div>
                  <div>
                    <h4 className={`font-bold ${selectedOption === currentQuestion.resposta ? 'text-primary' : 'text-red-500'}`}>
                      {selectedOption === currentQuestion.resposta ? 'Mandou bem!' : 'Não desanime'}
                    </h4>
                    <p className="text-xs text-text-secondary">Gabarito oficial: Letra {String.fromCharCode(65 + currentQuestion.resposta)}</p>
                  </div>
                </div>
                
                <p className="text-sm text-white/80 leading-relaxed italic border-l-2 border-white/10 pl-4 py-1">
                  {currentQuestion.explicacao}
                </p>

                <div className="flex gap-3 mt-6">
                  <AnimatedButton 
                    onClick={explainWithAI} 
                    disabled={loadingAI}
                    variant="secondary" 
                    className="flex-1 border-primary/20 bg-primary/5 text-primary text-[10px] py-1 h-10 font-bold uppercase tracking-wider"
                  >
                    {loadingAI ? <Loader2 size={16} className="animate-spin" /> : <><Brain size={14} className="mr-2" /> Explicar melhor</>}
                  </AnimatedButton>
                  
                  {selectedOption !== currentQuestion.resposta && (
                    <AnimatedButton 
                      onClick={explainErrorWithAI} 
                      disabled={loadingAI}
                      variant="secondary" 
                      className="flex-1 border-red-500/20 bg-red-500/5 text-red-500 text-[10px] py-1 h-10 font-bold uppercase tracking-wider"
                    >
                      {loadingAI ? <Loader2 size={16} className="animate-spin" /> : <><AlertCircle size={14} className="mr-2" /> Por que errei?</>}
                    </AnimatedButton>
                  )}
                </div>
              </GlassCard>

              {aiExplanation && (
                <motion.div 
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.card}
                  className="relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[2.5rem] blur-xl opacity-50" />
                  <GlassCard className="p-6 border-primary/30 bg-black/40 relative z-10 overflow-hidden" glow>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Sparkles size={120} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center p-px shadow-[0_0_15px_rgba(var(--hub-primary-rgb),0.4)]">
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                             <Brain size={20} className="text-primary" />
                          </div>
                       </div>
                       <div>
                          <h4 className="text-xs font-premium-mono font-bold text-primary uppercase tracking-[0.2em]">Insight de Estudo</h4>
                          <h3 className="text-lg font-premium-title italic tracking-tight">Análise Guiada</h3>
                       </div>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-primary">
                      <Suspense fallback={<div className="text-white/90 whitespace-pre-wrap">{aiExplanation}</div>}>
                        <MarkdownContent content={aiExplanation} />
                      </Suspense>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrainingSession;
