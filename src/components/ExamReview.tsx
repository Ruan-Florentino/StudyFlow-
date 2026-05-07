import React, { Suspense, lazy, useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { easings, springs } from '../lib/animations/easings';
import { 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Clock, 
  Trophy,
  Brain,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Question } from '../store';
import { GlassCard, AnimatedButton, Header } from './UI';
import { QuestionStatusBadge } from './QuestionStatusBadge';
import { aiService } from '../services/aiService';

const MarkdownContent = lazy(() =>
  import('./shared/MarkdownContent').then((module) => ({
    default: module.MarkdownContent,
  }))
);

interface ExamReviewProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  timeSpent: number;
  onBack: () => void;
}

const ExamReview = ({ questions, userAnswers, timeSpent, onBack }: ExamReviewProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [aiExplanation, setAiExplanation] = useState<Record<number, string>>({});
  const [loadingAI, setLoadingAI] = useState<Record<number, boolean>>({});
  const reduceMotion = useReducedMotion() ?? false;

  const correctCount = useMemo(() => {
    return questions.filter((q, i) => userAnswers[i] === q.resposta).length;
  }, [questions, userAnswers]);

  const scorePct =
    questions.length === 0 ? 0 : Math.round((correctCount / questions.length) * 100);
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAIExplain = async (index: number) => {
    if (loadingAI[index]) return;
    
    setLoadingAI(prev => ({ ...prev, [index]: true }));
    try {
      const q = questions[index];
      const explanation = await aiService.explainQuestion(q.pergunta, q.alternativas, q.alternativas[q.resposta]);
      setAiExplanation(prev => ({ ...prev, [index]: explanation }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28">
      <Header 
        title="Revisão Pós-Simulado"
        subtitle="Análise detalhada do seu desempenho"
        icon={Eye}
        color="violet"
        onBack={onBack}
        rightContent={
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
                <p className="text-xs font-premium-mono font-bold text-text-secondary uppercase">Tempo Total</p>
                <p className="text-xs font-bold text-white tracking-widest">{formatTime(timeSpent)}</p>
             </div>
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
                <Trophy size={16} className="text-violet-400" />
                <span className="font-premium-mono font-bold text-sm text-white">{correctCount}/{questions.length}</span>
             </div>
          </div>
        }
      />

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col items-center justify-center space-y-1">
          <p className="text-[9px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest text-center">Aproveitamento</p>
          <p className={`text-2xl font-bold ${scorePct >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
            {scorePct}%
          </p>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col items-center justify-center space-y-1">
          <p className="text-[9px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest text-center">Status</p>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            scorePct >= 70 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {scorePct >= 70 ? 'Aprovado' : 'Reprovado'}
          </span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col items-center justify-center space-y-1">
          <p className="text-[9px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest text-center">Acertos</p>
          <div className="flex items-center gap-1.5 text-green-500 font-bold">
            <CheckCircle2 size={14} /> {correctCount}
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col items-center justify-center space-y-1 text-center">
          <p className="text-[9px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">Tempo Médio</p>
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase text-xs">
            <Clock size={14} /> {formatTime(Math.round(timeSpent / questions.length))}/questão
          </div>
        </GlassCard>
      </div>

      {/* Questions List */}
       <div className="space-y-3">
        {questions.map((q, idx) => {
          const isExpanded = expandedIndex === idx;
          const userAnswer = userAnswers[idx];
          const isCorrect = userAnswer === q.resposta;
          const inBlank = userAnswer === undefined;
          
          return (
            <GlassCard 
              key={idx} 
              className={`overflow-hidden border transition-colors ${
                isExpanded ? 'border-white/20' : 'border-white/5'
              }`}
            >
              <button 
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-4 flex items-center justify-between gap-4 text-left group"
              >
                 <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-text-secondary shrink-0 group-hover:border-white/20">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                       <p className="text-sm font-medium text-white/90 truncate max-w-[200px] sm:max-w-md lg:max-w-2xl">{q.pergunta}</p>
                       <QuestionStatusBadge questionId={q.id} compact />
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                       {inBlank ? (
                         <MinusCircle size={16} className="text-text-secondary" />
                       ) : isCorrect ? (
                         <CheckCircle2 size={16} className="text-green-500" />
                       ) : (
                         <XCircle size={16} className="text-rose-500" />
                       )}
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
                 </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0.15, ease: easings.smoothOut }
                        : { duration: 0.32, ease: easings.smoothOut }
                    }
                    className="border-t border-white/5 bg-white/[0.02]"
                  >
                     <div className="p-6 space-y-6">
                        <div className="space-y-4">
                           <h4 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest mb-4">Alternativas</h4>
                           <div className="space-y-2">
                              {q.alternativas.map((alt, i) => {
                                const isSelected = userAnswer === i;
                                const isActualCorrect = q.resposta === i;
                                return (
                                  <div 
                                    key={i}
                                    className={`p-3 rounded-xl border text-sm flex items-start gap-3 ${
                                      isActualCorrect 
                                        ? 'border-green-500/50 bg-green-500/10 text-green-400' 
                                        : isSelected
                                        ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                                        : 'border-white/5 bg-white/5 text-text-secondary'
                                    }`}
                                  >
                                     <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                        isActualCorrect ? 'bg-green-500 text-black' : 
                                        isSelected ? 'bg-rose-500 text-white' : 'bg-white/10'
                                     }`}>
                                        {String.fromCharCode(65 + i)}
                                     </span>
                                     <span className="leading-relaxed mt-1">{alt}</span>
                                  </div>
                                );
                              })}
                           </div>
                        </div>

                        {/* Analysis Section */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                           <div className="flex flex-wrap gap-3">
                              <AnimatedButton
                                onClick={() => handleAIExplain(idx)}
                                variant="secondary"
                                className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest border-white/10"
                                disabled={loadingAI[idx]}
                              >
                                {loadingAI[idx] ? (
                                  <Loader2 className="animate-spin mr-2" size={14} />
                                ) : (
                                  <Brain className="mr-2 text-indigo-400" size={14} />
                                )}
                                Análise com IA
                              </AnimatedButton>
                              <AnimatedButton
                                onClick={() => handleAIExplain(idx)} // Reuse for simplicity as requested sober
                                variant="secondary"
                                className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest border-white/10"
                                disabled={loadingAI[idx]}
                              >
                                <Sparkles className="mr-2 text-orange-400" size={14} />
                                Por que errei?
                              </AnimatedButton>
                           </div>

                           <AnimatePresence>
                              {aiExplanation[idx] && (
                                <motion.div 
                                  initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.soft}
                                  className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-sm text-text-secondary leading-relaxed markdown-body"
                                >
                                  <Suspense fallback={<div className="text-white/90 whitespace-pre-wrap">{aiExplanation[idx]}</div>}>
                                    <MarkdownContent content={aiExplanation[idx]} />
                                  </Suspense>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          );
        })}
      </div>

      <div className="pt-8 flex justify-center">
         <AnimatedButton 
           onClick={onBack}
           variant="primary"
           className="px-10 py-4 text-xs font-bold uppercase tracking-widest"
           glow
         >
            <ArrowLeft className="mr-2" size={18} /> Voltar ao Banco
         </AnimatedButton>
      </div>

    </div>
  );
};

export default ExamReview;
