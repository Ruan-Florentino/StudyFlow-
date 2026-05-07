import type { RecommendedTrail } from '../data/explore';
import type { QuestionHistory } from '../store/types';

const ALLOWED_START_PATHS = new Set([
  '/questoes',
  '/redacao',
  '/simulados',
  '/notas',
  '/metodos',
]);

const NAV_FILTER_KEYS = ['subject', 'topic', 'difficulty', 'search'] as const;

export function buildExploreTrailContext(history: QuestionHistory[]): string {
  const recent = history.slice(0, 80);
  if (recent.length === 0) {
    return 'Sem histórico recente de questões no app; proponha trilha equilibrada (ENEM/concursos) nível intermediário.';
  }
  const ok = recent.filter((h) => h.isCorrect).length;
  const bad = recent.filter((h) => !h.isCorrect).length;
  return `Resumo das últimas ${recent.length} tentativas no banco: ${ok} acertos, ${bad} erros. Priorize reforço sem abandonar revisão espaçada.`;
}

export function parseExploreTrailFromAiContent(raw: string): RecommendedTrail {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start < 0 || end <= start) {
      throw new Error('A IA não retornou JSON válido. Tente de novo com outro foco.');
    }
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Formato de trilha inválido.');
  }

  const o = parsed as Record<string, unknown>;
  const title = typeof o.title === 'string' ? o.title.trim().slice(0, 120) : '';
  if (!title) {
    throw new Error('A trilha precisa de um título.');
  }

  const description =
    typeof o.description === 'string' ? o.description.trim().slice(0, 800) : '';

  let topics: string[] = [];
  if (Array.isArray(o.topics)) {
    topics = o.topics
      .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      .map((t) => t.trim().slice(0, 140))
      .slice(0, 14);
  }

  const durationLabel =
    typeof o.durationLabel === 'string' ? o.durationLabel.trim().slice(0, 48) : 'Flexível';
  const level = typeof o.level === 'string' ? o.level.trim().slice(0, 48) : 'Intermediário';

  let icon = typeof o.icon === 'string' ? o.icon.trim() : '✨';
  if (icon.length > 6) {
    icon = '✨';
  }

  const sp = typeof o.startPath === 'string' ? o.startPath.trim() : '';
  const startPath = ALLOWED_START_PATHS.has(sp) ? sp : '/questoes';

  const navFilters: Record<string, string> = {};
  const nf = o.navFilters;
  if (nf && typeof nf === 'object' && !Array.isArray(nf)) {
    const rec = nf as Record<string, unknown>;
    for (const key of NAV_FILTER_KEYS) {
      const v = rec[key];
      if (typeof v === 'string' && v.trim()) {
        navFilters[key] = v.trim().slice(0, 220);
      }
    }
  }

  return {
    id: `ai_trail_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    title,
    description,
    topics: topics.length > 0 ? topics : ['Passos definidos pela IA ao iniciar a trilha'],
    durationLabel,
    level,
    icon,
    startPath,
    navFilters,
  };
}
