import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const PLAN_LIMITS = {
  free:    5,
  pro:     200,
  premium: 1000,
};

export function useUsage() {
  const { user, profile } = useAuth();
  const [used, setUsed] = useState(0);
  
  useEffect(() => {
    if (!user) return;
    
    const today = new Date().toISOString().slice(0, 10);
    const ref   = doc(db, 'usage', `${user.uid}_${today}`);
    
    const unsub = onSnapshot(ref, (snap) => {
      setUsed(snap.data()?.count || 0);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `usage/${user.uid}_${today}`);
    });
    
    return () => unsub();
  }, [user]);
  
  const plan  = profile?.plan || 'free';
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  
  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    percentage: (used / limit) * 100,
    plan,
    isExhausted: used >= limit,
  };
}
