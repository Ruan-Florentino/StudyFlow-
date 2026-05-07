import type { Question } from '../data/types';
import type { ExamDetail, QuestionHistory } from '../store/types';
import { aiService } from '../services/aiService';

export const STRATEGIC_TRAINING_EXAM_ID = 'strategic_training';

export const STRATEGIC_TRAINING_EXAM: ExamDetail = {
  id: STRATEGIC_TRAINING_EXAM_ID,
  nome: 'Treino Estratégico',
  data: new Date().toISOString().slice(0, 10),
  diasRestantes: 0,
  tipo: 'vestibular',
  materias: ['Matemática', 'Linguagens', 'Ciências da Natureza', 'Ciências Humanas'],
  nivel: 'Médio',
  descricao: '15 questões escolhidas pela IA com base no seu histórico recente.',
  provaTag: 'ENEM',
};

const SESSION_SIZE = 15;
const MANIFEST_CAP = 90;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weakMaps(history: QuestionHistory[], byId: Map<string, Question>) {
  const materiaWrong = new Map<string, number>();
  const assuntoWrong = new Map<string, number>();
  for (const h of history) {
    if (h.isCorrect) continue;
    const q = byId.get(h.questionId);
    if (!q) continue;
    materiaWrong.set(q.materia, (materiaWrong.get(q.materia) || 0) + 1);
    assuntoWrong.set(q.assunto, (assuntoWrong.get(q.assunto) || 0) + 1);
  }
  return { materiaWrong, assuntoWrong };
}

function buildPerformanceSummary(history: QuestionHistory[], byId: Map<string, Question>): string {
  const recent = history.slice(0, 100);
  if (recent.length === 0) {
    return 'Sem histórico de tentativas ainda. Priorize variedade entre matérias e dificuldade Medium/Easy.';
  }
  const byMateria = new Map<string, { ok: number; bad: number }>();
  for (const h of recent) {
    const q = byId.get(h.questionId);
    if (!q) continue;
    const cur = byMateria.get(q.materia) || { ok: 0, bad: 0 };
    if (h.isCorrect) cur.ok += 1;
    else cur.bad += 1;
    byMateria.set(q.materia, cur);
  }
  const lines = [...byMateria.entries()].map(([m, { ok, bad }]) => `${m}: ${ok} acertos, ${bad} erros`);
  return lines.slice(0, 14).join('\n');
}

function pickFallbackIds(
  pool: Question[],
  history: QuestionHistory[],
  byId: Map<string, Question>,
  need: number,
  exclude: Set<string>
): string[] {
  if (need <= 0) return [];
  const { materiaWrong, assuntoWrong } = weakMaps(history, byId);
  const scored = pool
    .filter((q) => !exclude.has(q.id))
    .map((q) => ({
      id: q.id,
      s: (materiaWrong.get(q.materia) || 0) * 3 + (assuntoWrong.get(q.assunto) || 0) * 2 + Math.random() * 0.15,
    }))
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, need).map((x) => x.id);
}

/**
 * Monta um bloco de ~15 questões: tenta IA (Athena) para escolher ids no manifest;
 * se falhar ou vier incompleto, completa com heurística de fraquezas.
 */
export async function pickStrategicTrainingSession(
  allQuestions: Question[],
  history: QuestionHistory[]
): Promise<{ questions: Question[]; mentorNote?: string }> {
  const byId = new Map(allQuestions.map((q) => [q.id, q]));
  const pool = shuffle(allQuestions.filter((q) => q?.id)).slice(
    0,
    Math.min(MANIFEST_CAP, allQuestions.length)
  );

  if (pool.length === 0) {
    return { questions: [] };
  }

  const compact = pool.map((q) => ({
    i: q.id,
    m: q.materia,
    a: q.assunto,
    d: q.difficulty,
  }));

  const performanceText = buildPerformanceSummary(history, byId);
  const manifestIds = new Set(pool.map((q) => q.id));

  let mentorNote: string | undefined;
  let chosenIds: string[] = [];

  try {
    const plan = await aiService.planStrategicTraining(performanceText, compact);
    mentorNote = plan.mentorNote;
    chosenIds = (plan.selectedIds || [])
      .filter((id) => typeof id === 'string' && manifestIds.has(id))
      .slice(0, SESSION_SIZE);
    chosenIds = [...new Set(chosenIds)];
  } catch {
    chosenIds = [];
  }

  const exclude = new Set(chosenIds);
  if (chosenIds.length < SESSION_SIZE) {
    const more = pickFallbackIds(pool, history, byId, SESSION_SIZE - chosenIds.length, exclude);
    for (const id of more) {
      chosenIds.push(id);
      exclude.add(id);
      if (chosenIds.length >= SESSION_SIZE) break;
    }
  }

  let out: Question[] = chosenIds.map((id) => byId.get(id)).filter((q): q is Question => Boolean(q));

  if (out.length < SESSION_SIZE) {
    const used = new Set(out.map((q) => q.id));
    const pad = pool.filter((q) => !used.has(q.id));
    out = [...out, ...pad.slice(0, SESSION_SIZE - out.length)];
  }

  return {
    questions: shuffle(out).slice(0, Math.min(SESSION_SIZE, out.length)),
    mentorNote,
  };
}
