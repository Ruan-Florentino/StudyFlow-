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
  peek: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function AthenaOwl({ blinking, active, gliding }: { blinking: boolean; active: boolean; gliding: boolean }) {
  const wingMotion = gliding
    ? { rotate: [-16, 19, -12], y: [-3, 2, -2] }
    : { rotate: [-5, 7, -4], y: [0, -1, 0] };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      aria-hidden
      className="pointer-events-none h-full w-full select-none"
    >
      <defs>
        <linearGradient id="athena-real-body" x1="22" x2="74" y1="8" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#49665a" />
          <stop offset="0.34" stopColor="#25443a" />
          <stop offset="0.72" stopColor="#10251f" />
          <stop offset="1" stopColor="#050b09" />
        </linearGradient>
        <linearGradient id="athena-real-face" x1="25" x2="71" y1="24" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.48" stopColor="#d8ffe8" />
          <stop offset="1" stopColor="#5ff0b8" />
        </linearGradient>
        <linearGradient id="athena-real-wing" x1="5" x2="89" y1="28" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1f3c34" />
          <stop offset="0.5" stopColor="#3b6f5d" />
          <stop offset="1" stopColor="#0b1a16" />
        </linearGradient>
        <radialGradient id="athena-real-eye" cx="50%" cy="44%" r="58%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.38" stopColor="#a7ffe1" />
          <stop offset="1" stopColor="#00d887" />
        </radialGradient>
        <filter id="athena-real-soft" x="-55%" y="-55%" width="210%" height="210%">
          <feGaussianBlur stdDeviation="2.1" result="blur" />
          <feColorMatrix
            in="blur"
            result="glow"
            values="0 0 0 0 0.02  0 0 0 0 0.92  0 0 0 0 0.58  0 0 0 0.66 0"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.ellipse
        cx="48"
        cy="84"
        rx="22"
        ry="5.5"
        fill="rgba(0,0,0,0.38)"
        animate={{ opacity: active ? 0.34 : 0.2, scaleX: active ? 0.72 : 1 }}
        transition={{ duration: 0.4 }}
      />

      <motion.g
        animate={wingMotion}
        transition={{ duration: gliding ? 0.34 : 1.55, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '48px 40px' }}
      >
        <path
          d="M31.7 36.5C20.5 36.7 10 43.8 5.6 54.6c8.9 4.1 19.7 2 27.9-5.8l6.7-6.5-8.5-5.8Z"
          fill="url(#athena-real-wing)"
          opacity="0.9"
          stroke="rgba(196,255,226,0.32)"
          strokeWidth="1.35"
        />
        <path d="M12.8 53.5c6.2-2.1 12.1-5.4 18-10.6" fill="none" stroke="rgba(255,255,255,0.18)" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M17.5 60.5c5.5-2.3 10.4-5.5 14.9-9.8" fill="none" stroke="rgba(0,0,0,0.24)" strokeLinecap="round" strokeWidth="1.4" />
        <path
          d="M64.3 36.5c11.2.2 21.7 7.3 26.1 18.1-8.9 4.1-19.7 2-27.9-5.8l-6.7-6.5 8.5-5.8Z"
          fill="url(#athena-real-wing)"
          opacity="0.9"
          stroke="rgba(196,255,226,0.32)"
          strokeWidth="1.35"
        />
        <path d="M83.2 53.5c-6.2-2.1-12.1-5.4-18-10.6" fill="none" stroke="rgba(255,255,255,0.18)" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M78.5 60.5c-5.5-2.3-10.4-5.5-14.9-9.8" fill="none" stroke="rgba(0,0,0,0.24)" strokeLinecap="round" strokeWidth="1.4" />
      </motion.g>

      <g filter="url(#athena-real-soft)">
        <path
          d="M29.4 24.2 25 11.6l14.2 6.7a29 29 0 0 1 17.6 0L71 11.6l-4.4 12.6c5.8 5 9.3 12.2 9.3 20.8 0 19.7-11.9 35-27.9 35S20.1 64.7 20.1 45c0-8.6 3.5-15.8 9.3-20.8Z"
          fill="url(#athena-real-body)"
          stroke="rgba(205,255,232,0.52)"
          strokeWidth="1.45"
        />
        <path
          d="M31.1 31.5c4.3-6.5 12-6.7 16.9-1.3 4.9-5.4 12.6-5.2 16.9 1.3 4.7 7.1.8 17.8-7.5 19.6-4 .9-7.4-.3-9.4-3.2-2 2.9-5.4 4.1-9.4 3.2-8.3-1.8-12.2-12.5-7.5-19.6Z"
          fill="url(#athena-real-face)"
        />
        <path d="M34.1 63.7c3 2.8 7.6 4.3 13.9 4.3s10.9-1.5 13.9-4.3" fill="none" stroke="rgba(205,255,232,0.56)" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M36.4 58.6c1.6 1 3.2 1.7 4.9 2.1" fill="none" stroke="rgba(255,255,255,0.16)" strokeLinecap="round" strokeWidth="1.3" />
        <path d="M59.6 58.6c-1.6 1-3.2 1.7-4.9 2.1" fill="none" stroke="rgba(255,255,255,0.16)" strokeLinecap="round" strokeWidth="1.3" />
      </g>

      <path d="M36.5 53.8c2.6 1.3 5.3 2 8.1 2.2" fill="none" stroke="rgba(0,0,0,0.22)" strokeLinecap="round" strokeWidth="1.25" />
      <path d="M59.5 53.8c-2.6 1.3-5.3 2-8.1 2.2" fill="none" stroke="rgba(0,0,0,0.22)" strokeLinecap="round" strokeWidth="1.25" />
      <circle cx="38.5" cy="39.6" r="8.5" fill="#06110d" />
      <circle cx="57.5" cy="39.6" r="8.5" fill="#06110d" />
      <circle cx="38.5" cy="39.6" r="6.1" fill="rgba(220,255,233,0.2)" />
      <circle cx="57.5" cy="39.6" r="6.1" fill="rgba(220,255,233,0.2)" />
      {blinking ? (
        <>
          <path d="M32.7 39.6h11.6" stroke="#b8ffe5" strokeLinecap="round" strokeWidth="2.6" />
          <path d="M51.7 39.6h11.6" stroke="#b8ffe5" strokeLinecap="round" strokeWidth="2.6" />
        </>
      ) : (
        <>
          <circle cx={active ? '39.8' : '38.5'} cy="39.6" r="5.1" fill="url(#athena-real-eye)" />
          <circle cx={active ? '58.8' : '57.5'} cy="39.6" r="5.1" fill="url(#athena-real-eye)" />
          <circle cx={active ? '40.3' : '39'} cy="39.5" r="2.4" fill="#02100b" />
          <circle cx={active ? '59.3' : '58'} cy="39.5" r="2.4" fill="#02100b" />
          <circle cx="41.5" cy="37" r="1.05" fill="#ffffff" opacity="0.95" />
          <circle cx="60.5" cy="37" r="1.05" fill="#ffffff" opacity="0.95" />
        </>
      )}
      <path d="M48 45.1 43.2 51.6h9.6L48 45.1Z" fill="#f4b35c" />
      <path d="M41.5 76h5.2" stroke="#f4b35c" strokeLinecap="round" strokeWidth="2.7" />
      <path d="M49.3 76h5.2" stroke="#f4b35c" strokeLinecap="round" strokeWidth="2.7" />
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
    x: -24,
    y: 360,
    tilt: 0,
    flip: 1,
    burst: 0,
    gliding: false,
    peek: false,
  });

  useEffect(() => {
    if (reduced) return undefined;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let releaseTimer: ReturnType<typeof setTimeout>;
    let lastScroll = 0;
    let lastX = -24;

    const main = document.getElementById('app-main-scroll');
    const getScrollTop = () => main?.scrollTop ?? window.scrollY;
    const getScrollMax = () => {
      if (main) return Math.max(1, main.scrollHeight - main.clientHeight);
      return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const calculateFlight = (scrollTop: number, delta: number) => {
      const viewportHeight = window.innerHeight || 720;
      const viewportWidth = window.innerWidth || 390;
      const progress = clamp(scrollTop / getScrollMax(), 0, 1);
      const low = Math.max(88, viewportHeight * 0.16);
      const high = Math.max(low + 120, viewportHeight - 212);
      const scrollY = low + progress * (high - low);
      const wave = Math.sin(progress * Math.PI * 4.2) * Math.min(110, viewportWidth * 0.24);
      const drift = Math.cos(scrollTop / 180) * 16;
      const x = Math.round(-24 - Math.abs(wave) - drift);
      const y = Math.round(clamp(scrollY + Math.sin(scrollTop / 82) * 18, low, high));
      const horizontal = x - lastX;
      const goingUp = delta < 0;
      const edgePeek = Math.abs(horizontal) > 18 || Math.abs(wave) > Math.min(82, viewportWidth * 0.18);
      lastX = x;

      const flip: 1 | -1 = horizontal < -2 ? -1 : 1;

      return {
        x,
        y,
        tilt: clamp((goingUp ? -13 : 11) + horizontal * 0.11, -22, 22),
        flip,
        peek: edgePeek,
        progress,
      };
    };

    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 150);
        scheduleBlink();
      }, 3200 + Math.random() * 3600);
    };

    const settleFlight = () => {
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(() => {
        setFlight((current) => ({
          ...current,
          tilt: current.peek ? -5 * current.flip : 0,
          gliding: false,
          peek: false,
        }));
      }, 620);
    };

    const handleScroll = () => {
      const scrollTop = getScrollTop();
      const delta = scrollTop - lastScroll;
      if (Math.abs(delta) < 1.5) return;
      lastScroll = scrollTop;
      const next = calculateFlight(scrollTop, delta);

      setFlight((current) => ({
        x: next.x,
        y: next.y,
        tilt: next.tilt,
        flip: next.flip,
        burst: current.burst + 1,
        gliding: true,
        peek: next.peek,
      }));
      settleFlight();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const width = window.innerWidth || 1;
      const zone = event.clientX / width;
      if (zone < 0.2 || zone > 0.78) {
        setFlight((current) => ({
          ...current,
          x: zone < 0.2 ? -132 : -14,
          flip: zone < 0.2 ? -1 : 1,
          tilt: zone < 0.2 ? -14 : 9,
          gliding: true,
          peek: true,
          burst: current.burst + 1,
        }));
        settleFlight();
      }
    };

    const handleResize = () => {
      const next = calculateFlight(getScrollTop(), 0);
      setFlight((current) => ({ ...current, x: next.x, y: next.y }));
    };

    lastScroll = getScrollTop();
    const initial = calculateFlight(lastScroll, 0);
    setFlight((current) => ({ ...current, x: initial.x, y: initial.y }));
    scheduleBlink();
    main?.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(releaseTimer);
      main?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [reduced]);

  if (isOpen) return null;

  const handleOpen = () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
    setRipple((value) => value + 1);
    setFlight((current) => ({
      ...current,
      y: Math.max(88, current.y - 28),
      tilt: -12,
      gliding: true,
      peek: true,
      burst: current.burst + 1,
    }));
    window.setTimeout(() => {
      setViewMode('sidebar');
      openChat('Geral');
    }, 140);
  };

  return (
    <motion.button
      type="button"
      aria-label={`Abrir ${ATHENA_CONFIG.NAME}`}
      onClick={handleOpen}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.72, x: -18, y: 460 }}
      animate={{
        opacity: flight.peek ? 0.86 : 1,
        scale: hover ? 1.08 : flight.peek ? 0.95 : 1,
        x: flight.x,
        y: flight.y,
        rotate: flight.tilt,
      }}
      transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 92, damping: 18, mass: 0.72 }}
      whileTap={{ scale: 0.9, transition: springs.snappy }}
      className="fixed right-0 top-0 z-[100] h-[5.75rem] w-[5.75rem] overflow-visible rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e0d]"
    >
      <AnimatePresence>
        {ripple > 0 && (
          <motion.span
            key={ripple}
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-full border border-primary/60"
            initial={{ scale: 0.72, opacity: 0.74 }}
            animate={{ scale: 1.88, opacity: 0 }}
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
            className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-12 rounded-full bg-primary/40 blur-sm"
            initial={{ opacity: 0.5, x: flight.flip === 1 ? -54 : 10, y: 12, scaleX: 0.35 }}
            animate={{ opacity: 0, x: flight.flip === 1 ? -118 : 68, y: 30, scaleX: 1.65 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        animate={reduced ? {} : { opacity: hover || flight.gliding ? [0.5, 0.76, 0.5] : [0.24, 0.42, 0.24] }}
        transition={{ duration: hover || flight.gliding ? 1 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(var(--hub-primary-rgb),0.4), rgba(96,245,255,0.16) 42%, transparent 74%)',
          filter: 'blur(15px)',
        }}
      />

      <motion.span
        className="relative z-10 flex h-full w-full items-center justify-center rounded-full"
        animate={{ rotateY: flight.flip === -1 ? 180 : 0, x: flight.peek ? flight.flip * 7 : 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'radial-gradient(circle at 40% 22%, rgba(255,255,255,0.16), rgba(var(--hub-primary-rgb),0.12) 34%, rgba(4,14,12,0.28) 66%, rgba(0,0,0,0.02) 100%)',
          filter: hover ? 'drop-shadow(0 0 26px rgba(var(--hub-primary-rgb),0.36))' : 'drop-shadow(0 0 18px rgba(var(--hub-primary-rgb),0.24))',
        }}
      >
        <AthenaOwl blinking={blink} active={hover || flight.gliding} gliding={flight.gliding} />
        <span className="absolute right-3 top-3 h-3 w-3 rounded-full border-2 border-[#06100d] bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
      </motion.span>
    </motion.button>
  );
}