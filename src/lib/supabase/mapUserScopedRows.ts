/**
 * Mapeamento defensivo PostgREST → domínio (`store/types`).
 *
 * @remarks
 * Colunas **obrigatórias** por entidade (se faltar, a linha é descartada):
 * - **flashcards:** `id`, `deck_id` | `deckId`, `front`, `back`, `subject`
 * - **decks:** `id`, `name`, `subject`
 * - **notes:** `id`, `title`, `content`, `subject`
 * - **chat_history:** `id`, `role` (aceita `assistant`→model, `system`→user), texto em `text` | `content` | `body`
 * - **leaderboard (`users`):** `id`; demais opcionais (`name`, `xp`, `level`, `streak`, `league`, `daily_xp`, `profile_pic`)
 *
 * Aceita **snake_case e camelCase** onde o app já persistir assim. Timestamps ISO a partir de strings válidas.
 * `chat_history` pode trazer `data` ou `payload` (objeto ou primitivo) para `Message.data`.
 */

import type {
  Deck,
  Flashcard,
  LeaderboardUserRow,
  Message,
  Note,
} from '../../store/types';

/** Evita `Message['type']` inline — alguns parsers TSX confundem com JSX. */
type ChatMessageType = NonNullable<Message['type']>;

const FLASHCARD_LEVELS = ['Novo', 'Aprendendo', 'Revisando', 'Dominado'] as const;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function pickStringLoose(r: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'string') return v;
    if (typeof v === 'number' && !Number.isNaN(v)) return String(v);
    if (typeof v === 'boolean') return String(v);
  }
  return undefined;
}

function pickNumberLoose(r: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return undefined;
}

function pickIsoTimestamp(r: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'string' && v.length > 0) {
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) return d.toISOString();
    }
  }
  return undefined;
}

function parseFlashcardLevel(raw: string | undefined): Flashcard['level'] {
  if (raw && (FLASHCARD_LEVELS as readonly string[]).includes(raw)) {
    return raw as Flashcard['level'];
  }
  return 'Novo';
}

function parseMessageRole(raw: string | undefined): 'user' | 'model' | null {
  if (raw === 'user' || raw === 'model') return raw;
  if (raw === 'assistant') return 'model';
  if (raw === 'system') return 'user';
  return null;
}

function parseMessageType(raw: string | undefined): ChatMessageType | undefined {
  if (!raw) return undefined;
  const allowed: ChatMessageType[] = [
    'text',
    'plan',
    'questions',
    'flashcards',
    'image',
    'audio',
    'music',
    'slides',
  ];
  return allowed.includes(raw as ChatMessageType) ? (raw as ChatMessageType) : 'text';
}

/** Uma linha de `flashcards` (ou equivalente). */
export function mapFlashcardRow(raw: unknown): Flashcard | null {
  if (!isRecord(raw)) return null;
  const id = pickStringLoose(raw, 'id');
  const deckId = pickStringLoose(raw, 'deck_id', 'deckId');
  const front = pickStringLoose(raw, 'front');
  const back = pickStringLoose(raw, 'back');
  const subject = pickStringLoose(raw, 'subject');
  if (!id || !deckId || front === undefined || back === undefined || subject === undefined) return null;

  const interval = pickNumberLoose(raw, 'interval') ?? 0;
  const nextReview =
    pickIsoTimestamp(raw, 'next_review', 'nextReview') ?? new Date().toISOString();
  const lastReviewed = pickIsoTimestamp(raw, 'last_reviewed', 'lastReviewed');
  const level = parseFlashcardLevel(pickStringLoose(raw, 'level'));
  const easeFactor = pickNumberLoose(raw, 'ease_factor', 'easeFactor');
  const repetitions = pickNumberLoose(raw, 'repetitions');

  return {
    id,
    deckId,
    front,
    back,
    subject,
    level,
    interval,
    nextReview,
    ...(lastReviewed !== undefined ? { lastReviewed } : {}),
    ...(easeFactor !== undefined ? { easeFactor } : {}),
    ...(repetitions !== undefined ? { repetitions } : {}),
  };
}

/** Uma linha de `decks`. */
export function mapDeckRow(raw: unknown): Deck | null {
  if (!isRecord(raw)) return null;
  const id = pickStringLoose(raw, 'id');
  const name = pickStringLoose(raw, 'name');
  const subject = pickStringLoose(raw, 'subject');
  if (!id || name === undefined || subject === undefined) return null;

  return {
    id,
    name,
    subject,
    cardCount: pickNumberLoose(raw, 'card_count', 'cardCount') ?? 0,
    newCards: pickNumberLoose(raw, 'new_cards', 'newCards') ?? 0,
    reviewCards: pickNumberLoose(raw, 'review_cards', 'reviewCards') ?? 0,
  };
}

/** Uma linha de `notes`. */
export function mapNoteRow(raw: unknown): Note | null {
  if (!isRecord(raw)) return null;
  const id = pickStringLoose(raw, 'id');
  const title = pickStringLoose(raw, 'title');
  const content = pickStringLoose(raw, 'content');
  const subject = pickStringLoose(raw, 'subject');
  if (!id || title === undefined || content === undefined || subject === undefined) return null;

  const updatedAt =
    pickIsoTimestamp(raw, 'updated_at', 'updatedAt') ?? new Date().toISOString();

  return { id, title, content, subject, updatedAt };
}

/** Uma linha de `chat_history` (sync remoto); tolerante a nomes parecidos com `messages`. */
export function mapChatHistoryRow(raw: unknown): Message | null {
  if (!isRecord(raw)) return null;
  const id = pickStringLoose(raw, 'id');
  const roleRaw = pickStringLoose(raw, 'role');
  const role = parseMessageRole(roleRaw);
  const text = pickStringLoose(raw, 'text', 'content', 'body') ?? '';
  if (!id || !role || text === '') return null;

  const timestamp =
    pickIsoTimestamp(raw, 'timestamp', 'created_at', 'createdAt') ?? new Date().toISOString();
  const type = parseMessageType(pickStringLoose(raw, 'type'));
  const engine = pickStringLoose(raw, 'engine');
  const dataRaw = raw.data ?? raw.payload;

  const base: Message = {
    id,
    role,
    text,
    timestamp,
    ...(type !== undefined ? { type } : {}),
    ...(engine !== undefined ? { engine } : {}),
  };

  if (dataRaw !== undefined && dataRaw !== null && isRecord(dataRaw)) {
    return { ...base, data: dataRaw as Message['data'] };
  }
  if (dataRaw !== undefined && dataRaw !== null) {
    return { ...base, data: dataRaw as Message['data'] };
  }

  return base;
}

/** Uma linha de `users` no ranking (top XP). */
export function mapLeaderboardUserRow(raw: unknown): LeaderboardUserRow | null {
  if (!isRecord(raw)) return null;
  const id = pickStringLoose(raw, 'id');
  if (!id) return null;

  const orNull = (n: number | undefined): number | null | undefined => {
    if (n === undefined) return undefined;
    return n;
  };

  return {
    id,
    name: pickStringLoose(raw, 'name') ?? null,
    xp: orNull(pickNumberLoose(raw, 'xp')),
    level: orNull(pickNumberLoose(raw, 'level')),
    streak: orNull(pickNumberLoose(raw, 'streak')),
    league: pickStringLoose(raw, 'league') ?? null,
    daily_xp: orNull(pickNumberLoose(raw, 'daily_xp', 'dailyXP')),
    profile_pic: pickStringLoose(raw, 'profile_pic', 'profilePic') ?? null,
  };
}

/** Resposta `select` de flashcards do usuário; não-array → `[]`. */
export function flashcardsFromSupabaseRows(rows: unknown): Flashcard[] {
  if (!Array.isArray(rows)) return [];
  return rows.map(mapFlashcardRow).filter((x): x is Flashcard => x !== null);
}

/** Resposta `select` de decks do usuário. */
export function decksFromSupabaseRows(rows: unknown): Deck[] {
  if (!Array.isArray(rows)) return [];
  return rows.map(mapDeckRow).filter((x): x is Deck => x !== null);
}

export function notesFromSupabaseRows(rows: unknown): Note[] {
  if (!Array.isArray(rows)) return [];
  return rows.map(mapNoteRow).filter((x): x is Note => x !== null);
}

/** Resposta `select` de `chat_history` do usuário. */
export function chatHistoryFromSupabaseRows(rows: unknown): Message[] {
  if (!Array.isArray(rows)) return [];
  return rows.map(mapChatHistoryRow).filter((x): x is Message => x !== null);
}

/** Lista de linhas `users` (ex.: top 10 por `xp`). */
export function leaderboardUsersFromSupabaseRows(rows: unknown): LeaderboardUserRow[] {
  if (!Array.isArray(rows)) return [];
  return rows.map(mapLeaderboardUserRow).filter((x): x is LeaderboardUserRow => x !== null);
}
