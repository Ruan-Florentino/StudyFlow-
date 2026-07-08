import type { MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Home, Target, Timer, Trophy, User } from 'lucide-react';
import { springs } from '../lib/animations/easings';
import { playInteractionFeedback } from '../lib/feedback';
import { useAppNavigation } from '../app/router/useAppNavigation';
import { preloadRoute } from '../app/router/preload';

type NavItem = {
  id: 'home' | 'questions' | 'explore' | 'ranking' | 'focus' | 'profile';
  label: string;
  labelCompact: string;
  icon: typeof Home;
  path: string;
  badge?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'INICIO', labelCompact: 'INICIO', icon: Home, path: '/' },
  { id: 'questions', label: 'QUESTOES', labelCompact: 'QUEST', icon: Target, path: '/questoes', badge: true },
  { id: 'explore', label: 'EXPLORAR', labelCompact: 'EXPLORAR', icon: Compass, path: '/explorar' },
  { id: 'ranking', label: 'RANKING', labelCompact: 'RANK', icon: Trophy, path: '/ranking' },
  { id: 'focus', label: 'FOCO', labelCompact: 'FOCO', icon: Timer, path: '/foco' },
  { id: 'profile', label: 'PERFIL', labelCompact: 'PERFIL', icon: User, path: '/perfil' },
];


function scrollMainToTop() {
  const main = document.getElementById('app-main-scroll');
  const target = main ?? document.scrollingElement ?? document.documentElement;
  target.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

function handleNavClick(event: MouseEvent<HTMLAnchorElement>, isActive: boolean) {
  playInteractionFeedback(isActive ? 'soft' : 'tap');
  if (!isActive) return;
  event.preventDefault();
  scrollMainToTop();
}

export function BottomNav() {
  const { currentTab } = useAppNavigation();

  const nav = (
    <nav className="bottom-nav-shell studyflow-nav-shell pointer-events-auto fixed bottom-0 left-0 right-0 z-[90] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-2">
      <div className="bottom-nav-dock studyflow-nav-dock mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] p-1.5 md:p-2.5">
        <div className="relative grid h-[4.05rem] grid-cols-6 gap-0.5 px-0.5 md:gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={(event) => handleNavClick(event, isActive)}
                onMouseEnter={() => preloadRoute(item.path)}
                onFocus={() => preloadRoute(item.path)}
                onTouchStart={() => preloadRoute(item.path)}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex h-full min-w-0 items-center justify-center no-underline"
              >
                <motion.div
                  whileTap={{ scale: 0.92, y: 1, transition: springs.snappy }}
                  className="bottom-nav-item studyflow-nav-item relative flex min-h-[3.5rem] w-full flex-col items-center justify-center gap-0.5 rounded-[22px] px-0.5 transition-[background-color,transform,color] duration-200 hover:bg-white/[0.055] md:rounded-[24px]"
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active-pill"
                      className="absolute inset-0 rounded-[24px] bg-[linear-gradient(135deg,rgba(var(--hub-primary-rgb),0.24),rgba(96,245,255,0.10),rgba(255,255,255,0.07))] ring-1 ring-primary/30 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.32),0_14px_34px_-18px_rgba(var(--hub-primary-rgb),1)]"
                      transition={springs.pill}
                    />
                  )}
                  <div className="relative z-10">
                    <item.icon size={18} strokeWidth={isActive ? 2.35 : 2} className={isActive ? 'text-primary drop-shadow-[0_0_10px_rgba(var(--hub-primary-rgb),0.35)]' : 'text-white/70'} />
                    {item.badge && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <span className={isActive ? 'relative z-10 hidden whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.06em] text-primary drop-shadow-[0_0_8px_rgba(var(--hub-primary-rgb),0.25)] md:block' : 'relative z-10 hidden whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.06em] text-white/60 md:block'}>{item.label}</span>
                  <span className={isActive ? 'relative z-10 max-w-full truncate text-center text-[7.5px] font-bold uppercase leading-[1.15] tracking-tight text-primary drop-shadow-[0_0_8px_rgba(var(--hub-primary-rgb),0.25)] md:hidden' : 'relative z-10 max-w-full truncate text-center text-[7.5px] font-bold uppercase leading-[1.15] tracking-tight text-white/60 md:hidden'}>{item.labelCompact}</span>
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
