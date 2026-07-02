import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useAIUI } from '../../hooks/useAIUI';
import { ATHENA_CONFIG } from '../../features/athena/constants/config';
import { springs } from '../../lib/animations/easings';

type FlightState = {
  x: number;
  y: number;
  tilt: number;
  flip: 1 | -1;
  burst: number;
  gliding: boolean;
};

function AthenaOwl({ blinking, active, gliding }: { blinking: boolean; active: boolean; gliding: boolean }) {
  const wingMotion = gliding
    ? { rotate: [-8, 13, -6], y: [-1, 1, -1] }
    : { rotate: [-3, 4, -2], y: [0, -0.5, 0] };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 86 86"
      aria-hidden
      className="pointer-events-none h-full w-full select-none"
    >
      <defs>
        <linearGradient id="athena-flying-body" x1="18" x2="68" y1="8" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#365a4f" />
          <stop offset="0.42" stopColor="#15332b" />
          <stop offset="1" stopColor="#06100d" />
        </linearGradient>
        <linearGradient id="athena-flying-face" x1="22" x2="64" y1="22" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f7fff9" />
          <stop offset="0.5" stopColor="#b8ffe2" />
          <stop offset="1" stopColor="#42ebb0" />
        </linearGradient>
        <radialGradient id="athena-flying-eye" cx="50%" cy="42%" r="58%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#94ffdc" />
          <stop offset="1" stopColor="#00dd8d" />
        </radialGradient>
        <filter id="athena-flying-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.3" result="blur" />
          <feColorMatrix
            in="blur"
            result="glow"
            values="0 0 0 0 0  0 0 0 0 0.92  0 0 0 0 0.58  0 0 0 0.7 0"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.ellipse
        cx="43"
        cy="76"
        rx="19"
        ry="5"
        fill="rgba(0,0,0,0.42)"
        animate={{ opacity: active ? 0.38 : 0.24, scaleX: active ? 0.82 : 1 }}
        transition={{ duration: 0.45 }}
      />

      <motion.g
        animate={wingMotion}
        transition={{ duration: gliding ? 0.48 : 1.7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '43px 34px' }}
      >
        <path
          d="M26.5 34.2c-9.2 2.2-15.9 8.6-18.6 17.8 9.4 1 17.8-2.6 23.2-10.6l2.5-4.2-7.1-3Z"
          fill="rgba(73, 226, 169, 0.22)"
          stroke="rgba(181,255,223,0.34)"
          strokeWidth="1.4"
        />
        <path
          d="M59.5 34.2c9.2 2.2 15.9 8.6 18.6 17.8-9.4 1-17.8-2.6-23.2-10.6l-2.5-4.2 7.1-3Z"
          fill="rgba(73, 226, 169, 0.22)"
          stroke="rgba(181,255,223,0.34)"
          strokeWidth="1.4"
        />
      </motion.g>

      <g filter="url(#athena-flying-glow)">
        <path
          d="M25.2 22.8 21.4 10.9l13 6.2a25.2 25.2 0 0 1 17.2 0l13-6.2-3.8 11.9c5.2 4.5 8.3 11.1 8.3 19 0 17.5-10.8 31.2-26.1 31.2S16.9 59.3 16.9 41.8c0-7.9 3.1-14.5 8.3-19Z"
          fill="url(#athena-flying-body)"
          stroke="rgba(181,255,223,0.5)"
          strokeWidth="1.55"
        />
        <path
          d="M27.2 29.2c4.2-5.8 11.7-5.7 15.8-.4 4.1-5.3 11.6-5.4 15.8.4 4.3 5.9.7 15.4-6.9 16.8-3.7.7-6.8-.6-8.9-3.2-2.1 2.6-5.2 3.9-8.9 3.2-7.6-1.4-11.2-10.9-6.9-16.8Z"
          fill="url(#athena-flying-face)"
        />
        <path d="M31.5 57.7c2.7 2.4 6.5 3.7 11.5 3.7s8.8-1.3 11.5-3.7" fill="none" stroke="rgba(181,255,223,0.58)" strokeLinecap="round" strokeWidth="1.8" />
      </g>

      <circle cx="34.8" cy="36.2" r="7.9" fill="#06110d" />
      <circle cx="51.2" cy="36.2" r="7.9" fill="#06110d" />
      {blinking ? (
        <>
          <path d="M29.4 36.2h10.8" stroke="#a8ffe0" strokeLinecap="round" strokeWidth="2.5" />
          <path d="M45.8 36.2h10.8" stroke="#a8ffe0" strokeLinecap="round" strokeWidth="2.5" />
        </>
      ) : (
        <>
          <circle cx={active ? '35.8' : '34.8'} cy="36.2" r="5.15" fill="url(#athena-flying-eye)" />
          <circle cx={active ? '52.2' : '51.2'} cy="36.2" r="5.15" fill="url(#athena-flying-eye)" />
          <circle cx={active ? '36.4' : '35.4'} cy="36" r="2.35" fill="#02100b" />
          <circle cx={active ? '52.8' : '51.8'} cy="36" r="2.35" fill="#02100b" />
          <circle cx="37.5" cy="33.9" r="1" fill="#ffffff" opacity="0.95" />
          <circle cx="53.9" cy="33.9" r="1" fill="#ffffff" opacity="0.95" />
        </>
      )}
      <path d="M43 40.2 38.9 46h8.2L43 40.2Z" fill="#f6bd60" />
      <path d="M37.5 68.6h5" stroke="#f6bd60" strokeLinecap="round" strokeWidth="2.8" />
      <path d="M43.5 68.6h5" stroke="#f6bd60" strokeLinecap="round" strokeWidth="2.8" />
    </svg>
  );
}

export function FloatingAIButton() {
  const { openChat, isOpen, setViewMode } = useAIUI();
  const reduced = useReducedMotion() ?? false;
  const [hover, setHover] = React.useState(false);
  const [ripple, setRipple] = React.useState(0);
  const [blink, setBlink] = React.useState(false);
  const [flight, setFlight] = React.useState<FlightState>({
    x: 0,
    y: 0,
    tilt: 0,
    flip: 1,
    burst: 0,
    gliding: false,
  });

  useEffect(() => {
    if (reduced) return undefined;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let releaseTimer: ReturnType<typeof setTimeout>;
    let lastScroll = 0;
    let lastX = 0;

    const main = document.getElementById('app-main-scroll');
    const getScrollTop = () => main?.scrollTop ?? window.scrollY;

    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 150);
        scheduleBlink();
      }, 3600 + Math.random() * 4200);
    };

    const releaseFlight = () => {
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(() => {
        setFlight((current) => ({
          ...current,
          y: Math.round(current.y * 0.18),
          tilt: 0,
          gliding: false,
        }));
      }, 520);
    };

    const handleScroll = () => {
      const scrollTop = getScrollTop();
      const delta = scrollTop - lastScroll;
      if (Math.abs(delta) < 2) return;

      const nextX = Math.round(Math.sin(scrollTop / 150) * 42);
      const horizontal = nextX - lastX;
      const goingUp = delta < 0;
      lastScroll = scrollTop;
      lastX = nextX;

      setFlight((current) => ({
        x: nextX,
        y: goingUp ? -58 : 18,
        tilt: goingUp ? -11 : 9,
        flip: horizontal < -1 ? -1 : horizontal > 1 ? 1 : current.flip,
        burst: current.burst + 1,
        gliding: true,
      }));
      releaseFlight();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const width = window.innerWidth || 1;
      const zone = event.clientX / width;
      if (zone < 0.18 || zone > 0.82) {
        setFlight((current) => ({
          ...current,
          x: zone < 0.18 ? -34 : 18,
          flip: zone < 0.18 ? -1 : 1,
          tilt: zone < 0.18 ? -8 : 6,
          gliding: true,
        }));
        releaseFlight();
      }
    };

    lastScroll = getScrollTop();
    scheduleBlink();
    main?.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(releaseTimer);
      main?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [reduced]);

  if (isOpen) return null;

  const handleOpen = () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
    setRipple((value) => value + 1);
    setFlight((current) => ({
      ...current,
      y: -18,
      tilt: -7,
      gliding: true,
      burst: current.burst + 1,
    }));
    window.setTimeout(() => {
      setViewMode('sidebar');
      openChat('Geral');
    }, 130);
  };

  return (
    <motion.button
      type="button"
      aria-label={`Abrir ${ATHENA_CONFIG.NAME}`}
      onClick={handleOpen}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.72, y: 24 }}
      animate={{
        opacity: 1,
        scale: hover ? 1.06 : 1,
        x: flight.x,
        y: flight.y,
        rotate: flight.tilt,
      }}
      transition={reduced ? { duration: 0.12 } : springs.soft}
      whileTap={{ scale: 0.9, transition: springs.snappy }}
      className="fixed right-5 z-[100] h-[5.35rem] w-[5.35rem] overflow-visible rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e0d]"
      style={{ bottom: 'calc(5.85rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <AnimatePresence>
        {ripple > 0 && (
          <motion.span
            key={ripple}
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-full border border-primary/60"
            initial={{ scale: 0.72, opacity: 0.74 }}
            animate={{ scale: 1.74, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flight.burst > 0 && !reduced && (
          <motion.span
            key={flight.burst}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-10 rounded-full bg-primary/40 blur-sm"
            initial={{ opacity: 0.45, x: flight.flip === 1 ? -48 : 8, y: 10, scaleX: 0.35 }}
            animate={{ opacity: 0, x: flight.flip === 1 ? -98 : 58, y: 24, scaleX: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-1 rounded-full"
        animate={reduced ? {} : { opacity: hover || flight.gliding ? [0.45, 0.7, 0.45] : [0.22, 0.38, 0.22] }}
        transition={{ duration: hover || flight.gliding ? 1.1 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(var(--hub-primary-rgb),0.38), rgba(96,245,255,0.16) 42%, transparent 72%)',
          filter: 'blur(14px)',
        }}
      />

      <motion.span
        className="relative z-10 flex h-full w-full items-center justify-center rounded-full"
        animate={{ rotateY: flight.flip === -1 ? 180 : 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'radial-gradient(circle at 38% 24%, rgba(255,255,255,0.16), rgba(var(--hub-primary-rgb),0.13) 34%, rgba(4,14,12,0.52) 62%, rgba(0,0,0,0.08) 100%)',
          filter: hover ? 'drop-shadow(0 0 24px rgba(var(--hub-primary-rgb),0.34))' : 'drop-shadow(0 0 16px rgba(var(--hub-primary-rgb),0.22))',
        }}
      >
        <AthenaOwl blinking={blink} active={hover || flight.gliding} gliding={flight.gliding} />
        <span className="absolute right-3 top-3 h-3 w-3 rounded-full border-2 border-[#06100d] bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
      </motion.span>
    </motion.button>
  );
}