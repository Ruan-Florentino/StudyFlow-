/**
 * Papéis persistidos em `public.users.role` (Supabase).
 * `pro` permanece só em `plan` legado — trate como premium nos gates.
 */
export type UserRole = 'free' | 'premium' | 'supremo' | 'admin';

export type PremiumFeature = 'flashcards' | 'aiTutor' | 'essay' | 'exams';
