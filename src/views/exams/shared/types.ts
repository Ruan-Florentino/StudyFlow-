import { ExamDetail, Question, QuestionHistory } from '../../../store';

export type Exam = ExamDetail;

export interface ExamResult {
  examId: string;
  examName: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  answers: Record<number, number>;
  questions: Question[];
  timestamp: string;
}

export type { Question, QuestionHistory };
