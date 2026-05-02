import { motion } from 'framer-motion';
import { ArrowLeft, Users, MessageCircle } from 'lucide-react';
import { LofiPlayer } from '../components/sala/LofiPlayer';
import { RoomChat } from '../components/sala/RoomChat';
import { SUBJECTS } from './ComunidadePage';

const MOCK_PEOPLE = [
  'Marina', 'João', 'Ana', 'Pedro', 'Sofia', 'Carlos',
  'Julia', 'Lucas', 'Beatriz', 'Rafael', 'Camila', 'Bruno',
];

const PERSON_COLORS = [
  '#fbbf24', '#a78bfa', '#34d399', '#38bdf8',
  '#f472b6', '#84cc16', '#f59e0b', '#14b8a6',
];

export function SalaPage({ roomId, onLeave }: { roomId: string, onLeave: () => void }) {
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
              <Users size={12} style={{ color: subject.color }} />
              <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
                Estudando agora
              </span>
            </div>
            <span 
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: `rgba(${subject.glow},0.15)`,
                color: subject.color,
                border: `1px solid rgba(${subject.glow},0.3)`,
              }}
            >
              {subject.participants}
            </span>
          </div>
          
          <div 
            className="rounded-3xl p-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(180deg, rgba(${subject.glow},0.08), rgba(${subject.glow},0.02))`,
              border: `1px solid rgba(${subject.glow},0.2)`,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div 
              className="absolute inset-x-4 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(${subject.glow},0.6), transparent)`,
              }}
            />
            
            <div className="grid grid-cols-6 gap-2">
              {MOCK_PEOPLE.map((name, i) => {
                const personColor = PERSON_COLORS[i % PERSON_COLORS.length];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${personColor}, rgba(0,0,0,0.3))`,
                        color: '#fff',
                        boxShadow: `0 0 8px ${personColor}40`,
                        border: `1px solid ${personColor}50`,
                      }}
                    >
                      {name.charAt(0)}
                    </div>
                    <span className="text-[8px] text-white/50 truncate max-w-[40px]">
                      {name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            
            {subject.participants > MOCK_PEOPLE.length && (
              <p className="text-[10px] text-white/40 text-center mt-3">
                +{subject.participants - MOCK_PEOPLE.length} pessoas estudando
              </p>
            )}
          </div>
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
              Chat
            </span>
          </div>
          
          <RoomChat 
            color={subject.color} 
            glow={subject.glow} 
          />
        </motion.div>
      </div>
    </div>
  );
}
