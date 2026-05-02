import React, { ReactNode } from 'react';
import { GlobalCelebrations } from '../../components/GlobalCelebrations';
import { BossBattle, CommandPalette } from '../../components/overlays';
import { AIChatPanel } from '../../components/AI/AIChatPanel';
import { FloatingAIButton } from '../../components/AI/FloatingAIButton';
import { BottomNav } from '../../components/BottomNav';
import { useStore } from '../../store';
import ReactPlayer from 'react-player';

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
  const { studyRooms } = useStore();

  return (
    <div className="min-h-screen bg-black flex justify-center selection:bg-primary selection:text-black">
      <div 
        id="root-wrapper"
        className="w-full max-w-md md:max-w-4xl lg:max-w-7xl mx-auto min-h-screen relative bg-background overflow-hidden"
        style={{ boxShadow: '0 0 60px rgba(0,232,143,0.05)' }}
      >
        <GlobalCelebrations />
        <div className="fixed inset-0 bg-noise z-[1000] pointer-events-none" />
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
        
        <CommandPalette 
          isOpen={isCommandPaletteOpen} 
          onClose={() => setIsCommandPaletteOpen(false)} 
          onToggle={() => setIsCommandPaletteOpen(!isCommandPaletteOpen)}
        />


        {/* Global Audio Player for Study Rooms */}
        <div className="absolute w-[1px] h-[1px] opacity-0 pointer-events-none overflow-hidden">
          {studyRooms.activeRoom && studyRooms.rooms.find(r => r.id === studyRooms.activeRoom)?.youtubeId && (() => {
            const Player = ReactPlayer as any;
            return (
              <Player
                url={`https://www.youtube.com/watch?v=${studyRooms.rooms.find(r => r.id === studyRooms.activeRoom)?.youtubeId}`}
                playing={studyRooms.audioPlaying && isUserInteracted}
                loop={true}
                volume={(studyRooms.audioVolume ?? 50) / 100}
                width="100%"
                height="100%"
                playsinline
                onError={(e: any) => console.error('ReactPlayer Error:', e)}
                config={{
                  youtube: {
                    playerVars: { 
                      autoplay: studyRooms.audioPlaying ? 1 : 0, 
                      controls: 0,
                      showinfo: 0,
                      rel: 0,
                      iv_load_policy: 3,
                      fs: 0,
                      disablekb: 1
                    }
                  }
                }}
              />
            );
          })()}
        </div>

        <BossBattle />

        <main className="h-full overflow-y-auto no-scrollbar pb-32">
          {children}
        </main>

        <AIChatPanel />
        <FloatingAIButton />
        <BottomNav />
      </div>
    </div>
  );
}
