import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

// Streams de lofi públicos
const LOFI_STREAMS: Record<string, string> = {
  matematica: 'https://stream.zeno.fm/0r0xa792kwzuv',
  redacao:    'https://stream.zeno.fm/f3wvbbqmdg8uv',
  quimica:    'https://stream.zeno.fm/fyn8eh3h5f8uv',
  fisica:     'https://stream.zeno.fm/0r0xa792kwzuv',
  biologia:   'https://stream.zeno.fm/f3wvbbqmdg8uv',
  historia:   'https://stream.zeno.fm/fyn8eh3h5f8uv',
  geografia:  'https://stream.zeno.fm/0r0xa792kwzuv',
  filosofia:  'https://stream.zeno.fm/f3wvbbqmdg8uv',
  sociologia: 'https://stream.zeno.fm/fyn8eh3h5f8uv',
  portugues:  'https://stream.zeno.fm/0r0xa792kwzuv',
  ingles:     'https://stream.zeno.fm/f3wvbbqmdg8uv',
  artes:      'https://stream.zeno.fm/fyn8eh3h5f8uv',
};

interface LofiPlayerProps {
  subjectId: string;
  color: string;
  glow: string;
}

export function LofiPlayer({ subjectId, color, glow }: LofiPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  
  const streamUrl = LOFI_STREAMS[subjectId] || LOFI_STREAMS.matematica;
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn('Lofi play failed:', err);
    }
  };
  
  return (
    <>
      <audio 
        ref={audioRef} 
        src={streamUrl} 
        preload="none"
        crossOrigin="anonymous"
      />
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-3 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(${glow},0.15), rgba(${glow},0.05))`,
          border: `1px solid rgba(${glow},0.3)`,
          backdropFilter: 'blur(20px)',
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.3)`,
        }}
      >
        <div 
          className="absolute inset-x-3 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${glow},0.7), transparent)`,
          }}
        />
        
        <div className="flex items-center gap-3">
          {/* Disco girando */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 4, repeat: Infinity, ease: 'linear' } : {}}
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 relative"
            style={{
              background: `linear-gradient(135deg, ${color}, rgba(${glow},0.6))`,
              boxShadow: isPlaying 
                ? `0 0 16px rgba(${glow},0.6)` 
                : `0 0 8px rgba(${glow},0.3)`,
            }}
          >
            <Music size={18} className="text-white" strokeWidth={2.5} />
            {/* Buraco do disco */}
            <div className="absolute w-2 h-2 rounded-full bg-black" />
          </motion.div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color }}>
              Lofi Stream
            </p>
            <p className="text-[10px] text-white/50 truncate">
              {isPlaying ? '🎵 Tocando agora' : 'Pausado'}
            </p>
            
            {/* Waveform animado */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-2 mt-1">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{
                      height: ['30%', '100%', '30%'],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Volume */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowVolume(!showVolume)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {isMuted ? (
              <VolumeX size={16} className="text-white/60" />
            ) : (
              <Volume2 size={16} style={{ color }} />
            )}
          </motion.button>
          
          {/* Play/Pause */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(${glow},0.4), rgba(${glow},0.2))`,
              border: `1px solid rgba(${glow},0.5)`,
              boxShadow: `0 0 16px rgba(${glow},0.4)`,
            }}
          >
            {isPlaying ? (
              <Pause size={18} style={{ color }} strokeWidth={2.5} fill={color} />
            ) : (
              <Play size={18} style={{ color }} strokeWidth={2.5} fill={color} />
            )}
          </motion.button>
        </div>
        
        {/* Volume slider */}
        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? (
                    <VolumeX size={14} className="text-white/50" />
                  ) : (
                    <Volume2 size={14} style={{ color }} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, ${color} 0%, ${color} ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
                <span className="text-[10px] font-bold text-white/60 w-7 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
