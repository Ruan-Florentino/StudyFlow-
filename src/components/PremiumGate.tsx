import React, { useState } from 'react';
import { usePlan } from '../store/useStore';
import { PaywallModal } from './PaywallModal';

export const PremiumGate = ({ 
  feature, 
  children, 
  fallback 
}: { 
  feature: 'flashcards' | 'aiTutor' | 'essay' | 'exams' | 'streakProtector'; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) => {
  const { checkLimit } = usePlan();
  const [showPaywall, setShowPaywall] = useState(false);

  const hasAccess = checkLimit(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <>
      <div onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPaywall(true);
      }}>
        {fallback || (
          <div className="opacity-50 pointer-events-none relative overflow-hidden">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-primary font-bold border border-primary/20 pointer-events-auto">
                Recurso Premium
              </div>
            </div>
            {children}
          </div>
        )}
      </div>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} feature={feature} />}
    </>
  );
};
