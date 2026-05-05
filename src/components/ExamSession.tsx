import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertTriangle, 
  X,
  LayoutGrid,
  Info,
  Clock
} from 'lucide-react';
import { Question } from '../store';
import { GlassCard, AnimatedButton, Header } from './UI';
import ExamTimer from './ExamTimer';

interface ExamSessionProps {
  questions: Question[];
  durationMinutes?: number;
  onComplete: (correct: number, userAnswers: Record<number, number>, timeTaken: number) => void;
  onCancel: () => void;
}

const ExamSession = ({ questions, durationMinutes, onComplete, onCancel }: ExamSessionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  // Calculate duration
  const totalDuration = durationMinutes 
    ? durationMinutes * 60 
    : Math.max(questions.length * 120, 300); // Default 2min/question or min 5 mins
    
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [startTime] = useState(Date.now());

  // Timer interval
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = useCallback(() => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.resposta) correct++;
    });
    onComplete(correct, userAnswers, timeTaken);
  }, [questions, userAnswers, startTime, onComplete]);

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setTimeout(() => {
      handleSubmit();
    }, 3000);
  };

  const handleSelectOption = (optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28 relative">
      <Header 
        title="Simulado Real"
        subtitle={`${questions.length} Questões`}
        icon={LayoutGrid}
        color="orange"
        onBack={() => setIsDiscardModalOpen(true)}
        rightContent={
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
                <p className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase">Progresso</p>
                <p className="text-xs font-bold text-white">{answeredCount} de {questions.length}</p>
             </div>
             <ExamTimer seconds={timeLeft} onTimeUp={handleTimeUp} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <GlassCard className="p-6 space-y-8 min-h-[500px] flex flex-col" glow>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-white/5 text-text-secondary text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-white/5">
                  QUESTÃO {currentIndex + 1}
                </span>
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
              </div>
              <div className="text-[10px] font-premium-mono text-text-secondary flex items-center gap-2">
                <Clock size={12} /> Sugestão: 2:00m
              </div>
            </div>

            <p className="text-lg font-medium leading-relaxed text-white/90">{currentQuestion.pergunta}</p>
            
            <div className="space-y-3 flex-1">
              {currentQuestion.alternativas.map((opt, i) => {
                const isSelected = userAnswers[currentIndex] === i;
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOption(i)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all flex items-start gap-4 group ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-500/10 text-orange-400' 
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-premium-mono font-bold shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-white/10 text-text-secondary'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-base font-medium leading-relaxed mt-1.5">{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
              <AnimatedButton 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                variant="secondary"
                className="py-4 text-xs font-bold uppercase tracking-widest"
              >
                <ChevronLeft size={18} className="mr-2" /> Anterior
              </AnimatedButton>
              {currentIndex < questions.length - 1 ? (
                <AnimatedButton 
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="py-4 text-xs font-bold uppercase tracking-widest"
                  glow
                >
                  Próxima <ChevronRight size={18} className="ml-2" />
                </AnimatedButton>
              ) : (
                <AnimatedButton 
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="py-4 text-xs font-bold uppercase tracking-widest border-orange-500/50 bg-orange-500/10 text-orange-400"
                  glow
                >
                  Finalizar Prova <Send size={18} className="ml-2" />
                </AnimatedButton>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Lateral Grid */}
        <div className="lg:col-span-1 space-y-4">
           <GlassCard className="p-4 space-y-4 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">Gabarito</h4>
                <div className="px-2 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-text-secondary">
                  {answeredCount}/{questions.length}
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center border transition-all ${
                      i === currentIndex 
                        ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                        : userAnswers[i] !== undefined
                        ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                        : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                 <div className="flex items-center gap-2 text-[10px] text-text-secondary uppercase">
                    <Info size={12} className="text-orange-400" />
                    <span>Instruções</span>
                 </div>
                 <p className="text-[10px] text-text-secondary/70 leading-relaxed italic">
                    Não haverá feedback imediato. Revise suas respostas antes de finalizar. O cronômetro não para.
                 </p>
              </div>

              <AnimatedButton 
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full py-3 text-[10px] font-premium-mono font-bold uppercase tracking-widest bg-orange-500/20 border-orange-500/30 text-orange-400"
              >
                Entregar Prova
              </AnimatedButton>
           </GlassCard>
        </div>
      </div>

      {/* Discard Modal */}
      <AnimatePresence>
        {isDiscardModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="w-full max-w-sm"
             >
                <GlassCard className="p-8 text-center space-y-6 border-rose-500/30">
                   <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500">
                      <AlertTriangle size={32} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider">Descartar Simulado?</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Todo o seu progresso nesta prova será perdido. Esta ação não pode ser desfeita.
                      </p>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setIsDiscardModalOpen(false)}
                        className="py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-text-secondary"
                      >
                        Continuar
                      </button>
                      <button 
                        onClick={onCancel}
                        className="py-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs font-bold uppercase tracking-widest text-rose-500"
                      >
                        Sair
                      </button>
                   </div>
                </GlassCard>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submit Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="w-full max-w-sm"
             >
                <GlassCard className="p-8 text-center space-y-6 border-orange-500/30">
                   <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-500">
                      <Send size={32} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider">Finalizar Prova?</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Você respondeu <span className="text-orange-400 font-bold">{answeredCount} de {questions.length}</span> questões. Confirma o envio final?
                      </p>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setIsSubmitModalOpen(false)}
                        className="py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-text-secondary"
                      >
                        Revisar
                      </button>
                      <button 
                        onClick={handleSubmit}
                        className="py-3 rounded-xl bg-orange-500 text-black text-xs font-bold uppercase tracking-widest"
                      >
                        Enviar
                      </button>
                   </div>
                </GlassCard>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Time Up Banner */}
      <AnimatePresence>
        {isTimeUp && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-6"
          >
             <div className="bg-rose-500 text-white p-4 rounded-2xl flex items-center justify-center gap-4 shadow-2xl shadow-rose-500/40">
                <Clock className="animate-spin" size={24} />
                <div className="text-center">
                   <p className="text-xs font-bold uppercase tracking-widest">Tempo Esgotado!</p>
                   <p className="text-[10px] opacity-80">Enviando respostas automaticamente...</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamSession;
