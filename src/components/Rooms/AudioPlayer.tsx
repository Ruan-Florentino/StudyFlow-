import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Loader2, AlertCircle } from 'lucide-react';
import { useRoomAudio } from '../../hooks/useRoomAudio';

interface AudioPlayerProps {
  audioUrl?: string;
  fallbackAudio?: string;
  defaultVolume?: number;
  roomName: string;
}

export const AudioPlayer = ({ audioUrl, fallbackAudio, defaultVolume = 0.5, roomName }: AudioPlayerProps) => {
  const {
    state,
    volume,
    isMuted,
    play,
    toggle,
    toggleMute,
    setVolume
  } = useRoomAudio(audioUrl, fallbackAudio, defaultVolume, roomName);

  const volumePercent = Math.round((isMuted ? 0 : volume) * 100);

  return (
    <div className="fixed bottom-[96px] left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-black/90 backdrop-blur-3xl border border-white/10 p-4 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button 
            onClick={toggle}
            disabled={state === 'loading'}
            className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {state === 'loading' ? (
              <Loader2 size={20} className="animate-spin" />
            ) : state === 'playing' ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" className="ml-1" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 overflow-hidden">
                {state === 'playing' && (
                  <div className="flex gap-0.5 items-end h-3 shrink-0">
                    <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-emerald-500 rounded-full" />
                    <motion.div animate={{ height: [7, 3, 7] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-emerald-500 rounded-full" />
                    <motion.div animate={{ height: [2, 8, 2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-emerald-500 rounded-full" />
                  </div>
                )}
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest truncate">
                  {state === 'error' ? 'Falha no áudio' : state === 'loading' ? 'Carregando...' : `${roomName} Ambient`}
                </p>
              </div>
              
              {state === 'error' && (
                <button onClick={play} className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                  <AlertCircle size={10} /> Recarregar
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleMute} 
                className="text-white/40 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              
              <div className="flex-1 h-1.5 bg-white/10 rounded-full relative group cursor-pointer border border-white/5 overflow-hidden">
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                />
                <motion.div 
                  initial={false}
                  animate={{ width: `${volumePercent}%` }}
                  className="absolute inset-y-0 left-0 bg-emerald-500 z-10" 
                />
                {/* Thumb Visual indicator */}
                <motion.div 
                  initial={false}
                  animate={{ left: `${volumePercent}%` }}
                  className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 bg-white rounded-full shadow-lg z-30"
                />
              </div>
              
              <span className="text-[10px] font-mono text-white/30 w-8 text-right tabular-nums">
                {volumePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

