import { useState, useEffect, useRef, useCallback } from 'react';

export type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function useRoomAudio(audioSrc: string | undefined, fallbackSrc?: string, defaultVolume: number = 0.5, roomName: string = 'Study') {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>('idle');
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('study_room_volume');
    return saved !== null ? parseFloat(saved) : defaultVolume;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('study_room_muted') === 'true';
  });

  // Handle initialization and source changes
  useEffect(() => {
    if (!audioSrc) return;

    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audio.volume = isMuted ? 0 : volume;
    
    audioRef.current = audio;
    setState('loading');

    const handleCanPlay = () => {
      if (state === 'loading') setState('paused');
    };

    const handlePlay = () => setState('playing');
    const handlePause = () => {
      // Only set to paused if we were playing, to avoid conflicting with error/loading
      setState(prev => prev === 'playing' ? 'paused' : prev);
    };

    const handleError = () => {
      console.warn(`[useRoomAudio] Failed to load: ${audio.src}. Trying fallback...`);
      if (fallbackSrc && audio.src !== fallbackSrc) {
        audio.src = fallbackSrc;
        audio.load();
      } else {
        setState('error');
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    audio.src = audioSrc;

    return () => {
      audio.pause();
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.src = '';
      audio.load();
      audioRef.current = null;
    };
  }, [audioSrc, fallbackSrc]);

  // Handle volume/mute updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('study_room_volume', volume.toString());
    localStorage.setItem('study_room_muted', isMuted.toString());
  }, [volume, isMuted]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      // Ensure AudioContext is resumed if any (not used here but good practice)
      // For standard HTMLAudioElement, just play()
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        
        // Setup Media Session API
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: `${roomName} Ambient`,
            artist: 'StudyFlow Study Rooms',
            album: 'StudyFlow Lo-Fi & Ambience',
            artwork: [
              { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
              { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            ]
          });

          navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
          navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
          navigator.mediaSession.setActionHandler('stop', () => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          });
        }
      }
    } catch (err) {
      console.warn('[useRoomAudio] Autoplay blocked or interrupted', err);
      setState('paused');
    }
  }, [roomName]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (state === 'playing') {
      pause();
    } else {
      play();
    }
  }, [state, play, pause]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (isMuted && clamped > 0) setIsMuted(false);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    state,
    volume,
    isMuted,
    play,
    pause,
    toggle,
    setVolume,
    toggleMute
  };
}

