import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { springs } from '../lib/animations/easings';
import { Home, Compass, Target, PenLine, Users, User, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { useAppNavigation } from '../app/router/useAppNavigation';
import { preloadRoute } from '../app/router/preload';

type NavItem = {
  id: 'home' | 'explore' | 'ai' | 'questions' | 'redacao' | 'comunidade' | 'profile';
  label: string;
  icon: typeof Home;
  path: string;
  badge?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'INICIO', icon: Home, path: '/' },
  { id: 'explore', label: 'EXPLORAR', icon: Compass, path: '/explorar' },
  { id: 'ai', label: 'MENTORIA', icon: Sparkles, path: '/ai' },
  { id: 'questions', label: 'QUESTOES', icon: Target, path: '/questoes', badge: true },
  { id: 'redacao', label: 'REDACAO', icon: PenLine, path: '/redacao' },
  { id: 'comunidade', label: 'COMUNIDADE', icon: Users, path: '/comunidade' },
  { id: 'profile', label: 'PERFIL', icon: User, path: '/perfil' },
];

function triggerHaptic() {
  if ('vibrate' in navigator) navigator.vibrate(10);
}

export function BottomNav() {
  const { currentTab } = useAppNavigation();
  const { studyRooms } = useStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pb-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] [transition-property:transform] [transition-duration:var(--duration-slow)] [transition-timing-function:var(--ease-smooth-in-out)]"
      style={{
        transform: currentTab === 'comunidade' && studyRooms.activeRoom ? 'translateY(120%)' : 'translateY(0)',
      }}
    >
      <div className="bottom-nav-dock mx-auto max-w-xl rounded-3xl p-1.5">
        <div className="relative flex h-[3.75rem] items-center justify-around gap-0.5">
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
                className="relative flex h-full flex-1 items-center justify-center no-underline"
              >
                <motion.div
                  whileTap={{ scale: 0.94, transition: springs.snappy }}
                  className="relative flex min-h-[3.35rem] w-[92%] flex-col items-center justify-center gap-0.5 rounded-2xl px-0.5"
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active-pill"
                      className="absolute inset-0 rounded-2xl bg-white/[0.09] ring-1 ring-white/[0.1] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.22),0_0_28px_-12px_rgba(var(--hub-primary-rgb),0.38)]"
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
                    className={`relative z-10 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.06em] ${
                      isActive
                        ? 'text-primary drop-shadow-[0_0_8px_rgba(var(--hub-primary-rgb),0.25)]'
                        : 'text-white/62'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
