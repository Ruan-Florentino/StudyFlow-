import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/animations/easings';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  ChevronDown,
  ChevronUp,
  SkipForward,
  SkipBack,
  Shuffle,
} from 'lucide-react';
import {
  SALA_AUDIO_STATIONS,
  SALA_STATION_MOOD_LABEL,
  defaultStationIndexForSubject,
  salaStationsByMood,
  stationById,
  type SalaAudioStation,
  type SalaStationMood,
} from '../../data/salaAudio';

const STORAGE_PREFIX = 'studyflow:sala-audio:';

function salaReadStored(subjectId: string): string | null {
  try {
    return sessionStorage.getItem(`${STORAGE_PREFIX}${subjectId}`);
  } catch {
    return null;
  }
}

function salaWriteStored(subjectId: string, stationId: string): void {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${subjectId}`, stationId);
  } catch {
    /* Safari modo privado / quota */
  }
}

function isSafariSafeStation(stationId: string): boolean {
  return stationId.startsWith('local-');
}

interface LofiPlayerProps {
  subjectId: string;
  color: string;
  glow: string;
}

export function LofiPlayer({ subjectId, color, glow }: LofiPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(() => {
    const saved = salaReadStored(subjectId);
    if (saved && isSafariSafeStation(saved) && stationById(saved)) return saved;
    return SALA_AUDIO_STATIONS[defaultStationIndexForSubject(subjectId)].id;
  });

  const byMood = useMemo(() => salaStationsByMood(), []);
  const moods: SalaStationMood[] = ['lofi', 'ambiente', 'ritmo', 'jazz'];
  const [moodFilter, setMoodFilter] = useState<SalaStationMood | 'all'>('all');
  const reduceMotion = useReducedMotion() ?? false;

  const activeStation = stationById(selectedId) ?? SALA_AUDIO_STATIONS[0];
  const playIntentRef = useRef(false);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    playIntentRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    volumeRef.current = volume;
    isMutedRef.current = isMuted;
  }, [volume, isMuted]);

  const applyGain = useCallback((el: HTMLAudioElement) => {
    el.defaultMuted = false;
    el.muted = false;
    const v = isMutedRef.current ? 0 : volumeRef.current;
    el.volume = Math.min(1, Math.max(0, v));
  }, []);

  useEffect(() => {
    const saved = salaReadStored(subjectId);
    if (saved && isSafariSafeStation(saved) && stationById(saved)) {
      setSelectedId(saved);
    } else {
      setSelectedId(SALA_AUDIO_STATIONS[defaultStationIndexForSubject(subjectId)].id);
    }
  }, [subjectId]);

  useEffect(() => {
    salaWriteStored(subjectId, selectedId);
  }, [subjectId, selectedId]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const shouldPlay = playIntentRef.current;
    el.pause();
    applyGain(el);
    el.src = activeStation.url;
    el.load();
    if (shouldPlay) {
      applyGain(el);
      void el
        .play()
        .then(() => {
          applyGain(el);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('[sala-audio] play() falhou', activeStation.url, err);
          setIsPlaying(false);
        });
    }
  }, [activeStation.url, applyGain]);

  useEffect(() => {
    if (audioRef.current) {
      applyGain(audioRef.current);
    }
  }, [applyGain, volume, isMuted]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (isPlaying) {
        el.pause();
        setIsPlaying(false);
        return;
      }
      if (!el.src || el.src === window.location.href) {
        el.src = activeStation.url;
        el.load();
      }
      applyGain(el);
      await el.play();
      applyGain(el);
      setIsPlaying(true);
    } catch (err) {
      console.warn('[sala-audio] togglePlay falhou', activeStation.url, err);
      const fallbackStation = SALA_AUDIO_STATIONS[defaultStationIndexForSubject(subjectId)];
      if (selectedId !== fallbackStation.id) {
        setSelectedId(fallbackStation.id);
        el.src = fallbackStation.url;
        el.load();
        try {
          applyGain(el);
          await el.play();
          applyGain(el);
          setIsPlaying(true);
          return;
        } catch (fallbackErr) {
          console.warn('[sala-audio] fallback falhou', fallbackStation.url, fallbackErr);
        }
      }
      setIsPlaying(false);
    }
  };

  const stationIndex = useMemo(
    () => SALA_AUDIO_STATIONS.findIndex((s) => s.id === selectedId),
    [selectedId]
  );

  const goStation = useCallback(
    (delta: number) => {
      const list =
        moodFilter === 'all'
          ? SALA_AUDIO_STATIONS
          : byMood[moodFilter];
      if (list.length === 0) return;
      const curInList = list.findIndex((s) => s.id === selectedId);
      const base = curInList >= 0 ? curInList : 0;
      const next = (base + delta + list.length) % list.length;
      setSelectedId(list[next].id);
    },
    [byMood, moodFilter, selectedId]
  );

  const shuffleStation = useCallback(() => {
    const list =
      moodFilter === 'all' ? SALA_AUDIO_STATIONS : byMood[moodFilter];
    const pool = list.filter((s) => s.id !== selectedId);
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSelectedId(pick.id);
  }, [byMood, moodFilter, selectedId]);

  const visibleStations: SalaAudioStation[] =
    moodFilter === 'all' ? SALA_AUDIO_STATIONS : byMood[moodFilter];

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        onError={(e) => console.warn('[sala-audio] erro no <audio>', activeStation.url, e)}
      />

      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0.12 } : springs.card}
        className="rounded-3xl p-4 relative overflow-hidden border border-[rgba(var(--hub-primary-rgb),0.2)]"
        style={{
          background: `linear-gradient(145deg, rgba(var(--hub-primary-rgb),0.1), rgba(0,0,0,0.45))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 40px rgba(0,0,0,0.45)`,
        }}
      >
        <div
          className="absolute inset-x-4 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(var(--hub-primary-rgb),0.85), transparent)`,
          }}
        />

        <div className="flex items-start gap-3">
          <motion.div
            animate={
              !reduceMotion && isPlaying ? { rotate: 360 } : { rotate: 0 }
            }
            transition={
              !reduceMotion && isPlaying
                ? { duration: 5, repeat: Infinity, ease: 'linear' }
                : { duration: 0 }
            }
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative border border-[rgba(var(--hub-primary-rgb),0.35)]"
            style={{
              background: `linear-gradient(145deg, rgba(var(--hub-primary-rgb),0.45), rgba(${glow},0.35))`,
              boxShadow: isPlaying
                ? `0 0 20px rgba(var(--hub-primary-rgb),0.4), 0 0 12px rgba(${glow},0.2)`
                : `0 0 10px rgba(var(--hub-primary-rgb),0.2)`,
            }}
          >
            <Music size={22} className="text-white" strokeWidth={2.2} />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                Som ambiente
              </p>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/35 border border-[rgba(var(--hub-primary-rgb),0.25)] text-white/70"
              >
                {SALA_STATION_MOOD_LABEL[activeStation.mood]}
              </span>
            </div>
            <p className="text-sm font-bold text-white mt-1 truncate" style={{ color }}>
              {activeStation.label}
            </p>
            <p className="text-[11px] text-white/50 leading-snug mt-0.5 line-clamp-2">
              {activeStation.tagline}
            </p>

            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3 mt-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 rounded-full bg-white/80"
                    style={{ backgroundColor: color }}
                    animate={
                      reduceMotion
                        ? { height: '65%' }
                        : { height: ['25%', '100%', '25%'] }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 0.75,
                            repeat: Infinity,
                            delay: i * 0.08,
                          }
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94, transition: springs.snappy }}
            onClick={() => goStation(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Estação anterior"
          >
            <SkipBack size={18} />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.94, transition: springs.snappy }}
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(145deg, rgba(var(--hub-primary-rgb),0.45), rgba(var(--hub-primary-rgb),0.15))`,
              border: `1px solid rgba(var(--hub-primary-rgb),0.5)`,
              boxShadow: `0 0 20px rgba(var(--hub-primary-rgb),0.28)`,
            }}
            aria-label={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? (
              <Pause size={22} style={{ color }} strokeWidth={2.5} fill={color} />
            ) : (
              <Play size={22} style={{ color }} strokeWidth={2.5} fill={color} />
            )}
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.94, transition: springs.snappy }}
            onClick={() => goStation(1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Próxima estação"
          >
            <SkipForward size={18} />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.94, transition: springs.snappy }}
            onClick={shuffleStation}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Aleatório"
          >
            <Shuffle size={18} />
          </motion.button>

          <div className="flex-1 min-w-[4rem]" />

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowVolume(!showVolume)}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
            aria-label="Volume"
          >
            {isMuted ? (
              <VolumeX size={18} className="text-white/55" />
            ) : (
              <Volume2 size={18} style={{ color }} />
            )}
          </motion.button>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.98, transition: springs.snappy }}
          onClick={() => setShowLibrary(!showLibrary)}
          className="w-full mt-3 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/55 hover:text-white/85 bg-black/25 border border-white/10 transition-colors"
        >
          {showLibrary ? (
            <>
              <ChevronUp size={16} /> Fechar biblioteca
            </>
          ) : (
            <>
              <ChevronDown size={16} /> Biblioteca · {SALA_AUDIO_STATIONS.length} estações
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={reduceMotion ? { duration: 0.12 } : springs.card}
              className="mt-3 pt-3 border-t border-white/10 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 rounded-lg hover:bg-white/10"
                >
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
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                  style={{
                    background: `linear-gradient(90deg, ${color} 0%, ${color} ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.12) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.12) 100%)`,
                  }}
                />
                <span className="text-[10px] font-bold text-white/55 w-8 text-right tabular-nums">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLibrary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={reduceMotion ? { duration: 0.12 } : springs.card}
              className="mt-3 border-t border-white/10 pt-3 space-y-3 overflow-hidden"
            >
              <div className="flex gap-1.5 flex-wrap">
                <FilterChip
                  active={moodFilter === 'all'}
                  onClick={() => setMoodFilter('all')}
                  label="Todas"
                />
                {moods.map((m) => (
                  <FilterChip
                    key={m}
                    active={moodFilter === m}
                    onClick={() => setMoodFilter(m)}
                    label={SALA_STATION_MOOD_LABEL[m]}
                  />
                ))}
              </div>
              <ul className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                {visibleStations.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(s.id);
                        setIsPlaying(true);
                      }}
                      className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors border ${
                        s.id === selectedId
                          ? 'bg-white/10 border-white/20'
                          : 'bg-black/20 border-transparent hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white/90">{s.label}</span>
                        <span className="text-[9px] uppercase tracking-wider text-white/40 shrink-0">
                          {SALA_STATION_MOOD_LABEL[s.mood]}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/45 mt-0.5">{s.tagline}</p>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="text-[9px] text-white/35 text-center font-medium">
                Estação {stationIndex + 1} de {SALA_AUDIO_STATIONS.length} · memória por matéria
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide border transition-all ${
        active
          ? 'text-white shadow-lg border-[rgba(var(--hub-primary-rgb),0.45)]'
          : 'text-white/45 border-white/10 bg-black/25 hover:text-white/75'
      }`}
      style={
        active
          ? {
              background: `linear-gradient(135deg, rgba(var(--hub-primary-rgb),0.4), rgba(var(--hub-primary-rgb),0.12))`,
              boxShadow: `0 0 14px rgba(var(--hub-primary-rgb),0.22)`,
            }
          : undefined
      }
    >
      {label}
    </button>
  );
}
