import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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
  const [user, setUser]       = useState<User | null>(auth.currentUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false); // Assume auth is ready if we are at this point, or use another hook

  // Keep it simple without independent listeners to avoid conflicts
  
  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    setUser(auth.currentUser);
  };
  
  const signUp = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, 'users', cred.user.uid), {
      // Required by firestore.rules isValidUser
      name,
      xp: 0,
      level: 1,
      // Optional fields with sensible defaults (matches FirebaseProvider fallback)
      bio: 'Focado na aprovação! 🚀',
      profilePic: '',
      streak: 0,
      league: 'Bronze',
      dailyXP: 0,
      lastStudyDate: null,
      dailyGoalMinutes: 120,
      coins: 0,
      // Extra metadata (allowed — rules don't enforce hasOnlyAllowedFields)
      uid:         cred.user.uid,
      email,
      plan:        'free',
      createdAt:   Date.now(),
    });
    setUser(cred.user);
  };
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    setUser(auth.currentUser);
  };
  
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };
  
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
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
