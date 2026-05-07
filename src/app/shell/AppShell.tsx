import React, { ReactNode, Suspense, lazy, useEffect, useState } from 'react';
import { useSessionStore } from '../../store/useSessionStore';

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
  const [PlayerComponent, setPlayerComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null);

  useEffect(() => {
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
  }, [activeYoutubeId, PlayerComponent]);

  return (
    <div className="min-h-screen bg-background flex justify-center selection:bg-primary/30 selection:text-white">
      <div 
        id="root-wrapper"
        className="w-full max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen relative bg-background overflow-hidden border border-white/10 liquid-glass"
        style={{ boxShadow: '0 24px 70px rgba(0, 0, 0, 0.55)' }}
      >
        <Suspense fallback={null}>
          <GlobalCelebrations />
        </Suspense>
        <div className="fixed inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent z-[1000] pointer-events-none" />
        
        {isCommandPaletteOpen && (
          <Suspense fallback={null}>
            <CommandPalette
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
              onToggle={() => setIsCommandPaletteOpen(!isCommandPaletteOpen)}
            />
          </Suspense>
        )}


        {/* Global Audio Player for Study Rooms */}
        <div className="absolute w-[1px] h-[1px] opacity-0 pointer-events-none overflow-hidden">
          {activeYoutubeId && (() => {
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
                playsinline
                onError={(e: unknown) => console.error('ReactPlayer Error:', e)}
                config={{
                  youtube: {
                    rel: 0,
                    iv_load_policy: 3,
                    fs: 0,
                    disablekb: 1,
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
          className="h-full overflow-y-auto no-scrollbar pb-32"
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
