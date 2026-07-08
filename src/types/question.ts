export type QuestionExamType = 'enem' | 'vestibular' | 'concurso' | 'militar';
export type QuestionDifficulty = 'facil' | 'medio' | 'dificil' | 'muito_dificil';
export type QuestionAlternativeId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface QuestionAlternative {
  id: QuestionAlternativeId;
  text: string;
}

export interface Question {
  id: string;
  exam: string;
  examType: QuestionExamType;
  institution: string;
  year: number;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  statement: string;
  alternatives: QuestionAlternative[];
  correctAlternative: QuestionAlternativeId;
  explanation: string;
  source: string;
  imageUrl?: string;
}

export interface QuestionFilterState {
  search?: string;
  exam?: string;
  examType?: QuestionExamType | '';
  institution?: string;
  year?: number | '';
  subject?: string;
  topic?: string;
  difficulty?: QuestionDifficulty | '';
  onlyWrong?: boolean;
  onlyFavorites?: boolean;
  onlyReviewLater?: boolean;
  onlyUnanswered?: boolean;
}

export interface QuestionRuntimeFilters {
  wrongIds?: Set<string>;
  answeredIds?: Set<string>;
  favoriteIds?: Set<string>;
  reviewLaterIds?: Set<string>;
}

export interface QuestionImportReport {
  accepted: Question[];
  rejected: Array<{ index: number; reason: string }>;
}