import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let _supabase: any = null;

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    if (!_supabase) {
      if (!isSupabaseConfigured) {
        throw new Error(
          'Supabase configuration error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided in environment variables.'
        );
      }
      _supabase = createClient(supabaseUrl, supabaseAnonKey);
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
          created_at?: string;
        };
      };
      // We can add more table types here as we map them
    };
  };
}
