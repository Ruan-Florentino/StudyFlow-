import type { Note } from '../../store/types';
import { useUserStore } from '../../store/useUserStore';
import { isSupabaseConfigured, supabase } from '../supabase';

/**
 * Upsert de uma nota na nuvem (RLS: `user_id = auth.uid()`).
 * Silencioso quando Supabase ou `userId` local não estão prontos.
 */
export async function syncNoteToSupabase(note: Note): Promise<void> {
  if (!isSupabaseConfigured) return;

  const userId = useUserStore.getState().userId;
  if (!userId) return;

  const { error } = await supabase.from('notes').upsert(
    {
      id: note.id,
      user_id: userId,
      title: note.title,
      content: note.content,
      subject: note.subject,
      updated_at: note.updatedAt,
    },
    { onConflict: 'id' }
  );

  if (error) throw error;
}
