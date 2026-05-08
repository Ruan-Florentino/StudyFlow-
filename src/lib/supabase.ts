import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Safari (modo privado / ITP agressivo) pode bloquear ou lançar em `localStorage`.
 * Sem adapter, `createClient` quebra e a app fica branca — Chrome in-app costuma ser mais permissivo.
 */
function createAuthPersistStorage(): Storage {
  try {
    const probeKey = '__sf_auth_ls_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return window.localStorage;
  } catch {
    const memory = new Map<string, string>();
    return {
      get length() {
        return memory.size;
      },
      clear: () => {
        memory.clear();
      },
      getItem: (key: string) => memory.get(key) ?? null,
      key: (index: number) => Array.from(memory.keys())[index] ?? null,
      removeItem: (key: string) => {
        memory.delete(key);
      },
      setItem: (key: string, value: string) => {
        memory.set(key, value);
      },
    } as Storage;
  }
}

let _supabase: any = null;

const createMockClient = () => {
  const unimplemented = () => {
    console.warn("Supabase is not configured. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use this feature.");
  };
  
  const mockErr = new Error("Supabase não configurado.");
  const mockPromise = async () => ({ data: null, error: mockErr });
  // Formato alinhado ao @supabase/supabase-js para não quebrar destructuring ({ data: { session } }).
  const mockGetSession = async () => ({
    data: { session: null as null },
    error: null as null,
  });

  return {
    auth: {
      signInWithOAuth: mockPromise,
      signOut: async () => ({ error: null as null }),
      getSession: mockGetSession,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: mockPromise
          })
        })
      }),
      insert: mockPromise,
      update: () => ({ eq: mockPromise })
    }),
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      unsubscribe: () => {}
    }),
    removeChannel: unimplemented,
    storage: {
      from: () => ({
        upload: mockPromise,
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  } as any;
};

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    if (!_supabase) {
      if (!isSupabaseConfigured) {
        _supabase = createMockClient();
      } else {
        _supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: createAuthPersistStorage(),
            storageKey: 'studioflow-auth',
          },
        });
      }
    }
    return _supabase[prop];
  }
});

// Auth Helpers
export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error('Login Error:', error);
    throw error;
  }
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};

// Types for our database
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          profile_pic: string | null;
          xp: number;
          level: number;
          streak: number;
          league: string;
          daily_xp: number;
          last_study_date: string | null;
          daily_goal_minutes: number;
          coins: number;
          longest_streak?: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          bio?: string | null;
          profile_pic?: string | null;
          xp?: number;
          level?: number;
          streak?: number;
          league?: string;
          daily_xp?: number;
          last_study_date?: string | null;
          daily_goal_minutes?: number;
          coins?: number;
          longest_streak?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string | null;
          profile_pic?: string | null;
          xp?: number;
          level?: number;
          streak?: number;
          league?: string;
          daily_xp?: number;
          last_study_date?: string | null;
          daily_goal_minutes?: number;
          coins?: number;
          longest_streak?: number;
          created_at?: string;
        };
      };
      user_question_attempts: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          answer_given: number;
          is_correct: boolean;
          time_spent_seconds: number;
          attempted_at: string;
          subject: string | null;
          topic: string | null;
          exam_source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          answer_given: number;
          is_correct: boolean;
          time_spent_seconds?: number;
          attempted_at?: string;
          subject?: string | null;
          topic?: string | null;
          exam_source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          answer_given?: number;
          is_correct?: boolean;
          time_spent_seconds?: number;
          attempted_at?: string;
          subject?: string | null;
          topic?: string | null;
          exam_source?: string | null;
          created_at?: string;
        };
      };
      user_study_sessions: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          ended_at: string;
          duration_seconds: number;
          activity_type: string;
          subject: string | null;
          topic: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          started_at: string;
          ended_at: string;
          duration_seconds: number;
          activity_type: string;
          subject?: string | null;
          topic?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          started_at?: string;
          ended_at?: string;
          duration_seconds?: number;
          activity_type?: string;
          subject?: string | null;
          topic?: string | null;
          created_at?: string;
        };
      };
      // We can add more table types here as we map them
    };
  };
}
