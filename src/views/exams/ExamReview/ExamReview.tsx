import React from 'react';
import { 
  ChevronLeft 
} from 'lucide-react';
import { clsx } from 'clsx';
import { 
  GlassCard, 
  AnimatedButton, 
  Badge 
} from '../../../components/UI';
import { Question } from '../shared';

interface ExamReviewProps {
  questions: Question[];
  answers: Record<number, number>;
  onBack: () => void;
}

export const ExamReview = ({ 
  questions, 
  answers, 
  onBack 
}: ExamReviewProps) => {
  return (
    <div className="p-6 space-y-6 pb-32">
      <header className="flex items-center gap-4 sticky top-0 z-50 bg-background/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-white/5">
        <button onClick={onBack} className="text-text-secondary"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold">Revisão do Simulado</h2>
      </header>

      <div className="space-y-8">
        {questions.map((q, i) => {
          const isCorrect = answers[i] === q.resposta;
          return (
            <GlassCard key={q.id || i} className={clsx("p-6 space-y-4 border-l-4", isCorrect ? "border-l-green-500" : "border-l-red-500")}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Questão {i + 1}</span>
                <Badge variant={isCorrect ? 'success' : 'danger'}>{isCorrect ? 'Correta' : 'Incorreta'}</Badge>
              </div>
              <p className="text-sm leading-relaxed">{q.pergunta}</p>
              <div className="space-y-2">
                {q.alternativas.map((opt: string, optIdx: number) => (
                  <div key={optIdx} className={clsx(
                    "p-3 rounded-xl text-xs border",
                    optIdx === q.resposta ? "bg-green-500/10 border-green-500/30 text-green-500" :
                    optIdx === answers[i] && !isCorrect ? "bg-red-500/10 border-red-500/30 text-red-500" :
                    "bg-white/5 border-white/10 opacity-50"
                  )}>
                    <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)})</span>
                    {opt}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Explicação</p>
                <p className="text-xs text-text-secondary leading-relaxed">{q.explicacao}</p>
              </div>
            </GlassCard>
          );
        })}
        <AnimatedButton onClick={onBack} className="w-full">Voltar aos Resultados</AnimatedButton>
      </div>
    </div>
  );
};
