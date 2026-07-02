import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useAIUI } from '../../hooks/useAIUI';
import { ATHENA_CONFIG } from '../../features/athena/constants/config';
import { springs } from '../../lib/animations/easings';

function AthenaOwl({ blinking, active }: { blinking: boolean; active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      aria-hidden
      className="pointer-events-none h-[70%] w-[70%] select-none"
      style={{
        filter: active
          ? 'drop-shadow(0 0 13px rgba(0,255,168,0.62)) drop-shadow(0 10px 20px rgba(0,0,0,0.45))'
          : 'drop-shadow(0 0 9px rgba(0,255,168,0.42)) drop-shadow(0 7px 14px rgba(0,0,0,0.38))',
      }}
    >
      <defs>
        <linearGradient id="athena-launcher-body" x1="14" x2="50" y1="8" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#28493f" />
          <stop offset="0.5" stopColor="#10251f" />
          <stop offset="1" stopColor="#06100d" />
        </linearGradient>
        <linearGradient id="athena-launcher-face" x1="20" x2="44" y1="18" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f4fff8" />
          <stop offset="0.56" stopColor="#b8ffe2" />
          <stop offset="1" stopColor="#53f3b2" />
        </linearGradient>
        <radialGradient id="athena-launcher-eye" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.42" stopColor="#8fffd7" />
          <stop offset="1" stopColor="#00df8d" />
        </radialGradient>
      </defs>

      <path
        d="M18.7 18.1 15.7 8.9l10 4.7a20.6 20.6 0 0 1 12.6 0l10-4.7-3 9.2c4 3.6 6.4 8.8 6.4 15.1 0 13.4-8.2 23.9-19.7 23.9S12.3 46.6 12.3 33.2c0-6.3 2.4-11.5 6.4-15.1Z"
        fill="url(#athena-launcher-body)"
        stroke="rgba(181,255,223,0.45)"
        strokeWidth="1.3"
      />
      <path
        d="M20.6 22.9c3.2-4.3 8.8-4.2 11.4-.4 2.6-3.8 8.2-3.9 11.4.4 3.2 4.4.6 11.6-5.1 12.8-2.7.6-5-.3-6.3-2.1-1.3 1.8-3.6 2.7-6.3 2.1-5.7-1.2-8.3-8.4-5.1-12.8Z"
        fill="url(#athena-launcher-face)"
      />
      <path d="M23.8 43.1c2 2 4.7 3.1 8.2 3.1s6.2-1.1 8.2-3.1" fill="none" stroke="rgba(181,255,223,0.55)" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="25.4" cy="27" r="6" fill="#06110d" />
      <circle cx="38.6" cy="27" r="6" fill="#06110d" />
      {blinking ? (
        <>
          <path d="M21.2 27h8.4" stroke="#a8ffe0" strokeLinecap="round" strokeWidth="2.1" />
          <path d="M34.4 27h8.4" stroke="#a8ffe0" strokeLinecap="round" strokeWidth="2.1" />
        </>
      ) : (
        <>
          <circle cx={active ? '26' : '25.4'} cy="27" r="4.05" fill="url(#athena-launcher-eye)" />
          <circle cx={active ? '39.2' : '38.6'} cy="27" r="4.05" fill="url(#athena-launcher-eye)" />
          <circle cx={active ? '26.5' : '25.9'} cy="26.8" r="1.9" fill="#02100b" />
          <circle cx={active ? '39.7' : '39.1'} cy="26.8" r="1.9" fill="#02100b" />
          <circle cx="27.3" cy="25.3" r="0.85" fill="#ffffff" opacity="0.95" />
          <circle cx="40.5" cy="25.3" r="0.85" fill="#ffffff" opacity="0.95" />
        </>
      )}
      <path d="M32 30.2 29 34.1h6l-3-3.9Z" fill="#f6bd60" />
    </svg>
  );
}

function Tooltip({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={springs.soft}
          className="pointer-events-none absolute bottom-full right-0 mb-3 hidden whitespace-nowrap rounded-2xl border border-white/10 bg-black/80 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-primary shadow-[0_18px_44px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:block"
        >
          Abrir {ATHENA_CONFIG.NAME}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function FloatingAIButton() {
  const { openChat, isOpen, setViewMode } = useAIUI();
  const reduced = useReducedMotion() ?? false;
  const [hover, setHover] = React.useState(false);
  const [ripple, setRipple] = React.useState(0);
  const [blink, setBlink] = React.useState(false);

  useEffect(() => {
    if (reduced) return undefined;
    let timer: ReturnType<typeof setTimeout>;
    let blinkTimer: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      timer = setTimeout(() => {
        setBlink(true);
        blinkTimer = setTimeout(() => setBlink(false), 150);
        scheduleBlink();
      }, 5200 + Math.random() * 5200);
    };

    scheduleBlink();

    return () => {
      clearTimeout(timer);
      clearTimeout(blinkTimer);
    };
  }, [reduced]);

  if (isOpen) return null;

  const handleOpen = () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
    setRipple((value) => value + 1);
    window.setTimeout(() => {
      setViewMode('sidebar');
      openChat('Geral');
    }, 110);
  };

  return (
    <motion.button
      type="button"
      aria-label={`Abrir ${ATHENA_CONFIG.NAME}`}
      onClick={handleOpen}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ scale: 0.82, opacity: 0, y: 12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ ...springs.bouncy, delay: 0.12 }}
      whileTap={{ scale: 0.94, transition: springs.snappy }}
      className="group fixed right-4 z-[100] h-16 w-16 overflow-visible rounded-[24px] border border-primary/25 bg-[#06100d]/90 shadow-[0_22px_70px_rgba(0,0,0,0.55)] outline-none backdrop-blur-2xl transition-[width,border-color,box-shadow,background] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e0d] hover:border-primary/45 hover:bg-[#071611]/95 hover:shadow-[0_24px_80px_rgba(0,0,0,0.62),0_0_32px_rgba(var(--hub-primary-rgb),0.22)] sm:w-[12.25rem] sm:rounded-[26px]"
      style={{ bottom: 'calc(6.05rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <Tooltip visible={hover} />

      <AnimatePresence>
        {ripple > 0 && (
          <motion.span
            key={ripple}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] border border-primary/60"
            initial={{ scale: 0.94, opacity: 0.7 }}
            animate={{ scale: 1.45, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, rgba(var(--hub-primary-rgb),0.18), rgba(96,245,255,0.08) 48%, rgba(167,139,250,0.1))',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.35)',
        }}
      />

      {!reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-[inherit] opacity-55 blur-md"
          animate={{ opacity: hover ? [0.45, 0.72, 0.45] : [0.22, 0.42, 0.22] }}
          transition={{ duration: hover ? 1.8 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'linear-gradient(135deg, rgba(var(--hub-primary-rgb),0.34), rgba(96,245,255,0.16), transparent)' }}
        />
      )}

      <span className="relative z-10 flex h-full w-full items-center gap-3 px-2 sm:px-3">
        <span className="athena-signal flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] border border-primary/25 bg-primary/10 shadow-[0_14px_34px_rgba(var(--hub-primary-rgb),0.16)]">
          <AthenaOwl blinking={blink} active={hover} />
        </span>

        <span className="hidden min-w-0 flex-1 text-left sm:block">
          <span className="block truncate text-[10px] font-black uppercase tracking-widest text-primary/80">Athena online</span>
          <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-bold text-white/80">
            <Sparkles size={13} className="shrink-0 text-cyan-200" />
            Abrir assistente
          </span>
        </span>

        <span className="absolute right-2 top-2 z-20 h-2.5 w-2.5 rounded-full border-2 border-[#06100d] bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)] sm:right-3 sm:top-3" />
      </span>
    </motion.button>
  );
}
