import React, { ReactNode, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useSessionStore } from '../../store/useSessionStore';
import { debugSessionIngest } from '../../lib/debugSessionIngest';
import { RouteProgress } from './RouteProgress';

const ROOM_AUDIO_SRC: Record<string, string> = {
  library: 'https://ice6.somafm.com/lush-128-mp3',
  biblioteca: 'https://ice6.somafm.com/lush-128-mp3',
  cafe: 'https://ice6.somafm.com/defcon-128-mp3',
  cyberpunk: 'https://ice6.somafm.com/defcon-128-mp3',
  forest: 'https://ice6.somafm.com/deepspaceone-128-mp3',
  floresta: 'https://ice6.somafm.com/deepspaceone-128-mp3',
  lofi: 'https://ice6.somafm.com/groovesalad-128-mp3',
  lareira: 'https://ice6.somafm.com/groovesalad-128-mp3',
  cosmico: 'https://ice6.somafm.com/deepspaceone-128-mp3',
};

const CommandPalette = lazy(() =>
  import('../../components/overlays/CommandPalette/CommandPalette').then((module) => ({
    default: module.CommandPalette,
  }))
);

const BossBattle = lazy(() =>
  import('../../components/overlays/BossBattle/BossBattle').then((module) => ({
    default: module.BossBattle,
  }))
);

const AthenaSidebar = lazy(() =>
  import('../../features/athena/components/AthenaSidebar').then((module) => ({
    default: module.AthenaSidebar,
  }))
);

const GlobalCelebrations = lazy(() =>
  import('../../components/GlobalCelebrations').then((module) => ({
    default: module.GlobalCelebrations,
  }))
);

const FloatingAIButton = lazy(() =>
  import('../../components/AI/FloatingAIButton').then((module) => ({
    default: module.FloatingAIButton,
  }))
);

const BottomNav = lazy(() =>
  import('../../components/BottomNav').then((module) => ({
    default: module.BottomNav,
  }))
);
/**
 * AppShell
 * Layout principal: sidebar + header + área de conteúdo
 * + overlays globais.
 * Extraído de: App.tsx (T.45-F)
 */

interface AppShellProps {
  children: ReactNode;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isUserInteracted: boolean;
}

export function AppShell({ 
  children, 
  isCommandPaletteOpen, 
  setIsCommandPaletteOpen,
  isUserInteracted
}: AppShellProps) {
  const studyRooms = useSessionStore((state) => state.studyRooms);
  const activeRoom = studyRooms.activeRoom
    ? studyRooms.rooms.find((room) => room.id === studyRooms.activeRoom)
    : null;
  const activeYoutubeId = activeRoom?.youtubeId ?? null;
  const nativeRoomAudioSrc = studyRooms.activeRoom
    ? ROOM_AUDIO_SRC[studyRooms.activeRoom] ?? null
    : null;
  const nativeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [PlayerComponent, setPlayerComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null);

  useEffect(() => {
    if (nativeRoomAudioSrc) return;
    if (!activeYoutubeId) return;
    if (PlayerComponent) return;
    let mounted = true;
    void import('../../components/media/YoutubePlayer').then((module) => {
      if (!mounted) return;
      setPlayerComponent(() => module.default as unknown as React.ComponentType<Record<string, unknown>>);
    });
    return () => {
      mounted = false;
    };
  }, [activeYoutubeId, nativeRoomAudioSrc, PlayerComponent]);

  useEffect(() => {
    const audio = nativeAudioRef.current;
    if (!audio || !nativeRoomAudioSrc) return;
    const vol = (studyRooms.audioVolume ?? 50) / 100;
    audio.muted = false;
    audio.defaultMuted = false;
    audio.volume = vol <= 0 ? 0 : Math.min(1, vol);
    if (!studyRooms.audioPlaying || !isUserInteracted) {
      audio.pause();
      return;
    }
    if (audio.getAttribute('src') !== nativeRoomAudioSrc) {
      audio.src = nativeRoomAudioSrc;
      audio.load();
    }
    void audio.play().catch(() => {
      audio.pause();
    });
  }, [
    isUserInteracted,
    nativeRoomAudioSrc,
    studyRooms.audioPlaying,
    studyRooms.audioVolume,
  ]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const vv = window.visualViewport;
    if (!vv) return;
    let lastReportedHeight = 0;
    const report = () => {
      const h = Math.round(vv.height * 100) / 100;
      if (
        lastReportedHeight !== 0 &&
        Math.abs(h - lastReportedHeight) < 8
      ) {
        return;
      }
      lastReportedHeight = h;
      // #region agent log
      debugSessionIngest({
        hypothesisId: 'H3',
        location: 'AppShell:visualViewport',
        message: 'viewport resize/jump',
        data: {
          vvHeight: h,
          vvOffsetTop: vv.offsetTop,
          vvScale: vv.scale,
          windowInnerHeight: window.innerHeight,
        },
      });
      // #endregion
    };
    vv.addEventListener('resize', report);
    vv.addEventListener('scroll', report);
    report();
    return () => {
      vv.removeEventListener('resize', report);
      vv.removeEventListener('scroll', report);
    };
  }, []);

  return (
    <div className="app-shell-viewport app-cinematic-bg flex justify-center selection:bg-primary/30 selection:text-white">
      <div 
        id="root-wrapper"
        className="app-frame studyflow-app-frame w-full max-w-md md:max-w-4xl lg:max-w-7xl mx-auto relative overflow-x-hidden liquid-glass max-md:flex max-md:flex-col max-md:min-h-[100dvh] md:min-h-screen md:h-auto md:max-h-none pt-[env(safe-area-inset-top,0px)]"
        style={{ boxShadow: '0 30px 90px rgba(0, 0, 0, 0.62)' }}
      >
        <Suspense fallback={null}>
          <GlobalCelebrations />
        </Suspense>
        <div className="studyflow-hud-grid" aria-hidden />
        <div className="studyflow-edge-rail studyflow-edge-rail-left" aria-hidden />
        <div className="studyflow-edge-rail studyflow-edge-rail-right" aria-hidden />
        <div className="fixed inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent z-[1000] pointer-events-none" />
        <RouteProgress />
        
        {isCommandPaletteOpen && (
          <Suspense fallback={null}>
            <CommandPalette
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
            />
          </Suspense>
        )}


        {/* Global Audio Player — iOS costuma bloquear vídeo totalmente invisível; micro-footprint + inline. */}
        <div
          className="pointer-events-none fixed bottom-0 right-0 z-0 h-[2px] w-[2px] overflow-hidden opacity-[0.02]"
          aria-hidden
        >
          {nativeRoomAudioSrc && (
            <audio ref={nativeAudioRef} loop preload="auto" src={nativeRoomAudioSrc} />
          )}
          {!nativeRoomAudioSrc && activeYoutubeId && (() => {
            const Player = PlayerComponent;
            if (!Player) return null;
            return (
              <Player
                src={`https://www.youtube.com/watch?v=${activeYoutubeId}`}
                playing={studyRooms.audioPlaying && isUserInteracted}
                loop={true}
                volume={(studyRooms.audioVolume ?? 50) / 100}
                width="100%"
                height="100%"
                playsInline
                onError={(e: unknown) => console.error('ReactPlayer Error:', e)}
                config={{
                  youtube: {
                    rel: 0,
                    iv_load_policy: 3,
                    fs: 0,
                    disablekb: 1,
                    playsinline: 1,
                  }
                }}
              />
            );
          })()}
        </div>

        <Suspense fallback={null}>
          <BossBattle />
        </Suspense>

        <main
          id="app-main-scroll"
          className="studyflow-main-surface flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar pb-[var(--app-main-scroll-pad-bottom)]"
        >
          {children}
        </main>

        <Suspense fallback={null}>
          <AthenaSidebar />
        </Suspense>
        <Suspense fallback={null}>
          <FloatingAIButton />
          <BottomNav />
        </Suspense>
      </div>
    </div>
  );
}
