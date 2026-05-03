import { motion } from 'motion/react';
import { ArrowLeft, Users, MessageCircle, Music } from 'lucide-react';
import { LofiPlayer } from '../components/sala/LofiPlayer';
import { RoomChat } from '../components/sala/RoomChat';
import { SUBJECTS } from './ComunidadePage';
import { GlassCard } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

const PERSON_COLORS = [
  '#fbbf24', '#a78bfa', '#34d399', '#38bdf8',
  '#f472b6', '#84cc16', '#f59e0b', '#14b8a6',
];

export function SalaPage({ roomId, onLeave }: { roomId: string, onLeave: () => void }) {
  const { user } = useAuth();
  const subject = SUBJECTS.find(s => s.id === roomId) || SUBJECTS[0];
  
  return (
    <div className="absolute inset-0 z-30 bg-black text-white pb-24 overflow-y-auto custom-scrollbar">
      
      {/* Ambient glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 
                   w-[500px] h-[500px] rounded-full blur-3xl opacity-25
                   pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${subject.glow},0.6) 0%, transparent 70%)`,
        }}
      />
      
      <div className="relative max-w-md mx-auto px-4 pt-6 pb-[120px]">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-5"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onLeave}
            className="w-10 h-10 rounded-2xl flex items-center justify-center focus:outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <ArrowLeft size={18} className="text-white/80" />
          </motion.button>
          
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="text-2xl">{subject.icon}</span>
            <div className="min-w-0">
              <h1 
                className="text-base font-bold truncate"
                style={{ 
                  color: subject.color,
                  textShadow: `0 0 10px rgba(${subject.glow},0.5)`,
                }}
              >
                Sala de {subject.name}
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-white/40">
                Estudo silencioso • Lofi
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* LOFI PLAYER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5"
        >
          <LofiPlayer 
            subjectId={subject.id}
            color={subject.color}
            glow={subject.glow}
          />
        </motion.div>
        
        {/* PESSOAS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-pink-400" />
              <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
                Membros na Sala
              </span>
            </div>
            <span 
              className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10"
              style={{ color: subject.color }}
            >
              Realtime
            </span>
          </div>
          
          <GlassCard 
            className="p-5"
            style={{
              borderColor: `rgba(${subject.glow},0.2)`,
              background: `linear-gradient(180deg, rgba(${subject.glow},0.03), transparent)`,
            }}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <div className="flex -space-x-3 mb-4">
                {/* Mostra apenas o usuário atual por enquanto, simulando outros com placeholders se necessário ou apenas vazio */}
                {user && (
                   <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-sm font-bold z-10"
                    style={{
                      background: `linear-gradient(135deg, ${subject.color}, rgba(0,0,0,0.3))`,
                      color: '#fff',
                      boxShadow: `0 0 15px ${subject.color}40`,
                    }}
                  >
                    {user.user_metadata?.name?.[0] || 'U'}
                  </motion.div>
                )}
                
                <div className="w-12 h-12 rounded-full border-2 border-black bg-white/5 flex items-center justify-center text-[10px] text-white/30 backdrop-blur-sm">
                  +?
                </div>
              </div>
              <p className="text-[10px] font-premium-mono tracking-[0.2em] text-white/40 uppercase">Aguardando outros fifeiros...</p>
            </div>
          </GlassCard>
        </motion.div>
        
        {/* CHAT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={12} style={{ color: subject.color }} />
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
              Chat em Tempo Real
            </span>
          </div>
          
          <RoomChat 
            roomId={subject.id}
            color={subject.color} 
            glow={subject.glow} 
          />
        </motion.div>
      </div>
    </div>
  );
}
