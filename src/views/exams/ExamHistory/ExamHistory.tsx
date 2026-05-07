import React, { useMemo } from 'react';
import {
  History,
  Clock,
  CheckCircle2,
  XCircle,
  Target,
} from 'lucide-react';
import { useStore } from '../../../store';
import { GlassCard, Header } from '../../../components/UI';
import { useQuestionMap } from '../../../hooks/useQuestions';
import { QuestionsLoadingSkeleton } from '../../../components/shared/QuestionsLoadingSkeleton';
import { QuestionsLoadError } from '../../../components/shared/QuestionsLoadError';
import { AthenaChat } from '../../../features/athena/components/AthenaChat';
import { QUESTOES_SYSTEM_PROMPT } from '../../../features/athena/prompts/systemPrompts';
import { buildQuestionHistoryDigestForPrompt } from '../../../lib/historyAiDigest';

interface ExamHistoryProps {
  onBack: () => void;
}

export const ExamHistory = ({ onBack }: ExamHistoryProps) => {
  const { history } = useStore();
  const { questionMap: QUESTION_MAP, loading: qLoading, error: qError } = useQuestionMap();

  const recentHistory = history.slice(0, 20);

  const historySystemPrompt = useMemo(() => {
    const digest = buildQuestionHistoryDigestForPrompt(history, QUESTION_MAP ?? undefined, 28);
    return `${QUESTOES_SYSTEM_PROMPT}

## Histórico de tentativas do aluno (dados reais do app)
Use estes dados para orientar revisão e priorização. Não invente questões ou datas que não apareçam abaixo.

${digest}`;
  }, [history, QUESTION_MAP]);

  if (qLoading) return <QuestionsLoadingSkeleton />;
  if (qError) return <QuestionsLoadError error={qError} />;

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28">
      <Header
        title="Histórico"
        subtitle="Últimas tentativas de questões + mentoria"
        icon={History}
        color="blue"
        onBack={onBack}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="space-y-4 min-w-0">
          {recentHistory.length === 0 ? (
            <div className="text-center py-16 opacity-50">
              <History size={48} className="mx-auto mb-4" />
              <p>Nenhuma tentativa registrada ainda.</p>
            </div>
          ) : (
            recentHistory.map((h, i) => {
              const questionData = QUESTION_MAP?.get(h.questionId);
              return (
                <GlassCard
                  key={`${h.questionId}-${h.timestamp}-${i}`}
                  className="p-4 flex items-center justify-between border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                        h.isCorrect
                          ? 'bg-primary/10 border-primary/20 text-primary'
                          : 'bg-red-500/10 border-red-500/20 text-red-500'
                      }`}
                    >
                      {h.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold truncate">{questionData?.materia || 'Questão'}</h4>
                      <div className="flex items-center gap-2 min-w-0">
                        <Target size={12} className="text-text-secondary shrink-0" />
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest truncate">
                          {questionData?.assunto || 'Tópico'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="flex items-center gap-1 text-[10px] text-text-secondary mb-1 justify-end">
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

        <div className="min-h-[min(70vh,560px)] xl:sticky xl:top-24">
          <AthenaChat
            compact
            sidebarInCompact
            context="questoes"
            systemPrompt={historySystemPrompt}
            greeting="Mentoria com seu histórico de questões"
            placeholder="Ex.: O que revisar primeiro pelos meus erros?"
            showSidebar={false}
          />
        </div>
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
