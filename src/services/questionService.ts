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
const STUDYFLOW_PRACTICE_INSTITUTION = 'StudyFlow Practice';
const STUDYFLOW_PRACTICE_SOURCE =
  'Pratica StudyFlow. Item autoral/legado para treino respondivel; nao e questao oficial. Importacao real por JSON/CSV/API segue pronta para fontes oficiais licenciadas.';

const PRACTICE_EXAMS: Record<QuestionExamType, string[]> = {
  enem: ['ENEM'],
  vestibular: ['Fuvest', 'Unicamp', 'Unesp', 'UFRGS', 'UFPR', 'UFMG', 'UFRJ', 'UFBA', 'UFPE', 'UFSC', 'UnB'],
  concurso: ['Banco do Brasil', 'INSS', 'IBGE', 'Correios', 'Petrobras', 'PRF', 'Policia Federal'],
  militar: ['ITA', 'IME', 'ESA', 'EsPCEx', 'AFA', 'EFOMM'],
};

const DIFFICULTY_ROTATION: QuestionDifficulty[] = ['facil', 'medio', 'dificil', 'muito_dificil'];

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

function isStudyFlowPracticeLegacy(question: LegacyQuestion): boolean {
  return question.id.startsWith('bulk-') || question.id.startsWith('12k-');
}

function legacyInstitution(question: LegacyQuestion, exam: string, examType: QuestionExamType): string {
  if (isStudyFlowPracticeLegacy(question)) return STUDYFLOW_PRACTICE_INSTITUTION;
  if (examType === 'enem') return STUDYFLOW_PRACTICE_INSTITUTION;
  return exam || STUDYFLOW_PRACTICE_INSTITUTION;
}

function legacySource(question: LegacyQuestion): string {
  if (isStudyFlowPracticeLegacy(question)) return STUDYFLOW_PRACTICE_SOURCE;
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
    institution: legacyInstitution(question, exam, examType),
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

function makeAlternatives(values: string[]): Question['alternatives'] {
  return values.slice(0, ALT_IDS.length).map((text, index) => ({ id: ALT_IDS[index], text }));
}

function uniquePracticeId(examType: QuestionExamType, index: number, existingIds: Set<string>): string {
  let id = `sf-practice-${examType}-${String(index + 1).padStart(5, '0')}`;
  let attempt = 2;
  while (existingIds.has(id)) {
    id = `sf-practice-${examType}-${String(index + 1).padStart(5, '0')}-${attempt}`;
    attempt += 1;
  }
  existingIds.add(id);
  return id;
}

function buildPracticeQuestion(examType: QuestionExamType, index: number, existingIds: Set<string>): Question {
  const examPool = PRACTICE_EXAMS[examType];
  const exam = examPool[index % examPool.length];
  const year = 2010 + (index % 16);
  const difficulty = DIFFICULTY_ROTATION[index % DIFFICULTY_ROTATION.length];
  const variant = index + 1;
  const template = index % 8;
  const common = {
    id: uniquePracticeId(examType, index, existingIds),
    exam,
    examType,
    institution: STUDYFLOW_PRACTICE_INSTITUTION,
    year,
    difficulty,
    source: STUDYFLOW_PRACTICE_SOURCE,
  };

  if (template === 0) {
    const a = 3 + (variant % 9);
    const x = 4 + (variant % 17);
    const b = 6 + (variant % 41);
    const result = a * x + b;
    return {
      ...common,
      subject: 'Matematica',
      topic: 'Equacoes do 1 grau',
      statement: `Em um treino de ${exam}, resolva a equacao ${a}x + ${b} = ${result}. Qual e o valor de x?`,
      alternatives: makeAlternatives([String(x - 2), String(x - 1), String(x), String(x + 1), String(x + 2)]),
      correctAlternative: 'C',
      explanation: `Subtraindo ${b} dos dois lados, temos ${a}x = ${result - b}. Dividindo por ${a}, x = ${x}.`,
    };
  }

  if (template === 1) {
    const total = 80 + (variant % 9) * 20;
    const percent = [10, 20, 25, 40, 50][variant % 5];
    const value = Math.round((total * percent) / 100);
    return {
      ...common,
      subject: 'Matematica',
      topic: 'Porcentagem',
      statement: `Um grupo tem ${total} estudantes e ${percent}% deles revisaram a materia antes do simulado. Quantos estudantes revisaram?`,
      alternatives: makeAlternatives([String(value - 10), String(value - 5), String(value), String(value + 5), String(value + 10)]),
      correctAlternative: 'C',
      explanation: `${percent}% de ${total} equivale a ${percent / 100} x ${total} = ${value}.`,
    };
  }

  if (template === 2) {
    const v0 = 4 + (variant % 8);
    const accel = 2 + (variant % 5);
    const time = 3 + (variant % 6);
    const velocity = v0 + accel * time;
    return {
      ...common,
      subject: 'Fisica',
      topic: 'Cinematica',
      statement: `Um corpo tem velocidade inicial de ${v0} m/s e aceleracao constante de ${accel} m/s2 por ${time} s. Qual e a velocidade final?`,
      alternatives: makeAlternatives([`${velocity - 4} m/s`, `${velocity - 2} m/s`, `${velocity} m/s`, `${velocity + 2} m/s`, `${velocity + 4} m/s`]),
      correctAlternative: 'C',
      explanation: `Pela relacao v = v0 + a.t, v = ${v0} + ${accel} x ${time} = ${velocity} m/s.`,
    };
  }

  if (template === 3) {
    return {
      ...common,
      subject: 'Portugues',
      topic: 'Texto dissertativo-argumentativo',
      statement: `Em um texto dissertativo-argumentativo no modelo ${exam}, qual elemento apresenta a ideia central defendida pelo autor?`,
      alternatives: makeAlternatives(['Exemplo acessorio', 'Tese', 'Vocativo', 'Referencia bibliografica', 'Digressao sem funcao']),
      correctAlternative: 'B',
      explanation: 'A tese e a ideia central defendida e sustentada por argumentos ao longo do texto.',
    };
  }

  if (template === 4) {
    return {
      ...common,
      subject: 'Biologia',
      topic: 'Ecologia',
      statement: 'A retirada de predadores de topo de uma cadeia alimentar tende a gerar qual efeito inicial mais provavel?',
      alternatives: makeAlternatives([
        'Reducao imediata dos herbivoros',
        'Aumento de herbivoros e maior pressao sobre produtores',
        'Desaparecimento dos decompositores',
        'Aumento automatico da biomassa vegetal',
        'Interrupcao completa do fluxo de energia',
      ]),
      correctAlternative: 'B',
      explanation: 'Sem predadores de topo, herbivoros podem aumentar e consumir mais produtores, gerando desequilibrio trofico.',
    };
  }

  if (template === 5) {
    const scaleKm = [1, 2, 5, 10][variant % 4];
    const denominator = scaleKm * 100000;
    return {
      ...common,
      subject: 'Geografia',
      topic: 'Cartografia',
      statement: `Em um mapa com escala 1:${denominator.toLocaleString('pt-BR')}, 1 cm no mapa corresponde a quantos quilometros no terreno?`,
      alternatives: makeAlternatives([`${scaleKm / 10} km`, `${scaleKm / 2} km`, `${scaleKm} km`, `${scaleKm * 2} km`, `${scaleKm * 10} km`]),
      correctAlternative: 'C',
      explanation: `${denominator.toLocaleString('pt-BR')} cm equivalem a ${scaleKm * 1000} m, isto e, ${scaleKm} km.`,
    };
  }

  if (template === 6) {
    return {
      ...common,
      subject: 'Historia',
      topic: 'Brasil Republica',
      statement: 'A Primeira Republica brasileira ficou marcada pelo predominio politico de oligarquias estaduais. A chamada politica do cafe com leite associava principalmente quais estados?',
      alternatives: makeAlternatives(['Sao Paulo e Minas Gerais', 'Bahia e Pernambuco', 'Para e Amazonas', 'Ceara e Maranhao', 'Rio Grande do Sul e Santa Catarina']),
      correctAlternative: 'A',
      explanation: 'A expressao remete a acordos politicos entre elites de Sao Paulo, associadas ao cafe, e Minas Gerais, associadas a pecuaria/leite.',
    };
  }

  return {
    ...common,
    subject: examType === 'concurso' ? 'Raciocinio Logico' : 'Quimica',
    topic: examType === 'concurso' ? 'Proporcionalidade' : 'Estequiometria',
    statement:
      examType === 'concurso'
        ? 'Se 4 atendentes realizam 80 atendimentos em uma hora, mantendo a mesma produtividade, 6 atendentes realizam quantos atendimentos?'
        : 'Na reacao hipotetica A + B -> C, se 2 mol de A reagem totalmente com 2 mol de B, quantos mol de C sao formados na proporcao 1:1:1?',
    alternatives:
      examType === 'concurso'
        ? makeAlternatives(['100', '110', '120', '140', '160'])
        : makeAlternatives(['1 mol', '2 mol', '3 mol', '4 mol', '6 mol']),
    correctAlternative: examType === 'concurso' ? 'C' : 'B',
    explanation:
      examType === 'concurso'
        ? 'A produtividade e diretamente proporcional: 80/4 = 20 atendimentos por atendente; 6 x 20 = 120.'
        : 'Na proporcao 1:1:1, 2 mol dos reagentes formam 2 mol do produto C.',
  };
}

function applyQuestionBankTargets(questions: Question[]): Question[] {
  const grouped: Record<QuestionExamType, Question[]> = { enem: [], vestibular: [], concurso: [], militar: [] };
  const unique = uniqueQuestions(questions);
  const existingIds = new Set(unique.map((question) => question.id));

  unique.forEach((question) => grouped[question.examType].push(question));

  return (Object.keys(QUESTION_BANK_TARGETS) as QuestionExamType[]).flatMap((examType) => {
    const target = QUESTION_BANK_TARGETS[examType];
    const selected = grouped[examType].slice(0, target);
    while (selected.length < target) {
      selected.push(buildPracticeQuestion(examType, selected.length, existingIds));
    }
    return selected;
  });
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
      question.alternatives.map((alternative) => alternative.text).join(' '),
      question.explanation,
      question.correctAlternative,
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
    if (filters.onlyAnswered && !runtime.answeredIds?.has(question.id)) return false;
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
