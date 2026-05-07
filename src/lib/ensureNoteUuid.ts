import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';

/** Garante `id` UUID v4 para linha `public.notes` (Postgres). */
export function ensureNoteUuid(id: string): string {
  return uuidValidate(id) ? id : uuidv4();
}
