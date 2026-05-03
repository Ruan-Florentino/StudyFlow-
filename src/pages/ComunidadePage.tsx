import { motion, AnimatePresence } from 'motion/react';
import { Users, Music, BookOpen, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { SalaPage } from './SalaPage';
import { useState } from 'react';

export const SUBJECTS = [
  { id: 'matematica',  name: 'Matemática', icon: '📐', color: '#fbbf24', glow: '251,191,36' },
  { id: 'redacao',     name: 'Redação',    icon: '✍️', color: '#a78bfa', glow: '167,139,250' },
  { id: 'quimica',     name: 'Química',    icon: '🧪', color: '#34d399', glow: '52,211,153' },
  { id: 'fisica',      name: 'Física',     icon: '⚛️', color: '#38bdf8', glow: '56,189,248' },
  { id: 'biologia',    name: 'Biologia',   icon: '🧬', color: '#84cc16', glow: '132,204,22' },
  { id: 'historia',    name: 'História',   icon: '📜', color: '#f59e0b', glow: '245,158,11' },
  { id: 'geografia',   name: 'Geografia',  icon: '🌍', color: '#14b8a6', glow: '20,184,166' },
  { id: 'filosofia',   name: 'Filosofia',  icon: '💭', color: '#818cf8', glow: '129,140,248' },
  { id: 'sociologia',  name: 'Sociologia', icon: '👥', color: '#f472b6', glow: '244,114,182' },
  { id: 'portugues',   name: 'Português',  icon: '📖', color: '#f87171', glow: '248,113,113' },
  { id: 'ingles',      name: 'Inglês',     icon: '🇬🇧', color: '#60a5fa', glow: '96,165,250' },
  { id: 'artes',       name: 'Artes',      icon: '🎨', color: '#e879f9', glow: '232,121,249' },
];

export function ComunidadePage({ onBack }: { onBack: () => void }) {
  const joinRoom = useStore(state => state.joinRoom);
  const activeRoom = useStore(state => state.studyRooms?.activeRoom);
  
  if (activeRoom) {
    return <SalaPage roomId={activeRoom} onLeave={() => joinRoom(null)} />;
  }
  
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
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer bg-white/5 border border-white/10"
                onClick={onBack}
              >
                <Users size={20} className="text-pink-400" />
              </div>
              <div>
                <h1 className="font-premium-title italic text-xl uppercase tracking-tight">Comunidade<span className="text-pink-500 not-italic ml-0.5">.</span></h1>
                <p className="text-[10px] font-premium-mono tracking-widest text-white/40 uppercase">Estude em Grupo & Lofi</p>
              </div>
           </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* INFO CARD COM LOFI BADGE */}
          <div
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
                  Cada sala toca um lofi diferente 🎵
                </p>
                <p className="text-[10px] text-white/50 mt-0.5">
                  Foco absoluto • Chat em tempo real
                </p>
              </div>
            </div>
          </div>
          
          {/* STATS */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <StatCard 
              icon={Users} 
              value="Ativo" 
              label="Sincronia" 
              color="#f472b6" 
              glow="244,114,182"
            />
            <StatCard 
              icon={BookOpen} 
              value={SUBJECTS.length} 
              label="Salas de Matéria" 
              color="#a78bfa" 
              glow="167,139,250"
            />
          </div>
          
          {/* SECTION */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-pink-400" />
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
              Selecione uma sala de estudos
            </span>
          </div>
          
          {/* GRID DE SALAS */}
          <div className="grid grid-cols-2 gap-3 pb-20">
            {SUBJECTS.map((subject, i) => (
              <motion.button
                key={subject.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => joinRoom(subject.id)}
                className="aspect-square rounded-3xl p-4 relative overflow-hidden
                           flex flex-col items-center justify-center gap-2 group"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(${subject.glow},0.18) 0%, 
                    rgba(${subject.glow},0.05) 100%)`,
                  border: `1px solid rgba(${subject.glow},0.3)`,
                  backdropFilter: 'blur(20px)',
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.3)`,
                }}
              >
                {/* Glow ambiental no hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, rgba(${subject.glow},0.8) 0%, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div className="relative text-4xl mb-1 transform group-hover:scale-110 transition-transform duration-300">
                  {subject.icon}
                </div>
                
                {/* Nome */}
                <h3 
                  className="relative font-bold text-sm text-center truncate max-w-full text-white/90"
                >
                  {subject.name}
                </h3>
                
                {/* Status */}
                <div 
                  className="relative flex items-center gap-1 px-2 py-1 rounded-full bg-black/20 border border-white/5"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_rgba(244,114,182,1)]"
                  />
                  <span className="text-[10px] font-bold text-white/60">
                    Online
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
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
