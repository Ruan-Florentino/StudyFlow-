import React, { useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExamTimerProps {
  seconds: number;
  onTimeUp: () => void;
  isUrgent?: boolean; // If less than 5 mins
}

export const ExamTimer = ({ seconds, onTimeUp }: ExamTimerProps) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const isUrgent = seconds < 300; // 5 minutes

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
    }
  }, [seconds, onTimeUp]);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-colors ${
      isUrgent 
        ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 animate-pulse' 
        : 'bg-white/5 border-white/10 text-white'
    }`}>
      <Timer size={16} className={isUrgent ? 'animate-bounce' : ''} />
      <span className="font-premium-mono font-bold tracking-widest text-sm">
        {formatTime(minutes)}:{formatTime(remainingSeconds)}
      </span>
      {isUrgent && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:block"
          >
            <AlertCircle size={14} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ExamTimer;
