import React, { type FC } from 'react';
import { useQuestionHistory } from '../hooks/useQuestionHistory';
import {
  formatRelativeDaysPt,
  type QuestionLearningStatus,
} from '../lib/questionHistory';
import { cn } from './UI';

export type QuestionStatusBadgeProps = {
  questionId: string;
  className?: string;
  /** Sem sufixo de data (headers compactos) */
  compact?: boolean;
};

const STATUS_STYLES: Record<
  Exclude<QuestionLearningStatus, 'new'>,
  { label: string; className: string }
> = {
  seen: {
    label: 'Vista',
    className:
      'border-white/15 bg-white/10 text-text-secondary ring-white/10',
  },
  correct: {
    label: 'Acertou',
    className:
      'border-primary/40 bg-primary/15 text-primary ring-primary/20',
  },
  wrong: {
    label: 'Errou antes',
    className:
      'border-red-500/40 bg-red-500/10 text-red-400 ring-red-500/15',
  },
  recovered: {
    label: 'Recuperada',
    className:
      'border-amber-400/50 bg-amber-500/10 text-amber-300 ring-amber-400/20',
  },
  review: {
    label: 'Revisar',
    className:
      'border-orange-500/45 bg-orange-500/10 text-orange-300 ring-orange-500/15',
  },
};

export const QuestionStatusBadge: FC<QuestionStatusBadgeProps> = ({
  questionId,
  className,
  compact,
}) => {
  const meta = useQuestionHistory(questionId);

  if (meta.status === 'new') return null;

  const cfg = STATUS_STYLES[meta.status];

  let suffix = '';
  if (!compact) {
    if (meta.status === 'review' && meta.wrongAttempts > 0) {
      suffix = ` (${meta.wrongAttempts} erros)`;
    } else if (meta.lastAttempt && meta.status !== 'seen') {
      suffix = ` · ${formatRelativeDaysPt(meta.lastAttempt)}`;
    }
  }

  const aria =
    meta.status === 'review'
      ? `Status da questão: revisar, ${meta.wrongAttempts} erros registrados`
      : `Status da questão: ${cfg.label}${suffix ? `, última tentativa ${suffix.replace(/^ · /, '')}` : ''}`;

  return (
    <span
      role="status"
      aria-label={aria}
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-premium-mono font-bold uppercase tracking-widest ring-1',
        cfg.className,
        className
      )}
    >
      {cfg.label}
      {suffix}
    </span>
  );
};
