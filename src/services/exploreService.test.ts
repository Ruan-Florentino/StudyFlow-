import { describe, expect, it } from 'vitest';
import {
  DEFAULT_EXPLORE_FILTERS,
  GOAL_ACTIONS,
  getExploreSearchResults,
  getExploreSections,
  getRecommendedAction,
  getWeakTopics,
} from './exploreService';
import type { Question } from '../types/question';
import type { QuestionHistory } from '../store/types';

const questions: Question[] = [
  {
    id: 'q1', exam: 'ENEM 2025', examType: 'enem', institution: 'INEP', year: 2025,
    subject: 'Matematica', topic: 'Funcoes', difficulty: 'medio', statement: 'Questao sobre funcao',
    alternatives: [{ id: 'A', text: 'A' }, { id: 'B', text: 'B' }], correctAlternative: 'A',
    explanation: 'Explicacao', source: 'teste',
  },
  {
    id: 'q2', exam: 'ITA 2025', examType: 'militar', institution: 'ITA', year: 2025,
    subject: 'Fisica', topic: 'Cinematica', difficulty: 'dificil', statement: 'Questao sobre movimento',
    alternatives: [{ id: 'A', text: 'A' }, { id: 'B', text: 'B' }], correctAlternative: 'B',
    explanation: 'Explicacao', source: 'teste',
  },
];

const history: QuestionHistory[] = [
  { questionId: 'q1', userAnswer: 1, isCorrect: false, timestamp: '2026-07-10T12:00:00Z' },
  { questionId: 'q1', userAnswer: 1, isCorrect: false, timestamp: '2026-07-09T12:00:00Z' },
];

describe('exploreService', () => {
  it('agrupa o desempenho real e recomenda a principal fraqueza', () => {
    expect(getWeakTopics(history, questions)[0]).toMatchObject({ subject: 'Matematica', topic: 'Funcoes', accuracy: 0, attempts: 2 });
    expect(getRecommendedAction(history, questions, [])).toMatchObject({ id: 'recommended-weak', filters: { subject: 'Matematica', topic: 'Funcoes', onlyWrong: true } });
  });

  it('busca sem acentos por prova, instituicao, materia e modo', () => {
    expect(getExploreSearchResults('matemática', questions).some((item) => item.title === 'Matematica')).toBe(true);
    expect(getExploreSearchResults('ITA', questions).some((item) => item.title.includes('ITA') || item.description.includes('ITA'))).toBe(true);
    expect(getExploreSearchResults('revisar erros', questions).some((item) => item.id === 'training-errors')).toBe(true);
  });

  it('aplica e limpa filtros avançados de objetivo', () => {
    const filtered = getExploreSections(GOAL_ACTIONS, { ...DEFAULT_EXPLORE_FILTERS, objective: 'enem' });
    expect(filtered.map((item) => item.id)).toEqual(['goal-enem']);
    expect(getExploreSections(GOAL_ACTIONS, DEFAULT_EXPLORE_FILTERS)).toHaveLength(GOAL_ACTIONS.length);
  });
});
