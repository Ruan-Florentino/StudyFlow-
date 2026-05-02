import React from 'react';
import { 
  History, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Target 
} from 'lucide-react';
import { useStore } from '../../../store';
import { 
  GlassCard, 
  Header 
} from '../../../components/UI';
import { useQuestionMap } from '../../../hooks/useQuestions';
import { QuestionsLoadingSkeleton } from '../../../components/shared/QuestionsLoadingSkeleton';
import { QuestionsLoadError } from '../../../components/shared/QuestionsLoadError';

interface ExamHistoryProps {
  onBack: () => void;
}

export const ExamHistory = ({ onBack }: ExamHistoryProps) => {
  const { history } = useStore();
  const { questionMap: QUESTION_MAP, loading: qLoading, error: qError } = useQuestionMap();

  // Group history by date or just show last 20
  const recentHistory = history.slice(0, 20);

  if (qLoading) return <QuestionsLoadingSkeleton />;
  if (qError) return <QuestionsLoadError error={qError} />;

  return (
    <div className="p-6 space-y-6 pb-28">
      <Header 
        title="Histórico"
        subtitle="Simulados Recentes"
        icon={History}
        color="blue"
        onBack={onBack}
      />

      <div className="space-y-4">
        {recentHistory.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <History size={48} className="mx-auto mb-4" />
            <p>Nenhum histórico de simulado encontrado.</p>
          </div>
        ) : (
          recentHistory.map((h, i) => {
            const questionData = QUESTION_MAP?.get(h.questionId) as any;
            return (
              <GlassCard key={i} className="p-4 flex items-center justify-between border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    h.isCorrect ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}>
                    {h.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{questionData?.materia || 'Questão'}</h4>
                    <div className="flex items-center gap-2">
                      <Target size={12} className="text-text-secondary" />
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{questionData?.assunto || 'Tópico'}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[10px] text-text-secondary mb-1">
                    <Clock size={10} />
                    <span>{new Date(h.timestamp).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <Badge variant={h.isCorrect ? 'success' : 'danger'} className="text-[8px] px-2">
                    {h.isCorrect ? 'ACERTO' : 'ERRO'}
                  </Badge>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'orange';
  className?: string;
}

const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
