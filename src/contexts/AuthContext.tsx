import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useSupabaseAuthSession } from './SupabaseAuthSessionContext';
import { useUserStore, type UserStore } from '../store/useUserStore';
import type { UserRole } from '../types/userAccess';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: 'free' | 'pro' | 'premium';
  /** Papel de acesso (FASE-1). Coluna `public.users.role`. */
  role: UserRole;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function pickAuthProfileFields(s: UserStore) {
  return {
    name: s.name,
    accessRole: s.accessRole,
    billingPlan: s.billingPlan,
    profileCreatedAtMs: s.profileCreatedAtMs,
  };
}

function sessionUserToProfile(user: User, store: UserStore): UserProfile {
  return {
    uid: user.id,
    email: user.email ?? '',
    displayName: store.name,
    plan: store.billingPlan,
    role: store.accessRole,
    createdAt: store.profileCreatedAtMs ?? 0,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, authHydrated } = useSupabaseAuthSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const userRef = useRef<User | null>(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    let lastAuthFields = pickAuthProfileFields(useUserStore.getState());

    const pushProfile = () => {
      if (cancelled) return;
      const u = userRef.current;
      if (!u) {
        setProfile(null);
        return;
      }
      setProfile(sessionUserToProfile(u, useUserStore.getState()));
    };

    const unsubStore = useUserStore.subscribe((state) => {
      if (!userRef.current || cancelled) return;
      const next = pickAuthProfileFields(state);
      if (
        next.name === lastAuthFields.name &&
        next.accessRole === lastAuthFields.accessRole &&
        next.billingPlan === lastAuthFields.billingPlan &&
        next.profileCreatedAtMs === lastAuthFields.profileCreatedAtMs
      ) {
        return;
      }
      lastAuthFields = next;
      pushProfile();
    });

    lastAuthFields = pickAuthProfileFields(useUserStore.getState());
    pushProfile();

    return () => {
      cancelled = true;
      unsubStore();
    };
  }, [user]);

  const loading = !authHydrated;

  const signIn = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const signUp = async (email: string, pass: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fora do AuthProvider');
  return ctx;
};
