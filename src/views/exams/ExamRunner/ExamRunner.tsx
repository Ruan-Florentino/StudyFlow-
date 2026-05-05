import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { 
  GlassCard, 
  AnimatedButton 
} from '../../../components/UI';
import { Exam, Question } from '../shared';

interface ExamRunnerProps {
  exam: Exam;
  questions: Question[];
  answers: Record<number, number>;
  onAnswer: (qIndex: number, optIndex: number) => void;
  onFinish: () => void;
  onBack: () => void;
}

export const ExamRunner = ({ 
  exam, 
  questions, 
  answers, 
  onAnswer, 
  onFinish, 
  onBack 
}: ExamRunnerProps) => {
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-32 md:pb-36">
      <header className="flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-white/5">
        <button onClick={onBack} className="text-text-secondary"><ChevronLeft size={24} /></button>
        <div className="text-center">
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Simulado IA</p>
          <p className="text-xs font-bold">{exam.nome}</p>
        </div>
        <div className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">
          {answeredCount}/{questions.length}
        </div>
      </header>

      <div className="space-y-8">
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden sticky top-[72px] z-40">
          <motion.div 
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>

        {questions.map((q, qIndex) => (
          <GlassCard key={q.id || qIndex} className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Questão {qIndex + 1}</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-text-secondary">{q.materia}</span>
            </div>
            
            <p className="text-sm font-medium leading-relaxed">{q.pergunta}</p>

            <div className="space-y-3">
              {q.alternativas.map((opt: string, i: number) => {
                const isSelected = answers[qIndex] === i;
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAnswer(qIndex, i)}
                    className={`w-full p-4 rounded-2xl text-left transition-all flex gap-4 items-center group border ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(0,255,148,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:border-primary/50 text-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isSelected ? 'bg-primary text-black' : 'bg-white/5 group-hover:bg-primary/20 group-hover:text-primary'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm font-medium">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        ))}

        <AnimatedButton 
          onClick={onFinish} 
          className="w-full py-4 text-sm font-bold uppercase tracking-widest mt-8"
          glow
        >
          Finalizar Simulado
        </AnimatedButton>
      </div>
    </div>
  );
};
