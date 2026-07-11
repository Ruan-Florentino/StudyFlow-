import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUserStore, type UserStore } from '../store/useUserStore';
import type { UserRole } from '../types/userAccess';

export interface LocalUser { id: string; email?: string; user_metadata?: { full_name?: string }; }
interface UserProfile { uid: string; email: string; displayName: string; plan: 'free' | 'pro' | 'premium'; role: UserRole; createdAt: number; }
interface AuthContextType { user: LocalUser | null; profile: UserProfile | null; loading: boolean; signIn: (email: string, pass: string) => Promise<void>; signUp: (email: string, pass: string, name: string) => Promise<void>; signInWithGoogle: () => Promise<void>; logout: () => Promise<void>; resetPassword: (email: string) => Promise<void>; }

const STORAGE_KEY = 'athena:local-user';
const AuthContext = createContext<AuthContextType | null>(null);
function readLocalUser(): LocalUser | null { try { const value = window.localStorage.getItem(STORAGE_KEY); return value ? JSON.parse(value) : null; } catch { return null; } }
function persistUser(user: LocalUser | null) { try { if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); else window.localStorage.removeItem(STORAGE_KEY); } catch { /* optional */ } }
function profileFromStore(user: LocalUser, store: UserStore): UserProfile { return { uid: user.id, email: user.email ?? '', displayName: store.name, plan: store.billingPlan, role: store.accessRole, createdAt: store.profileCreatedAtMs ?? 0 }; }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(readLocalUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => { if (!user) { setProfile(null); return; } setProfile(profileFromStore(user, useUserStore.getState())); return useUserStore.subscribe((state) => setProfile(profileFromStore(user, state))); }, [user]);
  const activate = (email = '', name = 'Estudante') => { const next: LocalUser = { id: 'local-user', email, user_metadata: { full_name: name } }; persistUser(next); setUser(next); useUserStore.getState().setName(name); };
  const signIn = async (email: string, _pass: string) => activate(email, email.split('@')[0] || 'Estudante');
  const signUp = async (email: string, _pass: string, name: string) => activate(email, name || 'Estudante');
  const signInWithGoogle = async () => activate('', 'Estudante');
  const logout = async () => { persistUser(null); setUser(null); };
  const resetPassword = async (_email: string) => { /* future identity provider */ };
  return <AuthContext.Provider value={{ user, profile, loading: false, signIn, signUp, signInWithGoogle, logout, resetPassword }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth fora do AuthProvider'); return ctx; };
