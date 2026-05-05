import React, { useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useStore, useUserStore } from '../store';
import { SupabaseSetupRequired } from './SupabaseSetupRequired';

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const { setUserId, setAuthReady } = useStore();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthReady(true);
      return;
    }

    // 1. Handle Initial Session (tratamento defensivo: evita rejeição silenciosa no refresh)
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('[SupabaseProvider] getSession:', error);
          setAuthReady(true);
          return;
        }
        const session = data?.session ?? null;
        if (session) {
          void handleUserSession(session.user);
        } else {
          setAuthReady(true);
        }
      })
      .catch((e) => {
        console.error('[SupabaseProvider] getSession falhou:', e);
        setAuthReady(true);
      });

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleUserSession(session.user);
      } else {
        setUserId(null);
        setAuthReady(true);
      }
    });

    const handleUserSession = async (user: any) => {
      setUserId(user.id);
      
      // Ensure user profile exists in database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Document doesn't exist, create it
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
          profile_pic:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            '',
          cover_pic: '',
          bio: 'Focado na aprovação! 🚀'
        };
        await supabase.from('users').insert(initialData);
        syncUserToStore(initialData);
      } else if (profile) {
        // Sync to store
        syncUserToStore(profile);
      }

      // 3. Set up Real-time Subscriptions
      const profileSubscription = supabase
        .channel(`public:users:id=eq.${user.id}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'users',
          filter: `id=eq.${user.id}`
        }, payload => {
          syncUserToStore(payload.new);
        })
        .subscribe();

      // Sub-collections sync
      const syncTable = async (tableName: string, storeKey: string) => {
        const { data } = await supabase
          .from(tableName)
          .select('*')
          .eq('user_id', user.id);
        
        if (data) {
          useStore.setState({ [storeKey]: data } as any);
        }

        return supabase
          .channel(`public:${tableName}:user_id=eq.${user.id}`)
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: tableName, 
            filter: `user_id=eq.${user.id}` 
          }, async () => {
            // Re-fetch all or apply delta. For simplicity, re-fetch.
            const { data: updatedData } = await supabase
              .from(tableName)
              .select('*')
              .eq('user_id', user.id);
            if (updatedData) {
              useStore.setState({ [storeKey]: updatedData } as any);
            }
          })
          .subscribe();
      };

      const unsubSessions = await syncTable('sessions', 'sessions');
      const unsubFlashcards = await syncTable('flashcards', 'flashcards');
      const unsubDecks = await syncTable('decks', 'decks');
      const unsubNotes = await syncTable('notes', 'notes');
      const unsubChat = await syncTable('chat_history', 'chatHistory');
      const unsubHistory = await syncTable('history', 'history');

      // Global Leaderboard
      const unsubLeaderboard = supabase
        .channel('public:users:leaderboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, async () => {
          const { data } = await supabase
            .from('users')
            .select('*')
            .order('xp', { ascending: false })
            .limit(10);
          if (data) {
            useStore.setState({ leaderboard: data } as any);
          }
        })
        .subscribe();

      // Initial Leaderboard Load
      supabase.from('users')
        .select('*')
        .order('xp', { ascending: false })
        .limit(10)
        .then(({ data }) => {
          if (data) useStore.setState({ leaderboard: data } as any);
        });

      setAuthReady(true);

      return () => {
        profileSubscription.unsubscribe();
        unsubSessions.unsubscribe();
        unsubFlashcards.unsubscribe();
        unsubDecks.unsubscribe();
        unsubNotes.unsubscribe();
        unsubChat.unsubscribe();
        unsubHistory.unsubscribe();
        unsubLeaderboard.unsubscribe();
      };
    };

    const syncUserToStore = (data: any) => {
      // Mesma fatia na store persistida e na agregada — senão o subscribe de useUserStore
      // ressincroniza e apaga profilePic/coverPic vindos só do useStore (bug da foto).
      const slice = {
        name: data.name,
        bio: data.bio,
        xp: data.xp,
        level: data.level,
        streak: data.streak,
        league: data.league,
        dailyXP: data.daily_xp,
        lastStudyDate: data.last_study_date,
        dailyGoalMinutes: data.daily_goal_minutes,
        profilePic: data.profile_pic ?? '',
        coverPic: data.cover_pic ?? ''
      };
      useUserStore.setState(slice);
      useStore.setState(slice);
    };

    return () => {
      subscription.unsubscribe();
    };
  }, [setUserId, setAuthReady]);

  if (!isSupabaseConfigured) {
    return <SupabaseSetupRequired />;
  }

  return <>{children}</>;
};
