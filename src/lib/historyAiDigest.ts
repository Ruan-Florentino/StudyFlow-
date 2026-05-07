import type { Essay } from '../store/types';

export type QuestionHistoryEntry = {
  questionId: string;
  isCorrect: boolean;
  /** ISO string ou epoch ms (compatível com `QuestionHistory` do store). */
  timestamp: string | number;
};

export type QuestionMapLite = {
  materia?: string;
  assunto?: string;
};

export function buildQuestionHistoryDigestForPrompt(
  history: QuestionHistoryEntry[],
  questionMap: Map<string, QuestionMapLite> | undefined,
  maxLines = 30
): string {
  if (!history.length) {
    return 'O aluno ainda não tem tentativas de questões registradas.';
  }

  let correct = 0;
  let wrong = 0;
  const bySubject = new Map<string, { c: number; w: number }>();

  for (const h of history.slice(0, 300)) {
    if (h.isCorrect) correct++;
    else wrong++;
    const q = questionMap?.get(h.questionId);
    const subject = q?.materia ?? '—';
    const cur = bySubject.get(subject) ?? { c: 0, w: 0 };
    if (h.isCorrect) cur.c++;
    else cur.w++;
    bySubject.set(subject, cur);
  }

  const lines: string[] = [
    `Resumo global (amostra): ${correct} acertos, ${wrong} erros em até ${Math.min(history.length, 300)} tentativas analisadas; total registrado: ${history.length}.`,
  ];

  const subjectStats = [...bySubject.entries()]
    .map(([sub, { c, w }]) => `${sub}: ${c} acertos / ${w} erros`)
    .sort()
    .slice(0, 14);

  if (subjectStats.length) {
    lines.push('Por matéria (parcial):');
    subjectStats.forEach((s) => lines.push(`- ${s}`));
  }

  lines.push('Últimas tentativas (mais recente primeiro):');
  for (const h of history.slice(0, maxLines)) {
    const q = questionMap?.get(h.questionId);
    const flag = h.isCorrect ? 'ACERTO' : 'ERRO';
    const date = new Date(h.timestamp).toLocaleDateString('pt-BR');
    lines.push(
      `- ${date} | ${flag} | ${q?.materia ?? '—'} / ${q?.assunto ?? '—'} | id=${h.questionId}`
    );
  }

  return lines.join('\n');
}

export function buildEssayHistoryDigestForPrompt(essays: Essay[], maxItems = 14): string {
  if (!essays.length) return 'O aluno ainda não possui redações salvas no histórico.';

  const lines: string[] = [`Total de redações no histórico: ${essays.length}`];

  for (const e of essays.slice(0, maxItems)) {
    const date = new Date(e.date).toLocaleDateString('pt-BR');
    const score = e.score != null ? `nota ${e.score}` : 'sem nota consolidada';
    lines.push(`- ${date} | ${score} | tema: ${e.topicTitle}`);
    if (e.feedback?.suggestions?.length) {
      const hint = e.feedback.suggestions.slice(0, 2).join('; ');
      lines.push(`  sugestões anteriores: ${hint}`);
    }
  }

  return lines.join('\n');
}

export function buildArchiveDigestForPrompt(params: {
  studySessions: Array<{ date: string; duration: number; subject: string }>;
  history: QuestionHistoryEntry[];
}): string {
  const { studySessions, history } = params;
  const lines: string[] = [];

  lines.push('## Sessões de estudo (log)');
  if (!studySessions.length) {
    lines.push('- Nenhuma sessão de estudo registrada.');
  } else {
    studySessions.slice(0, 25).forEach((s) => {
      lines.push(`- ${s.date} | ${s.duration} min | ${s.subject}`);
    });
  }

  lines.push('');
  lines.push('## Tentativas de questões (log)');
  if (!history.length) {
    lines.push('- Nenhuma tentativa registrada.');
  } else {
    lines.push(`Total: ${history.length} tentativas. Últimas 20:`);
    history.slice(0, 20).forEach((h, i) => {
      const flag = h.isCorrect ? 'ok' : 'erro';
      const date = new Date(h.timestamp).toLocaleDateString('pt-BR');
      lines.push(`- ${date} | ${flag} | questão #${i + 1} (${h.questionId.slice(0, 8)}…)`);
    });
  }

  return lines.join('\n');
}
