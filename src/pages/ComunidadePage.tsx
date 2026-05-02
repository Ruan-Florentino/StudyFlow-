import { motion } from 'framer-motion';
import { Users, Music, BookOpen, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { SalaPage } from './SalaPage';

export const SUBJECTS = [
  { id: 'matematica',  name: 'Matemática', icon: '📐', color: '#fbbf24', glow: '251,191,36',  participants: 47 },
  { id: 'redacao',     name: 'Redação',    icon: '✍️', color: '#a78bfa', glow: '167,139,250', participants: 32 },
  { id: 'quimica',     name: 'Química',    icon: '🧪', color: '#34d399', glow: '52,211,153',  participants: 21 },
  { id: 'fisica',      name: 'Física',     icon: '⚛️', color: '#38bdf8', glow: '56,189,248',  participants: 28 },
  { id: 'biologia',    name: 'Biologia',   icon: '🧬', color: '#84cc16', glow: '132,204,22',  participants: 19 },
  { id: 'historia',    name: 'História',   icon: '📜', color: '#f59e0b', glow: '245,158,11',  participants: 24 },
  { id: 'geografia',   name: 'Geografia',  icon: '🌍', color: '#14b8a6', glow: '20,184,166',  participants: 15 },
  { id: 'filosofia',   name: 'Filosofia',  icon: '💭', color: '#818cf8', glow: '129,140,248', participants: 11 },
  { id: 'sociologia',  name: 'Sociologia', icon: '👥', color: '#f472b6', glow: '244,114,182', participants: 13 },
  { id: 'portugues',   name: 'Português',  icon: '📖', color: '#f87171', glow: '248,113,113', participants: 35 },
  { id: 'ingles',      name: 'Inglês',     icon: '🇬🇧', color: '#60a5fa', glow: '96,165,250',  participants: 22 },
  { id: 'artes',       name: 'Artes',      icon: '🎨', color: '#e879f9', glow: '232,121,249', participants: 8  },
];

export function ComunidadePage({ onBack }: { onBack: () => void }) {
  const joinRoom = useStore(state => state.joinRoom);
  const activeRoom = useStore(state => state.studyRooms?.activeRoom);
  
  if (activeRoom) {
    return <SalaPage roomId={activeRoom} onLeave={() => joinRoom(null)} />;
  }
  
  const totalPeople = SUBJECTS.reduce((sum, s) => sum + s.participants, 0);
  
  return (
    <div className="min-h-screen bg-black text-white
                    px-4 pt-8 pb-32 relative overflow-hidden">
      
      {/* Ambient */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 
                   w-96 h-96 rounded-full blur-3xl opacity-15
                   pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244,114,182,0.5) 0%, transparent 70%)',
        }}
      />
      
      <div className="relative max-w-md mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer"
              onClick={onBack}
              style={{
                background: 'linear-gradient(135deg, rgba(244,114,182,0.3), rgba(244,114,182,0.1))',
                border: '1px solid rgba(244,114,182,0.4)',
                boxShadow: '0 0 20px rgba(244,114,182,0.3)',
              }}
            >
              <Users size={22} strokeWidth={2.5} style={{ color: '#f472b6' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-pink-400">Salas de Estudo</h1>
              <p className="text-[10px] uppercase tracking-widest text-white/40">
                Estude junto com lofi
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* INFO CARD COM LOFI BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-3 mb-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(244,114,182,0.12), rgba(167,139,250,0.08))',
            border: '1px solid rgba(244,114,182,0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
                boxShadow: '0 0 16px rgba(244,114,182,0.5)',
              }}
            >
              <Music size={18} className="text-white" strokeWidth={2.5} />
            </motion.div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white/90">
                Cada sala toca lofi diferente 🎵
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">
                Foco silencioso • Apenas chat de texto
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* STATS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-2 mb-5"
        >
          <StatCard 
            icon={Users} 
            value={totalPeople} 
            label="Estudando agora" 
            color="#f472b6" 
            glow="244,114,182"
          />
          <StatCard 
            icon={BookOpen} 
            value={SUBJECTS.length} 
            label="Matérias" 
            color="#a78bfa" 
            glow="167,139,250"
          />
        </motion.div>
        
        {/* SECTION */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={12} className="text-pink-400" />
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
            Escolha uma matéria
          </span>
        </div>
        
        {/* GRID DE SALAS */}
        <div className="grid grid-cols-2 gap-3">
          {SUBJECTS.map((subject, i) => (
            <motion.button
              key={subject.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => joinRoom(subject.id)}
              className="aspect-square rounded-3xl p-4 relative overflow-hidden
                         flex flex-col items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(${subject.glow},0.18) 0%, 
                  rgba(${subject.glow},0.05) 100%)`,
                border: `1px solid rgba(${subject.glow},0.3)`,
                backdropFilter: 'blur(20px)',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.3)`,
              }}
            >
              {/* Shine top */}
              <div 
                className="absolute inset-x-3 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(${subject.glow},0.7), transparent)`,
                }}
              />
              
              {/* Glow ambiente */}
              <div 
                className="absolute -inset-2 blur-2xl opacity-30"
                style={{
                  background: `radial-gradient(circle, rgba(${subject.glow},0.4) 0%, transparent 70%)`,
                }}
              />
              
              {/* Icon */}
              <div className="relative text-4xl mb-1">
                {subject.icon}
              </div>
              
              {/* Nome */}
              <h3 
                className="relative font-bold text-sm text-center truncate max-w-full"
                style={{ 
                  color: subject.color,
                  textShadow: `0 0 10px rgba(${subject.glow},0.5)`,
                }}
              >
                {subject.name}
              </h3>
              
              {/* Pessoas */}
              <div 
                className="relative flex items-center gap-1 px-2 py-1 rounded-full"
                style={{
                  background: `rgba(${subject.glow},0.15)`,
                  border: `1px solid rgba(${subject.glow},0.25)`,
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-1 rounded-full"
                  style={{ 
                    backgroundColor: subject.color,
                    boxShadow: `0 0 4px ${subject.color}`,
                  }}
                />
                <span className="text-[10px] font-bold text-white/80">
                  {subject.participants}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color, glow }: any) {
  return (
    <div 
      className="rounded-2xl p-3 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(${glow},0.1), rgba(${glow},0.03))`,
        border: `1px solid rgba(${glow},0.2)`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} style={{ color }} />
        <span className="text-[9px] uppercase tracking-wider text-white/50">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
