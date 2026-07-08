import { SEED_QUESTIONS } from '../data/questions/seed';
import type { Question as LegacyQuestion } from '../data/types';
import { loadAllQuestionsWithImported } from '../lib/mergeImportedQuestions';
import type {
  Question,
  QuestionAlternativeId,
  QuestionDifficulty,
  QuestionExamType,
  QuestionFilterState,
  QuestionImportReport,
  QuestionRuntimeFilters,
} from '../types/question';

const ALT_IDS: QuestionAlternativeId[] = ['A', 'B', 'C', 'D', 'E'];
const LEGACY_DIFFICULTY: Record<QuestionDifficulty, LegacyQuestion['difficulty']> = {
  facil: 'Easy',
  medio: 'Medium',
  dificil: 'Hard',
  muito_dificil: 'Hard',
};
export const QUESTION_BANK_TARGETS: Record<QuestionExamType, number> = {
  enem: 2420,
  vestibular: 5300,
  concurso: 1000,
  militar: 4000,
};

export const QUESTION_BANK_TOTAL_TARGET = Object.values(QUESTION_BANK_TARGETS).reduce((total, value) => total + value, 0);

const MILITARY_EXAMS = new Set(['ita', 'ime', 'esa', 'espcex', 'afa', 'efomm']);
const CONCURSO_EXAMS = new Set(['banco do brasil', 'bb', 'caixa', 'inss', 'ibge', 'correios', 'petrobras', 'prf', 'policia federal']);

const SUBJECT_ALIASES: Record<string, string> = {
  matematica: 'Matematica',
  portugues: 'Portugues',
  fisica: 'Fisica',
  quimica: 'Quimica',
  biologia: 'Biologia',
  historia: 'Historia',
  geografia: 'Geografia',
  filosofia: 'Filosofia',
  sociologia: 'Sociologia',
  ingles: 'Ingles',
};

let loadedQuestionBankPromise: Promise<Question[]> | null = null;

export const QUESTION_EXAM_TYPE_LABELS: Record<QuestionExamType, string> = {
  enem: 'ENEM',
  vestibular: 'Vestibulares',
  concurso: 'Concursos',
  militar: 'Militares',
};

export const QUESTION_DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  facil: 'Facil',
  medio: 'Medio',
  dificil: 'Dificil',
  muito_dificil: 'Muito dificil',
};

function normalize(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function uniqueSorted(values: Array<string | number>) {
  return Array.from(new Set(values.filter((value) => value !== '' && value !== null && value !== undefined))).sort((a, b) =>
    String(a).localeCompare(String(b), 'pt-BR', { numeric: true })
  );
}

function parseAlternativeId(value: unknown): QuestionAlternativeId | null {
  const id = String(value ?? '').trim().toUpperCase();
  return ALT_IDS.includes(id as QuestionAlternativeId) ? (id as QuestionAlternativeId) : null;
}

function parseDifficulty(value: unknown): QuestionDifficulty | null {
  const normalized = normalize(value).replace(/\s+/g, '_');
  if (normalized === 'easy' || normalized === 'facil') return 'facil';
  if (normalized === 'medium' || normalized === 'medio') return 'medio';
  if (normalized === 'hard' || normalized === 'dificil') return 'dificil';
  if (normalized === 'very_hard' || normalized === 'muito_dificil') return 'muito_dificil';
  return null;
}

function parseExamType(value: unknown): QuestionExamType | null {
  const normalized = normalize(value);
  if (normalized === 'enem') return 'enem';
  if (normalized === 'vestibular') return 'vestibular';
  if (normalized === 'concurso') return 'concurso';
  if (normalized === 'militar') return 'militar';
  return null;
}

function repairText(value: unknown): string {
  const text = String(value ?? '').trim();
  if (!/[\u00c3\u00c2\u00e2\u00ce]/.test(text)) return text;

  try {
    const bytes = Uint8Array.from(Array.from(text, (char) => char.charCodeAt(0)));
    const decoded = new TextDecoder('utf-8').decode(bytes);
    const originalMarkers = (text.match(/[\u00c3\u00c2\u00e2\u00ce]/g) ?? []).length;
    const decodedMarkers = (decoded.match(/[\u00c3\u00c2\u00e2\u00ce]/g) ?? []).length;
    return decoded && decodedMarkers < originalMarkers ? decoded : text;
  } catch {
    return text;
  }
}

function classifyLegacyExamType(exam: string): QuestionExamType {
  const normalizedExam = normalize(exam);
  if (normalizedExam.includes('enem')) return 'enem';
  if (MILITARY_EXAMS.has(normalizedExam)) return 'militar';
  if (CONCURSO_EXAMS.has(normalizedExam)) return 'concurso';
  return 'vestibular';
}

function canonicalSubject(value: unknown): string {
  const repaired = repairText(value);
  return SUBJECT_ALIASES[normalize(repaired)] ?? repaired;
}

function legacyDifficultyToStudyFlow(difficulty: LegacyQuestion['difficulty']): QuestionDifficulty {
  if (difficulty === 'Easy') return 'facil';
  if (difficulty === 'Hard') return 'dificil';
  return 'medio';
}

function legacyInstitution(exam: string, examType: QuestionExamType): string {
  if (examType === 'enem') return 'INEP / ENEM';
  return exam;
}

function legacySource(question: LegacyQuestion): string {
  if (question.id.startsWith('bulk-') || question.id.startsWith('12k-')) {
    return 'Banco de pratica StudyFlow legado. Item gerado para treino; nao e questao oficial.';
  }
  return 'Seed autoral StudyFlow legado para treino. Nao e item oficial de prova.';
}

function fromLegacyQuestion(question: LegacyQuestion): Question | null {
  if (!question?.id || !question.prova || !question.pergunta || !Array.isArray(question.alternativas)) return null;
  if (question.alternativas.length < 2 || question.resposta < 0 || question.resposta >= question.alternativas.length) return null;

  const exam = repairText(question.prova);
  const examType = classifyLegacyExamType(exam);
  const alternatives = question.alternativas.slice(0, ALT_IDS.length).map((text, index) => ({
    id: ALT_IDS[index],
    text: repairText(text),
  }));
  const correctAlternative = ALT_IDS[question.resposta];
  if (!correctAlternative) return null;

  return {
    id: question.id,
    exam,
    examType,
    institution: legacyInstitution(exam, examType),
    year: Number(question.ano) || new Date().getFullYear(),
    subject: canonicalSubject(question.materia),
    topic: repairText(question.assunto),
    difficulty: legacyDifficultyToStudyFlow(question.difficulty),
    statement: repairText(question.pergunta),
    alternatives,
    correctAlternative,
    explanation: repairText(question.explicacao),
    source: legacySource(question),
    imageUrl: question.imagem,
  };
}

function uniqueQuestions(questions: Question[]): Question[] {
  const byId = new Map<string, Question>();
  questions.forEach((question) => {
    if (!byId.has(question.id)) byId.set(question.id, question);
  });
  return Array.from(byId.values());
}

function applyQuestionBankTargets(questions: Question[]): Question[] {
  const grouped: Record<QuestionExamType, Question[]> = { enem: [], vestibular: [], concurso: [], militar: [] };
  uniqueQuestions(questions).forEach((question) => grouped[question.examType].push(question));
  return (Object.keys(QUESTION_BANK_TARGETS) as QuestionExamType[]).flatMap((examType) => grouped[examType].slice(0, QUESTION_BANK_TARGETS[examType]));
}

export function loadQuestionBank(): Promise<Question[]> {
  if (loadedQuestionBankPromise) return loadedQuestionBankPromise;
  loadedQuestionBankPromise = loadAllQuestionsWithImported()
    .then((legacyQuestions) => {
      const converted = legacyQuestions.map(fromLegacyQuestion).filter((question): question is Question => Boolean(question));
      return applyQuestionBankTargets([...SEED_QUESTIONS, ...converted]);
    })
    .catch((error) => {
      console.error('[questions] failed to load large bank', error);
      return SEED_QUESTIONS;
    });
  return loadedQuestionBankPromise;
}

export function getQuestionBankTargets() {
  return QUESTION_BANK_TARGETS;
}

export function getQuestions(): Question[] {
  return SEED_QUESTIONS;
}

export function getQuestionById(id: string, questions: Question[] = getQuestions()): Question | undefined {
  return questions.find((question) => question.id === id);
}

export function getQuestionsByExam(exam: string, questions: Question[] = getQuestions()): Question[] {
  const target = normalize(exam);
  return questions.filter((question) => normalize(question.exam) === target);
}

export function getQuestionsBySubject(subject: string, questions: Question[] = getQuestions()): Question[] {
  const target = normalize(subject);
  return questions.filter((question) => normalize(question.subject) === target);
}

export function getQuestionsByYear(year: number, questions: Question[] = getQuestions()): Question[] {
  return questions.filter((question) => question.year === year);
}

export function getQuestionsByDifficulty(difficulty: QuestionDifficulty, questions: Question[] = getQuestions()): Question[] {
  return questions.filter((question) => question.difficulty === difficulty);
}

export function searchQuestions(query: string, questions: Question[] = getQuestions()): Question[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return questions;

  return questions.filter((question) => {
    const haystack = normalize([
      question.exam,
      question.examType,
      question.institution,
      question.year,
      question.subject,
      question.topic,
      question.statement,
      question.source,
    ].join(' '));
    return terms.every((term) => haystack.includes(term));
  });
}

export function filterQuestions(
  questions: Question[] = getQuestions(),
  filters: QuestionFilterState = {},
  runtime: QuestionRuntimeFilters = {}
): Question[] {
  const searched = searchQuestions(filters.search ?? '', questions);
  const exam = normalize(filters.exam);
  const institution = normalize(filters.institution);
  const subject = normalize(filters.subject);
  const topic = normalize(filters.topic);

  return searched.filter((question) => {
    if (filters.examType && question.examType !== filters.examType) return false;
    if (exam && normalize(question.exam) !== exam) return false;
    if (institution && normalize(question.institution) !== institution) return false;
    if (filters.year && question.year !== Number(filters.year)) return false;
    if (subject && normalize(question.subject) !== subject) return false;
    if (topic && normalize(question.topic) !== topic) return false;
    if (filters.difficulty && question.difficulty !== filters.difficulty) return false;
    if (filters.onlyWrong && !runtime.wrongIds?.has(question.id)) return false;
    if (filters.onlyFavorites && !runtime.favoriteIds?.has(question.id)) return false;
    if (filters.onlyReviewLater && !runtime.reviewLaterIds?.has(question.id)) return false;
    if (filters.onlyUnanswered && runtime.answeredIds?.has(question.id)) return false;
    return true;
  });
}

export function getQuestionFacets(questions: Question[] = getQuestions()) {
  return {
    exams: uniqueSorted(questions.map((question) => question.exam)) as string[],
    examTypes: uniqueSorted(questions.map((question) => question.examType)) as QuestionExamType[],
    institutions: uniqueSorted(questions.map((question) => question.institution)) as string[],
    years: uniqueSorted(questions.map((question) => question.year)) as number[],
    subjects: uniqueSorted(questions.map((question) => question.subject)) as string[],
    topics: uniqueSorted(questions.map((question) => question.topic)) as string[],
    difficulties: uniqueSorted(questions.map((question) => question.difficulty)) as QuestionDifficulty[],
  };
}

export function getQuestionStats(questions: Question[] = getQuestions()) {
  const byExamType = questions.reduce<Record<QuestionExamType, number>>(
    (acc, question) => {
      acc[question.examType] += 1;
      return acc;
    },
    { enem: 0, vestibular: 0, concurso: 0, militar: 0 }
  );

  const bySubject = questions.reduce<Record<string, number>>((acc, question) => {
    acc[question.subject] = (acc[question.subject] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: questions.length,
    byExamType,
    bySubject,
    sourceCount: uniqueSorted(questions.map((question) => question.source)).length,
  };
}

export function toLegacyQuestion(question: Question): LegacyQuestion {
  const correctIndex = question.alternatives.findIndex((alt) => alt.id === question.correctAlternative);
  return {
    id: question.id,
    prova: question.exam,
    ano: question.year,
    materia: question.subject,
    assunto: question.topic,
    pergunta: question.statement,
    alternativas: question.alternatives.map((alt) => alt.text),
    resposta: Math.max(0, correctIndex),
    explicacao: question.explanation,
    imagem: question.imageUrl,
    difficulty: LEGACY_DIFFICULTY[question.difficulty],
  };
}

export function normalizeQuestionInput(input: Partial<Question>): Question | null {
  const correctAlternative = parseAlternativeId(input.correctAlternative);
  const difficulty = parseDifficulty(input.difficulty);
  const examType = parseExamType(input.examType);
  const alternatives = Array.isArray(input.alternatives) ? input.alternatives : [];

  if (!input.id || !input.exam || !examType || !input.institution || !input.year || !input.subject || !input.topic) return null;
  if (!difficulty || !input.statement || !correctAlternative || !input.explanation || !input.source) return null;
  if (alternatives.length < 2) return null;

  const normalizedAlternatives = alternatives
    .map((alternative, index) => ({
      id: parseAlternativeId(alternative?.id) ?? ALT_IDS[index],
      text: String(alternative?.text ?? '').trim(),
    }))
    .filter((alternative) => Boolean(alternative.id) && alternative.text.length > 0);

  if (!normalizedAlternatives.some((alternative) => alternative.id === correctAlternative)) return null;

  return {
    id: String(input.id),
    exam: String(input.exam),
    examType,
    institution: String(input.institution),
    year: Number(input.year),
    subject: String(input.subject),
    topic: String(input.topic),
    difficulty,
    statement: String(input.statement),
    alternatives: normalizedAlternatives,
    correctAlternative,
    explanation: String(input.explanation),
    source: String(input.source),
    imageUrl: input.imageUrl ? String(input.imageUrl) : undefined,
  };
}

export function importQuestionsFromJson(json: string): QuestionImportReport {
  try {
    const parsed = JSON.parse(json) as unknown;
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    return rows.reduce<QuestionImportReport>(
      (report, row, index) => {
        const question = normalizeQuestionInput(row as Partial<Question>);
        if (question) report.accepted.push(question);
        else report.rejected.push({ index, reason: 'Formato de questao invalido.' });
        return report;
      },
      { accepted: [], rejected: [] }
    );
  } catch {
    return { accepted: [], rejected: [{ index: 0, reason: 'JSON invalido.' }] };
  }
}

export function importQuestionsFromCsv(csv: string): QuestionImportReport {
  const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return { accepted: [], rejected: [{ index: 0, reason: 'CSV sem linhas de dados.' }] };

  const headers = lines[0].split(',').map((header) => header.trim());
  return lines.slice(1).reduce<QuestionImportReport>(
    (report, line, index) => {
      const values = line.split(',').map((value) => value.trim());
      const row = headers.reduce<Record<string, string>>((acc, header, valueIndex) => {
        acc[header] = values[valueIndex] ?? '';
        return acc;
      }, {});
      const alternatives = ALT_IDS.map((id) => ({ id, text: row[`alternative${id}`] })).filter((alt) => alt.text);
      const question = normalizeQuestionInput({
        ...row,
        year: Number(row.year),
        alternatives,
      } as Partial<Question>);
      if (question) report.accepted.push(question);
      else report.rejected.push({ index: index + 1, reason: 'Linha CSV invalida.' });
      return report;
    },
    { accepted: [], rejected: [] }
  );
}