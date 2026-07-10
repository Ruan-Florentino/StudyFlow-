/**
 * Sync remoto pós-auth: perfil `users`, tabelas escopadas por `user_id`, ranking e realtime.
 *
 * @remarks
 * - `applyUserProfilePayloadToStores`: mescla `SupabaseUserProfilePayload` em `useUserStore` + hub + `useUIStore.setPlan`.
 * - `startUserRemoteSync`: garante linha em `users`, aplica perfil, subscreve Postgres + refetch; retorno dá `unsubscribe` total.
 * O `SupabaseProvider` chama isto e controla `setAuthReady` / geração para corrida entre sessões.
 */

import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { attemptsRowsToHistory, calendarDayLocal } from '../persistence';
import {
  useStore,
  useUserStore,
  useExamStore,
  useSessionStore,
  useFlashcardStore,
} from '../../store';
import { normalizeDbRole, parseBillingPlanFromDb } from '../userAccessLogic';
import type { UserStore } from '../../store/useUserStore';
import type { SupabaseUserProfilePayload } from '../../store/types';
import { useUIStore } from '../../store/useUIStore';
import {
  chatHistoryFromSupabaseRows,
  decksFromSupabaseRows,
  flashcardsFromSupabaseRows,
  leaderboardUsersFromSupabaseRows,
  notesFromSupabaseRows,
} from './mapUserScopedRows';

type RemoteUserScopedTable = 'flashcards' | 'decks' | 'notes' | 'chat_history';

function applyRemoteTableRows(tableName: RemoteUserScopedTable, rows: unknown): void {
  switch (tableName) {
    case 'flashcards':
      useFlashcardStore.setState({ flashcards: flashcardsFromSupabaseRows(rows) });
      break;
    case 'decks':
      useFlashcardStore.setState({ decks: decksFromSupabaseRows(rows) });
      break;
    case 'notes':
      useSessionStore.setState({ notes: notesFromSupabaseRows(rows) });
      break;
    case 'chat_history':
      useSessionStore.setState({ chatHistory: chatHistoryFromSupabaseRows(rows) });
      break;
    default: {
      const _exhaustive: never = tableName;
      void _exhaustive;
    }
  }
}

export function applyUserProfilePayloadToStores(data: SupabaseUserProfilePayload): void {
  const prev = useUserStore.getState();
  const accessRole =
    data.role !== undefined && data.role !== null ? normalizeDbRole(data.role) : prev.accessRole;
  const billingPlan =
    data.plan !== undefined && data.plan !== null
      ? parseBillingPlanFromDb(data.plan)
      : prev.billingPlan;
  const profileCreatedAtMs =
    data.created_at !== undefined && data.created_at !== null && data.created_at !== ''
      ? new Date(data.created_at).getTime()
      : prev.profileCreatedAtMs;
  const slice = {
    name: data.name ?? prev.name,
    bio: data.bio ?? prev.bio,
    xp: data.xp ?? prev.xp,
    level: data.level ?? prev.level,
    streak: data.streak ?? prev.streak,
    longestStreak: data.longest_streak ?? prev.longestStreak,
    league: (data.league ?? prev.league) as UserStore['league'],
    dailyXP: data.daily_xp ?? prev.dailyXP,
    lastStudyDate: data.last_study_date ?? prev.lastStudyDate,
    dailyGoalMinutes: data.daily_goal_minutes ?? prev.dailyGoalMinutes,
    profilePic: data.profile_pic || prev.profilePic,
    coverPic: data.cover_pic || prev.coverPic,
    accessRole,
    billingPlan,
    profileCreatedAtMs,
  };
  useUserStore.setState(slice);
  useStore.setState(slice);
  useUIStore.getState().setPlan(billingPlan === 'premium' || billingPlan === 'pro' ? 'premium' : 'free');
}

/**
 * Garante linha em `public.users`, aplica perfil às stores, abre canais realtime e fetch inicial.
 * Retorna função que dá unsubscribe em tudo (obrigatório antes de nova sessão ou unmount).
 */
export async function startUserRemoteSync(user: User): Promise<() => void> {
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code === 'PGRST116') {
    const initialData = {
      id: user.id,
      name: user.user_metadata?.full_name || 'Estudante',
      xp: 0,
      level: 1,
      streak: 0,
      league: 'Bronze',
      daily_xp: 0,
      last_study_date: null,
      daily_goal_minutes: 120,
      plan: 'free',
      role: 'free',
      profile_pic:
        user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      cover_pic: '',
      bio: 'Focado na aprovação! 🚀',
    };
    await supabase.from('users').insert(initialData);
    applyUserProfilePayloadToStores(initialData);
  } else if (profile) {
    applyUserProfilePayloadToStores(profile as SupabaseUserProfilePayload);
  }

  const profileSubscription = supabase
    .channel(`public:users:id=eq.${user.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.id}`,
      },
      (payload) => {
        if (payload.new && typeof payload.new === 'object') {
          applyUserProfilePayloadToStores(payload.new as SupabaseUserProfilePayload);
        }
      }
    )
    .subscribe();

  const mapStudySessions = (
    rows: Array<{
      id: string;
      started_at: string;
      duration_seconds: number;
      subject?: string | null;
    }>
  ) =>
    rows.map((row) => ({
      id: row.id,
      date: calendarDayLocal(new Date(row.started_at)),
      duration: Math.max(1, Math.round(row.duration_seconds / 60)),
      subject: row.subject || 'Estudo',
    }));

  const syncUserQuestionAttempts = async () => {
    const { data, error } = await supabase
      .from('user_question_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('attempted_at', { ascending: false });
    if (error) console.error('[userRemoteSync] user_question_attempts:', error);
    if (data && data.length > 0) {
      useExamStore.setState({ history: attemptsRowsToHistory(data) });
    }

    return supabase
      .channel(`public:user_question_attempts:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_question_attempts',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const { data: updated } = await supabase
            .from('user_question_attempts')
            .select('*')
            .eq('user_id', user.id)
            .order('attempted_at', { ascending: false });
          if (updated && updated.length > 0) {
            useExamStore.setState({ history: attemptsRowsToHistory(updated) });
          }
        }
      )
      .subscribe();
  };

  const syncUserStudySessions = async () => {
    const { data, error } = await supabase
      .from('user_study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });
    if (error) console.error('[userRemoteSync] user_study_sessions:', error);
    if (data && data.length > 0) {
      useSessionStore.setState({ sessions: mapStudySessions(data) });
    }

    return supabase
      .channel(`public:user_study_sessions:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_study_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const { data: updated } = await supabase
            .from('user_study_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('started_at', { ascending: false });
          if (updated && updated.length > 0) {
            useSessionStore.setState({ sessions: mapStudySessions(updated) });
          }
        }
      )
      .subscribe();
  };

  const syncTable = async (tableName: RemoteUserScopedTable) => {
    const { data } = await supabase.from(tableName).select('*').eq('user_id', user.id);

    if (data) {
      applyRemoteTableRows(tableName, data);
    }

    return supabase
      .channel(`public:${tableName}:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const { data: updatedData } = await supabase
            .from(tableName)
            .select('*')
            .eq('user_id', user.id);
          if (updatedData) {
            applyRemoteTableRows(tableName, updatedData);
          }
        }
      )
      .subscribe();
  };

  const unsubAttempts = await syncUserQuestionAttempts();
  const unsubStudySessions = await syncUserStudySessions();
  const unsubFlashcards = await syncTable('flashcards');
  const unsubDecks = await syncTable('decks');
  const unsubNotes = await syncTable('notes');
  const unsubChat = await syncTable('chat_history');

  const unsubLeaderboard = supabase
    .channel('public:users:leaderboard')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('xp', { ascending: false })
        .limit(10);
      if (data) {
        useUserStore.setState({ leaderboard: leaderboardUsersFromSupabaseRows(data) });
      }
    })
    .subscribe();

  void supabase
    .from('users')
    .select('*')
    .order('xp', { ascending: false })
    .limit(10)
    .then(({ data }) => {
      if (data) {
        useUserStore.setState({ leaderboard: leaderboardUsersFromSupabaseRows(data) });
      }
    });

  return () => {
    profileSubscription.unsubscribe();
    unsubAttempts.unsubscribe();
    unsubStudySessions.unsubscribe();
    unsubFlashcards.unsubscribe();
    unsubDecks.unsubscribe();
    unsubNotes.unsubscribe();
    unsubChat.unsubscribe();
    unsubLeaderboard.unsubscribe();
  };
}
