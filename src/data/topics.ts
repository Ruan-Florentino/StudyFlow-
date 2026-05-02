import { TOPICS as QUESTIONS_TOPICS } from './questions';

export interface SubjectTopic {
  subject: string;
  topic: string;
}

// Flattening TOPICS for easier sorting
export const ALL_TOPICS: SubjectTopic[] = Object.entries(QUESTIONS_TOPICS).flatMap(([subject, topics]) => 
  topics.map(topic => ({ subject, topic }))
);

export const SUBJECT_ICONS: Record<string, string> = {
  'Matemática': '📐',
  'Português': '📚',
  'Física': '⚛️',
  'Química': '🧪',
  'Biologia': '🧬',
  'História': '🏛️',
  'Geografia': '🌍',
  'Filosofia': '🧠',
  'Sociologia': '👥',
  'Inglês': '🇬🇧'
};
