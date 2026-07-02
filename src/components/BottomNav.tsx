import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { springs } from '../lib/animations/easings';
import { Home, Compass, Target, PenLine, Users, User, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { useAppNavigation } from '../app/router/useAppNavigation';
import { preloadRoute } from '../app/router/preload';

type NavItem = {
  id: 'home' | 'explore' | 'ai' | 'questions' | 'redacao' | 'comunidade' | 'profile';
  /** Rótulo completo (desktop / tablets largos) */
  label: string;
  /** Rótulo curto para caber em telas estreitas sem encavalamento */
  labelCompact: string;
  icon: typeof Home;
  path: string;
  badge?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'INÍCIO', labelCompact: 'INÍCIO', icon: Home, path: '/' },
  { id: 'explore', label: 'EXPLORAR', labelCompact: 'EXPLORAR', icon: Compass, path: '/explorar' },
  { id: 'ai', label: 'MENTORIA', labelCompact: 'MENTORIA', icon: Sparkles, path: '/ai' },
  { id: 'questions', label: 'QUESTÕES', labelCompact: 'QUESTÕES', icon: Target, path: '/questoes', badge: true },
  { id: 'redacao', label: 'REDAÇÃO', labelCompact: 'REDAÇÃO', icon: PenLine, path: '/redacao' },
  { id: 'comunidade', label: 'COMUNIDADE', labelCompact: 'COMUNIDADE', icon: Users, path: '/comunidade' },
  { id: 'profile', label: 'PERFIL', labelCompact: 'PERFIL', icon: User, path: '/perfil' },
];

function triggerHaptic() {
  if ('vibrate' in navigator) navigator.vibrate(10);
}

export function BottomNav() {
  const { currentTab } = useAppNavigation();
  const activeRoomId = useStore((s) => s.studyRooms?.activeRoom ?? null);

  const nav = (
    <nav
      className="bottom-nav-shell pointer-events-auto fixed bottom-0 left-0 right-0 z-[90] pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-2 [transition-property:transform] [transition-duration:var(--duration-slow)] [transition-timing-function:var(--ease-smooth-in-out)]"
      style={{
        transform: currentTab === 'comunidade' && activeRoomId ? 'translateY(120%)' : 'translateY(0)',
      }}
    >
      <div className="bottom-nav-dock mx-auto max-w-2xl rounded-[30px] p-2.5 overflow-hidden">
        <div className="relative flex h-[4.05rem] gap-1 overflow-x-auto overflow-y-hidden px-0.5 snap-x snap-mandatory no-scrollbar md:items-center md:justify-around md:gap-1.5 md:overflow-visible md:snap-none">
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={triggerHaptic}
                onMouseEnter={() => preloadRoute(item.path)}
                onFocus={() => preloadRoute(item.path)}
                onTouchStart={() => preloadRoute(item.path)}
                title={item.label}
                aria-label={item.label}
                className="relative flex h-full min-w-[3.85rem] shrink-0 snap-center items-center justify-center no-underline md:min-w-0 md:flex-1 md:snap-none"
              >
                <motion.div
                  whileTap={{ scale: 0.94, transition: springs.snappy }}
                  className="bottom-nav-item relative flex min-h-[3.5rem] w-[92%] max-md:w-full flex-col items-center justify-center gap-0.5 rounded-[24px] px-0.5 transition-colors duration-200 hover:bg-white/[0.055]"
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active-pill"
                      className="absolute inset-0 rounded-[24px] bg-[linear-gradient(135deg,rgba(var(--hub-primary-rgb),0.24),rgba(96,245,255,0.10),rgba(255,255,255,0.07))] ring-1 ring-primary/30 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.32),0_14px_34px_-18px_rgba(var(--hub-primary-rgb),1)]"
                      transition={springs.pill}
                    />
                  )}

                  <div className="relative z-10">
                    <item.icon
                      size={18}
                      strokeWidth={isActive ? 2.35 : 2}
                      className={
                        isActive
                          ? 'text-primary drop-shadow-[0_0_10px_rgba(var(--hub-primary-rgb),0.35)]'
                          : 'text-white/68'
                      }
                    />
                    {item.badge && (
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>

                  <span
                    className={`relative z-10 hidden md:block whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.06em] ${
                      isActive
                        ? 'text-primary drop-shadow-[0_0_8px_rgba(var(--hub-primary-rgb),0.25)]'
                        : 'text-white/62'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`relative z-10 md:hidden text-center text-[8px] font-bold uppercase leading-[1.15] tracking-tight ${
                      isActive
                        ? 'text-primary drop-shadow-[0_0_8px_rgba(var(--hub-primary-rgb),0.25)]'
                        : 'text-white/62'
                    }`}
                  >
                    {item.labelCompact}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(nav, document.body);
}
