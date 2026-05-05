import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: 'free' | 'pro' | 'premium';
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn:    (email: string, pass: string) => Promise<void>;
  signUp:    (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout:    () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string, emailFromSession?: string | null) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();

    if (data && !error) {
      setProfile({
        uid: data.id,
        email: emailFromSession ?? '',
        displayName: data.name,
        plan: data.plan || 'free',
        createdAt: new Date(data.created_at).getTime()
      });
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const applySession = async (session: Session | null) => {
      if (cancelled) return;
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        await fetchProfile(nextUser.id, nextUser.email);
      } else {
        setProfile(null);
      }
      if (!cancelled) setLoading(false);
    };

    // Hidrata sessão persistida antes de liberar a UI (evita flash de "deslogado" no F5).
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('[AuthContext] getSession:', error);
        }
        const session = data?.session ?? null;
        return applySession(session);
      })
      .catch((e) => {
        console.error('[AuthContext] getSession falhou:', e);
        if (!cancelled) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);
  
  const signIn = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };
  
  const signUp = async (email: string, pass: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        data: {
          full_name: name
        }
      }
    });
    if (error) throw error;
    
    if (data.user) {
      // Profile creation is typically handled in SupabaseProvider on first load,
      // or via Supabase triggers. Here we just ensure the user is set.
      setUser(data.user);
    }
  };
  
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
  };
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };
  
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };
  
  return (
    <AuthContext.Provider value={{
      user, profile, loading, 
      signIn, signUp, signInWithGoogle, 
      logout, resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fora do AuthProvider');
  return ctx;
};
