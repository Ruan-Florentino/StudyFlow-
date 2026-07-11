import type { Question, QuestionDifficulty, QuestionExamType, QuestionFilterState } from '../types/question';
import type { Essay, QuestionHistory, StudySession } from '../store/types';

export type ExploreCategory = 'questoes' | 'materias' | 'provas' | 'redacao' | 'treinos' | 'trilhas';
export type ExploreStatus = 'forte' | 'medio' | 'fraco' | 'nao_iniciado';

export interface ExploreAction {
  id: string;
  title: string;
  description: string;
  category: ExploreCategory;
  path?: string;
  filters?: QuestionFilterState;
  keywords?: string[];
}

export interface WeakTopic {
  subject: string;
  topic: string;
  accuracy: number;
  attempts: number;
}

export interface ContinueStudyItem extends ExploreAction {
  meta: string;
  progress: number;
}

export interface RecommendedAction extends ExploreAction {
  eyebrow: string;
  reason: string;
}

export interface SmartTrail extends ExploreAction {
  steps: number;
  duration: string;
  progress: number;
}

export interface ExploreFilters {
  objective: 'all' | QuestionExamType | 'redacao' | 'revisao';
  subject: string;
  difficulty: '' | QuestionDifficulty;
  duration: 'all' | 'curta' | 'media' | 'longa';
  status: 'all' | 'novo' | 'andamento' | 'concluido';
  trainingType: 'all' | 'questoes' | 'revisao' | 'simulado' | 'redacao';
}

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
  objective: 'all',
  subject: '',
  difficulty: '',
  duration: 'all',
  status: 'all',
  trainingType: 'all',
};

export const GOAL_ACTIONS: ExploreAction[] = [
  { id: 'goal-enem', title: 'ENEM', description: 'Questões reais, redação e simulados por área.', category: 'provas', filters: { examType: 'enem' }, keywords: ['enem', 'vestibular'] },
  { id: 'goal-vestibular', title: 'Vestibulares', description: 'Fuvest, Unicamp, Unesp, ITA, IME e mais.', category: 'provas', filters: { examType: 'vestibular' }, keywords: ['fuvest', 'unicamp', 'unesp', 'ita', 'ime'] },
  { id: 'goal-concurso', title: 'Concursos', description: 'INSS, Banco do Brasil, PF, PRF e outras bancas.', category: 'provas', filters: { examType: 'concurso' }, keywords: ['inss', 'banco do brasil', 'pf', 'prf', 'concurso'] },
  { id: 'goal-militar', title: 'Militares', description: 'ESA, EsPCEx, AFA, EFOMM, ITA e IME.', category: 'provas', filters: { examType: 'militar' }, keywords: ['esa', 'espcex', 'afa', 'efomm', 'ita', 'ime'] },
  { id: 'goal-essay', title: 'Redação', description: 'Temas, repertório, escrita e correção assistida.', category: 'redacao', path: '/redacao', keywords: ['redacao', 'repertorio', 'enem'] },
  { id: 'goal-review', title: 'Revisão de erros', description: 'Retome questões erradas e feche lacunas.', category: 'treinos', filters: { onlyWrong: true }, keywords: ['revisar', 'erros', 'pontos fracos'] },
];

export const SUBJECT_NAMES = ['Matematica', 'Portugues', 'Redacao', 'Fisica', 'Quimica', 'Biologia', 'Historia', 'Geografia', 'Filosofia', 'Sociologia', 'Ingles', 'Espanhol'];

export const TRAINING_ACTIONS: ExploreAction[] = [
  { id: 'training-quick', title: 'Treino rápido', description: '10 questões para aquecer.', category: 'treinos', filters: {}, keywords: ['rapido', '10 questoes', 'aquecer'] },
  { id: 'training-errors', title: 'Revisar erros', description: 'Corrija seus pontos fracos.', category: 'treinos', filters: { onlyWrong: true }, keywords: ['erros', 'revisao'] },
  { id: 'training-hard', title: 'Só difíceis', description: 'Questões de alto nível.', category: 'treinos', filters: { difficulty: 'dificil' }, keywords: ['dificeis', 'alto nivel'] },
  { id: 'training-simulation', title: 'Simulado', description: 'Treine com tempo real.', category: 'treinos', path: '/simulados', keywords: ['prova', 'tempo'] },
  { id: 'training-favorites', title: 'Favoritas', description: 'Revise questões salvas.', category: 'treinos', filters: { onlyFavorites: true }, keywords: ['salvas', 'favoritas'] },
  { id: 'training-marathon', title: 'Maratona', description: 'Resolva o máximo que conseguir.', category: 'treinos', filters: { onlyUnanswered: true }, keywords: ['continuo', 'maratona'] },
];

const TRAIL_BLUEPRINTS: Omit<SmartTrail, 'progress'>[] = [
  { id: 'trail-enem', title: 'Fundamentos do ENEM', description: 'A base das quatro áreas antes dos simulados.', category: 'trilhas', filters: { examType: 'enem' }, steps: 12, duration: '6h' },
  { id: 'trail-math', title: 'Matemática do zero', description: 'Aritmética, álgebra e funções em sequência.', category: 'trilhas', filters: { subject: 'Matematica' }, steps: 10, duration: '5h' },
  { id: 'trail-essay', title: 'Redação nota 900+', description: 'Estrutura, repertório e competências do ENEM.', category: 'trilhas', path: '/redacao', steps: 8, duration: '3h' },
  { id: 'trail-nature', title: 'Natureza intensivo', description: 'Física, Química e Biologia com prática ativa.', category: 'trilhas', filters: { subject: 'Biologia', difficulty: 'medio' }, steps: 14, duration: '8h' },
  { id: 'trail-humanities', title: 'Humanas para ENEM', description: 'História, Geografia, Filosofia e Sociologia.', category: 'trilhas', filters: { subject: 'Historia', examType: 'enem' }, steps: 11, duration: '6h' },
  { id: 'trail-vestibular', title: 'Reta final vestibulares', description: 'Revisão de alto impacto para provas tradicionais.', category: 'trilhas', filters: { examType: 'vestibular', difficulty: 'dificil' }, steps: 9, duration: '5h' },
  { id: 'trail-concurso', title: 'Concursos nível médio', description: 'Português, matemática e conhecimentos gerais.', category: 'trilhas', filters: { examType: 'concurso' }, steps: 12, duration: '7h' },
  { id: 'trail-military', title: 'Militares alta performance', description: 'Exatas avançadas para provas de alta exigência.', category: 'trilhas', filters: { examType: 'militar', difficulty: 'dificil' }, steps: 16, duration: '10h' },
];

export const ESSAY_ACTIONS: ExploreAction[] = [
  { id: 'essay-topics', title: 'Temas reais ENEM', description: 'Pratique com propostas no formato da prova.', category: 'redacao', path: '/redacao' },
  { id: 'essay-review', title: 'Corrigir redação', description: 'Receba análise por competência.', category: 'redacao', path: '/redacao' },
  { id: 'essay-repertoire', title: 'Repertórios prontos', description: 'Referências para argumentos mais fortes.', category: 'redacao', path: '/redacao' },
  { id: 'essay-intro', title: 'Estruturas de introdução', description: 'Modelos para começar com clareza.', category: 'redacao', path: '/redacao' },
  { id: 'essay-c5', title: 'Competência 5', description: 'Construa uma intervenção completa.', category: 'redacao', path: '/redacao' },
  { id: 'essay-history', title: 'Histórico de redações', description: 'Acompanhe notas e evolução.', category: 'redacao', path: '/redacao' },
];

export const SIMULATION_ACTIONS: Array<ExploreAction & { duration: string; questions: string; difficulty: string }> = [
  { id: 'sim-enem', title: 'Simulado ENEM', description: 'Prova completa por áreas.', category: 'provas', path: '/simulados', duration: '5h30', questions: '180 questões', difficulty: 'Mista' },
  { id: 'sim-math', title: 'Simulado Matemática', description: 'Exatas em ritmo de prova.', category: 'provas', path: '/simulados', duration: '90 min', questions: '45 questões', difficulty: 'Média' },
  { id: 'sim-language', title: 'Simulado Linguagens', description: 'Leitura, interpretação e gramática.', category: 'provas', path: '/simulados', duration: '90 min', questions: '45 questões', difficulty: 'Média' },
  { id: 'sim-nature', title: 'Simulado Natureza', description: 'Física, Química e Biologia.', category: 'provas', path: '/simulados', duration: '90 min', questions: '45 questões', difficulty: 'Difícil' },
  { id: 'sim-humanities', title: 'Simulado Humanas', description: 'História, Geografia e sociedade.', category: 'provas', path: '/simulados', duration: '90 min', questions: '45 questões', difficulty: 'Média' },
  { id: 'sim-military', title: 'Simulado ITA / IME', description: 'Exatas de alta performance.', category: 'provas', path: '/simulados', duration: '4h', questions: '60 questões', difficulty: 'Muito difícil' },
  { id: 'sim-contest', title: 'Simulado Concursos', description: 'Treino objetivo por banca.', category: 'provas', path: '/simulados', duration: '2h', questions: '60 questões', difficulty: 'Mista' },
];

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

function questionMap(questions: Question[]): Map<string, Question> {
  return new Map(questions.map((question) => [question.id, question]));
}

export function getWeakTopics(history: QuestionHistory[], questions: Question[]): WeakTopic[] {
  const byId = questionMap(questions);
  const groups = new Map<string, { subject: string; topic: string; attempts: number; correct: number }>();
  history.forEach((attempt) => {
    const question = byId.get(attempt.questionId);
    if (!question) return;
    const key = `${question.subject}::${question.topic}`;
    const current = groups.get(key) ?? { subject: question.subject, topic: question.topic, attempts: 0, correct: 0 };
    current.attempts += 1;
    current.correct += attempt.isCorrect ? 1 : 0;
    groups.set(key, current);
  });
  return [...groups.values()]
    .map((item) => ({ ...item, accuracy: Math.round((item.correct / item.attempts) * 100) }))
    .filter((item) => item.accuracy < 65)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
    .slice(0, 4);
}

export function getSubjectAccuracy(subject: string, history: QuestionHistory[], questions: Question[], mastery: Record<string, number>): { accuracy: number | null; status: ExploreStatus } {
  const byId = questionMap(questions);
  const attempts = history.filter((attempt) => normalize(byId.get(attempt.questionId)?.subject ?? '') === normalize(subject));
  const storedMastery = mastery[subject] ?? mastery[normalize(subject)];
  const accuracy = attempts.length ? Math.round((attempts.filter((item) => item.isCorrect).length / attempts.length) * 100) : Number.isFinite(storedMastery) ? Math.round(storedMastery) : null;
  if (accuracy === null) return { accuracy, status: 'nao_iniciado' };
  if (accuracy >= 75) return { accuracy, status: 'forte' };
  if (accuracy >= 55) return { accuracy, status: 'medio' };
  return { accuracy, status: 'fraco' };
}

export function getRecommendedAction(history: QuestionHistory[], questions: Question[], essays: Essay[]): RecommendedAction {
  const weak = getWeakTopics(history, questions)[0];
  if (weak && weak.attempts >= 2) return { id: 'recommended-weak', eyebrow: 'Seu melhor próximo passo', title: `Revisar ${weak.subject} — ${weak.topic}`, description: `Sua precisão neste assunto está em ${weak.accuracy}%.`, reason: 'Prioridade calculada a partir do seu histórico de respostas.', category: 'treinos', filters: { subject: weak.subject, topic: weak.topic, onlyWrong: true } };
  if (history.length === 0) return { id: 'recommended-diagnostic', eyebrow: 'Recomendado para você', title: 'Comece pelo diagnóstico', description: 'Responda 10 questões para a Athena montar seu caminho.', reason: 'Ainda não há desempenho suficiente para personalizar a recomendação.', category: 'treinos', filters: {} };
  if (essays.length === 0) return { id: 'recommended-essay', eyebrow: 'Equilibre sua preparação', title: 'Treinar redação ENEM', description: 'Você ainda não registrou uma redação neste dispositivo.', reason: 'Uma prática de redação complementa seu histórico de questões.', category: 'redacao', path: '/redacao' };
  return { id: 'recommended-enem', eyebrow: 'Ritmo consistente', title: 'Continue sua trilha ENEM', description: 'Alterne conteúdo e prática para consolidar o que estudou.', reason: 'Sugestão baseada na sua atividade recente.', category: 'trilhas', filters: { examType: 'enem', onlyUnanswered: true } };
}

export function getContinueStudyItems(history: QuestionHistory[], sessions: StudySession[], essays: Essay[], questions: Question[]): ContinueStudyItem[] {
  const byId = questionMap(questions);
  const items: ContinueStudyItem[] = [];
  const latestAttempt = history[0];
  const attemptedIds = new Set(history.map((item) => item.questionId));
  if (latestAttempt) {
    const question = byId.get(latestAttempt.questionId);
    if (question) items.push({ id: 'continue-question', title: `${question.subject} — ${question.topic}`, description: latestAttempt.isCorrect ? 'Última resposta correta. Continue avançando.' : 'Há uma resposta para revisar antes de avançar.', category: 'questoes', filters: { subject: question.subject, topic: question.topic, ...(latestAttempt.isCorrect ? { onlyUnanswered: true } : { onlyWrong: true }) }, meta: `${attemptedIds.size} questões vistas`, progress: Math.min(95, Math.max(8, attemptedIds.size % 100)) });
  }
  const latestSession = sessions[0];
  if (latestSession) items.push({ id: 'continue-session', title: latestSession.subject, description: 'Retome a matéria da sua sessão mais recente.', category: 'questoes', filters: { subject: latestSession.subject }, meta: `${latestSession.duration} min estudados`, progress: Math.min(100, Math.max(10, Math.round((latestSession.duration / 120) * 100))) });
  const latestEssay = essays[0];
  if (latestEssay) items.push({ id: 'continue-essay', title: latestEssay.topicTitle, description: latestEssay.score ? `Última nota: ${latestEssay.score}. Continue evoluindo.` : 'Redação salva e pronta para continuar.', category: 'redacao', path: '/redacao', meta: latestEssay.score ? `${latestEssay.score} pontos` : 'Rascunho salvo', progress: latestEssay.score ? Math.min(100, Math.round(latestEssay.score / 10)) : 35 });
  return items.slice(0, 3);
}

export function getSuggestedTrails(history: QuestionHistory[], questions: Question[]): SmartTrail[] {
  const attempted = new Set(history.map((item) => item.questionId)).size;
  const weak = getWeakTopics(history, questions)[0];
  return TRAIL_BLUEPRINTS.map((trail, index) => ({
    ...trail,
    progress: index === 0 ? Math.min(88, attempted) : weak && normalize(trail.title).includes(normalize(weak.subject)) ? Math.min(75, weak.attempts * 8) : 0,
  }));
}

export function getTrendingTopics(): ExploreAction[] {
  return ['Redação ENEM', 'Funções', 'Cinemática', 'Brasil Colônia', 'Probabilidade', 'Ecologia', 'Interpretação de texto'].map((title, index) => ({
    id: `suggested-${index}`,
    title,
    description: 'Sugestão editorial da Athena',
    category: title.includes('Redação') ? 'redacao' : 'questoes',
    ...(title.includes('Redação') ? { path: '/redacao' } : { filters: { search: title } }),
  }));
}

export function getExploreSearchResults(query: string, questions: Question[]): ExploreAction[] {
  const term = normalize(query.trim());
  if (!term) return [];
  const subjects: ExploreAction[] = SUBJECT_NAMES.map((subject) => ({ id: `subject-${subject}`, title: subject, description: 'Abrir banco de questões filtrado', category: 'materias', filters: { subject }, keywords: [subject] }));
  const topics = [...new Map(questions.map((question) => [normalize(question.topic), question])).values()].slice(0, 250).map<ExploreAction>((question) => ({ id: `topic-${question.subject}-${question.topic}`, title: question.topic, description: `${question.subject} • ${question.exam}`, category: 'questoes', filters: { subject: question.subject, topic: question.topic }, keywords: [question.institution, question.exam, String(question.year)] }));
  const pool = [...GOAL_ACTIONS, ...subjects, ...TRAINING_ACTIONS, ...TRAIL_BLUEPRINTS.map((trail) => ({ ...trail, progress: 0 })), ...ESSAY_ACTIONS, ...SIMULATION_ACTIONS, ...topics];
  return pool.filter((item) => normalize([item.title, item.description, ...(item.keywords ?? [])].join(' ')).includes(term)).slice(0, 24);
}

export function getExploreSections<T extends ExploreAction>(items: T[], filters: ExploreFilters): T[] {
  return items.filter((item) => {
    const itemWithProgress = item as T & { progress?: number; duration?: string };
    if (filters.objective !== 'all') {
      if (filters.objective === 'redacao' && item.category !== 'redacao') return false;
      else if (filters.objective === 'revisao' && !item.filters?.onlyWrong) return false;
      else if (!['redacao', 'revisao'].includes(filters.objective)) {
        if (item.filters?.examType && item.filters.examType !== filters.objective) return false;
        if (item.id.startsWith('goal-') && item.filters?.examType !== filters.objective) return false;
      }
    }
    if (filters.subject && item.filters?.subject && normalize(item.filters.subject) !== normalize(filters.subject)) return false;
    if (filters.difficulty && item.filters?.difficulty && item.filters.difficulty !== filters.difficulty) return false;
    if (filters.duration !== 'all') {
      const duration = normalize(itemWithProgress.duration ?? '');
      const isShort = item.id.includes('quick') || item.id.includes('errors') || item.id.includes('favorites');
      const isLong = item.path === '/simulados' || /[4-9]h|10h/.test(duration);
      if (filters.duration === 'curta' && !isShort) return false;
      if (filters.duration === 'media' && (isShort || isLong)) return false;
      if (filters.duration === 'longa' && !isLong) return false;
    }
    if (filters.status !== 'all') {
      const progress = itemWithProgress.progress ?? 0;
      if (filters.status === 'novo' && progress !== 0) return false;
      if (filters.status === 'andamento' && (progress <= 0 || progress >= 100)) return false;
      if (filters.status === 'concluido' && progress < 100) return false;
    }
    if (filters.trainingType !== 'all') {
      if (filters.trainingType === 'redacao' && item.category !== 'redacao') return false;
      if (filters.trainingType === 'simulado' && item.path !== '/simulados') return false;
      if (filters.trainingType === 'revisao' && !item.filters?.onlyWrong) return false;
      if (filters.trainingType === 'questoes' && item.category !== 'questoes' && item.category !== 'treinos') return false;
    }
    return true;
  });
}
