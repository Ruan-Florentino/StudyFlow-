import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ROOMS } from '../../data/rooms';
import { useRoomUsers } from '../../hooks/useRoomUsers';
import { useRoomMessages } from '../../hooks/useRoomMessages';
import { usePomodoro, PomodoroMode } from '../../hooks/usePomodoro';
import { cn } from '../UI';
import { ChevronLeft, X, Play, Pause, RotateCcw, Users, MessageSquare, Target } from 'lucide-react';
import { SCENES } from './scenes';
import { AudioPlayer } from './AudioPlayer';
import { RoomTabs } from './RoomTabs';

interface RoomInteriorProps {
  roomId: string;
  onExit: () => void;
}

export const RoomInterior: React.FC<RoomInteriorProps> = ({ roomId, onExit }) => {
  const roomDef = ROOMS.find(r => r.id === roomId) || ROOMS[0];
  const Scene = SCENES[roomId] || SCENES['lofi'];
  
  const connectedUsers = useRoomUsers(roomId);
  const { messages, sendMessage } = useRoomMessages(roomId);
  const pomodoro = usePomodoro();
  
  const [activeTab, setActiveTab] = useState<'users' | 'chat' | 'goals'>('users');
  const Icon = roomDef.icon;

  // ESC key listener for escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onExit]);

  return (
    <div className="flex-1 flex flex-col relative bg-black overflow-hidden font-sans">
      {/* 1. BACKGROUND SCENE */}
      <div className="absolute inset-0 z-0">
        <Scene />
        {/* Overlay para legibilidade */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* 2. HEADER - Sticky & Robust */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">
        <button 
          onClick={onExit} 
          className="group flex items-center gap-2 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} className="text-white/70 group-hover:text-white" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white pr-2 hidden sm:block">Sair</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-sm font-premium-title italic text-white drop-shadow-lg">
            {roomDef.name}
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] drop-shadow">
              {connectedUsers.length} ONLINE
            </span>
          </div>
        </div>

        <button 
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 flex items-center justify-center transition-all active:scale-95"
          aria-label="Sair da sala"
        >
          <X size={18} />
        </button>
      </header>

      {/* 3. CENTER CONTENT (Timer & Quote) */}
      <main className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pt-24 pb-[320px] px-6">
        <div className="flex flex-col items-center">
          {/* Room Icon Floating */}
          <motion.div 
            animate={{ y: [0, -12, 0], scale: [1, 1.05, 1] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-10 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative"
            style={{ color: roomDef.color.primary }}
          >
            <div className="absolute inset-0 bg-current opacity-10 blur-2xl rounded-full" />
            <Icon size={56} strokeWidth={1.5} className="relative z-10" />
          </motion.div>

          {/* The Big Timer Card */}
          <div className="mb-12 space-y-6 w-full max-w-sm">
            <div className="relative block px-6 py-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               {/* Mode Selector */}
              <div className="flex items-center justify-center gap-1 mb-6">
                 {(['foco', 'curta', 'longa'] as PomodoroMode[]).map(m => (
                   <button 
                     key={m}
                     onClick={() => pomodoro.changeMode(m)}
                     className={cn(
                       "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                       pomodoro.mode === m 
                         ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                         : "text-white/40 hover:text-white/70 bg-white/5"
                     )}
                   >
                     {m === 'foco' ? 'Foco' : m === 'curta' ? 'Curta' : 'Longa'}
                   </button>
                 ))}
              </div>

              <div className="text-[72px] font-premium-mono tracking-tighter text-white leading-none text-center">
                {pomodoro.formattedTime()}
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "text-[9px] font-bold text-center uppercase tracking-[0.5em] mt-6 h-4 transition-colors duration-500",
                  pomodoro.isActive ? "text-emerald-500" : "text-white/30"
                )}
              >
                {pomodoro.isActive ? 'Em Sincronia' : 'Foco em Pausa'}
              </motion.p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={pomodoro.toggle} 
                className={cn(
                  "h-14 flex-1 rounded-2xl font-bold uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3",
                  pomodoro.isActive ? "bg-white/10 text-white border border-white/10" : "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                )}
              >
                {pomodoro.isActive ? (
                  <><Pause size={20} fill="currentColor" /> Pausar</>
                ) : (
                  <><Play size={20} fill="currentColor" /> Iniciar</>
                )}
              </button>
              <button 
                onClick={pomodoro.reset}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:scale-95 transition-all hover:bg-white/10"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* Quote Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xs px-6"
          >
            <p className="text-sm font-medium text-white/40 italic leading-relaxed tracking-tight text-center">
              "{roomDef.quote}"
            </p>
          </motion.div>

          {/* ROOM TABS ARE NOW INSIDE SCROLLABLE AREA TO PREVENT OVERLAP */}
          <div className="w-full mt-16 rounded-[32px] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-xl">
             <RoomTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                users={connectedUsers}
                messages={messages}
                sendMessage={sendMessage}
                accentColor={roomDef.color.primary}
              />
          </div>
        </div>
      </main>

      {/* 4. ROOM AUDIO PLAYER (Fixed above nav) */}
      <AudioPlayer 
        audioUrl={roomDef.audio} 
        fallbackAudio={roomDef.fallbackAudio}
        defaultVolume={roomDef.defaultVolume} 
        roomName={roomDef.name} 
      />
    </div>
  );
};

