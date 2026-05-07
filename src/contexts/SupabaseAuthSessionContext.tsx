import { createContext, useContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export interface SupabaseAuthSessionValue {
  session: Session | null;
  user: User | null;
  /** true após o primeiro evento do `onAuthStateChange` (inclui INITIAL_SESSION). */
  authHydrated: boolean;
}

export const SupabaseAuthSessionContext = createContext<SupabaseAuthSessionValue | null>(null);

export function useSupabaseAuthSession(): SupabaseAuthSessionValue {
  const value = useContext(SupabaseAuthSessionContext);
  if (!value) {
    throw new Error('useSupabaseAuthSession deve ser usado dentro de SupabaseProvider');
  }
  return value;
}
