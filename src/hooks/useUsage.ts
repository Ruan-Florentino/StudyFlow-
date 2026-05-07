import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/useUserStore';

const PLAN_LIMITS = {
  free:    5,
  pro:     200,
  premium: 1000,
};

export function useUsage() {
  const { user } = useAuth();
  const billingPlan = useUserStore((s) => s.billingPlan);
  const [used, setUsed] = useState(0);
  
  useEffect(() => {
    if (!user) return;
    
    const today = new Date().toISOString().slice(0, 10);
    const id = `${user.id}_${today}`;

    // Initial load
    supabase
      .from('usage')
      .select('count')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) setUsed(data.count);
      });
    
    const subscription = supabase
      .channel(`public:usage:id=eq.${id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'usage', 
        filter: `id=eq.${id}` 
      }, payload => {
        setUsed(payload.new.count || 0);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  const plan = billingPlan || 'free';
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
