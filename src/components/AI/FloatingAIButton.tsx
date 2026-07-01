/**
 * FloatingAIButton — ATHENA V3 "Orb Cinematográfico"
 *
 * Camadas (de fora pra dentro):
 *  1. Conic-gradient rotativo  → aura holográfica giratória
 *  2. Halo pulse               → respiração suave
 *  3. Partículas orbitando     → 5 dots com mix-blend-mode: screen
 *  4. Anel de borda iridescente
 *  5. Disco glassmorphism      → backdrop-blur + gradiente
 *  6. SVG coruja inline        → permite animar olhos / asas
 *  7. Badge "online" premium
 *  8. Tooltip spring
 *
 * Performance: só transform + opacity (GPU). Nada de top/left animados.
 * a11y: aria-label, focus-visible, prefers-reduced-motion respeitado.
 */

import React, { useEffect, useReducer, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, useReducedMotion } from 'motion/react';
import { useAIUI } from '../../hooks/useAIUI';
import { ATHENA_CONFIG } from '../../features/athena/constants/config';
import { springs } from '../../lib/animations/easings';

/* ─── Coruja SVG inline ─────────────────────────────────────────────────── */
function OwlSVG({ blinking, hover }: { blinking: boolean; hover: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      aria-hidden
      className="pointer-events-none select-none"
      style={{
        width: '68%',
        height: '68%',
        filter: hover
          ? 'drop-shadow(0 0 12px rgba(0,255,168,0.72)) drop-shadow(0 8px 16px rgba(0,0,0,0.45))'
          : 'drop-shadow(0 0 9px rgba(0,255,168,0.48)) drop-shadow(0 6px 12px rgba(0,0,0,0.38))',
        transform: hover ? 'rotate(-3deg) translateY(-1px) scale(1.08)' : 'rotate(0deg) translateY(0) scale(1)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        willChange: 'transform',
      }}
    >
      <defs>
        <linearGradient id="athena-owl-body" x1="12" x2="52" y1="10" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#244238" />
          <stop offset="0.45" stopColor="#10231d" />
          <stop offset="1" stopColor="#060b09" />
        </linearGradient>
        <linearGradient id="athena-owl-face" x1="18" x2="46" y1="14" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f8fff7" />
          <stop offset="0.55" stopColor="#bfffe4" />
          <stop offset="1" stopColor="#5fffc0" />
        </linearGradient>
        <radialGradient id="athena-eye-glow" cx="50%" cy="45%" r="58%">
          <stop offset="0" stopColor="#f8fff7" />
          <stop offset="0.44" stopColor="#8dffd6" />
          <stop offset="1" stopColor="#00e88f" />
        </radialGradient>
        <filter id="athena-owl-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feColorMatrix
            in="blur"
            result="glow"
            values="0 0 0 0 0  0 0 0 0 0.92  0 0 0 0 0.56  0 0 0 0.75 0"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#athena-owl-soft-glow)">
        <path
          d="M18.8 17.7 15.5 7.8 26.2 13a21 21 0 0 1 11.6 0l10.7-5.2-3.3 9.9c4 3.5 6.4 8.9 6.4 15.4 0 13.6-8.2 24.2-19.6 24.2S12.4 46.7 12.4 33.1c0-6.5 2.4-11.9 6.4-15.4Z"
          fill="url(#athena-owl-body)"
          stroke="rgba(174,255,220,0.42)"
          strokeWidth="1.35"
        />
        <path
          d="M20.8 22.2c3.3-4.5 9-4.6 11.2-.6 2.2-4 7.9-3.9 11.2.6 3.5 4.8.6 12.2-5.2 13.3-2.6.5-4.8-.4-6-2.2-1.2 1.8-3.4 2.7-6 2.2-5.8-1.1-8.7-8.5-5.2-13.3Z"
          fill="url(#athena-owl-face)"
          opacity="0.95"
        />
        <path
          d="M23.1 42.7c2.2 2.4 5.1 3.6 8.9 3.6s6.7-1.2 8.9-3.6"
          fill="none"
          stroke="rgba(191,255,228,0.5)"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path d="M18.4 31.5c-2.5 4.7-2 10.2 1.7 15.5" fill="none" stroke="rgba(255,255,255,0.16)" strokeLinecap="round" strokeWidth="2" />
        <path d="M45.6 31.5c2.5 4.7 2 10.2-1.7 15.5" fill="none" stroke="rgba(255,255,255,0.16)" strokeLinecap="round" strokeWidth="2" />
      </g>

      <g
        style={{
          transform: hover ? 'translateY(-1px)' : 'translateY(0)',
          transition: 'transform 0.28s ease',
        }}
      >
        <circle cx="25.2" cy="26.6" r="6.2" fill="#07110d" />
        <circle cx="38.8" cy="26.6" r="6.2" fill="#07110d" />
        {!blinking ? (
          <>
            <circle cx="25.2" cy="26.6" r="4.25" fill="url(#athena-eye-glow)" />
            <circle cx="38.8" cy="26.6" r="4.25" fill="url(#athena-eye-glow)" />
            <circle cx={hover ? '26' : '25.2'} cy="26.3" r="2.05" fill="#02100b" />
            <circle cx={hover ? '39.6' : '38.8'} cy="26.3" r="2.05" fill="#02100b" />
            <circle cx="26.9" cy="24.8" r="0.95" fill="#ffffff" opacity="0.95" />
            <circle cx="40.5" cy="24.8" r="0.95" fill="#ffffff" opacity="0.95" />
          </>
        ) : (
          <>
            <path d="M20.8 26.6h8.8" stroke="#9fffe0" strokeLinecap="round" strokeWidth="2.2" />
            <path d="M34.4 26.6h8.8" stroke="#9fffe0" strokeLinecap="round" strokeWidth="2.2" />
          </>
        )}
        <path d="M32 29.7 28.8 34h6.4L32 29.7Z" fill="#f7b955" />
        <path d="M29.1 39.1c1.7.9 4.1.9 5.8 0" fill="none" stroke="#9fffe0" strokeLinecap="round" strokeWidth="1.3" opacity="0.45" />
      </g>

      <g opacity="0.72">
        <path d="M25.4 55.5h5.2" stroke="#f7b955" strokeLinecap="round" strokeWidth="2.4" />
        <path d="M33.4 55.5h5.2" stroke="#f7b955" strokeLinecap="round" strokeWidth="2.4" />
      </g>
    </svg>
  );
}
const PARTICLES = [
  { delay: 0,   size: 3,   orbit: 44, speed: 6,  color: 'rgba(0,255,168,0.82)' },
  { delay: 1.2, size: 2,   orbit: 38, speed: 8,  color: 'rgba(96,245,255,0.62)' },
  { delay: 2.4, size: 2.5, orbit: 48, speed: 10, color: 'rgba(167,139,250,0.58)' },
  { delay: 0.8, size: 2,   orbit: 41, speed: 7,  color: 'rgba(0,220,255,0.52)' },
  { delay: 3,   size: 1.5, orbit: 46, speed: 9,  color: 'rgba(248,198,109,0.42)' },
];

function OrbitingParticle({
  size, orbit, speed, color, delay, reduced
}: { size: number; orbit: number; speed: number; color: string; delay: number; reduced: boolean }) {
  if (reduced) return null;
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        mixBlendMode: 'screen',
        boxShadow: `0 0 ${size * 4}px ${color}`,
        top: '50%',
        left: '50%',
        x: '-50%',
        y: '-50%',
      }}
      animate={{
        rotate: [0, 360],
        x: [
          `calc(-50% + ${orbit}px)`,
          `calc(-50% + ${Math.cos(Math.PI / 2) * orbit}px)`,
          `calc(-50% - ${orbit}px)`,
          `calc(-50% + ${Math.cos((3 * Math.PI) / 2) * orbit}px)`,
          `calc(-50% + ${orbit}px)`,
        ],
        y: [
          `calc(-50%)`,
          `calc(-50% - ${orbit}px)`,
          `calc(-50%)`,
          `calc(-50% + ${orbit}px)`,
          `calc(-50%)`,
        ],
      }}
      transition={{
        duration: speed,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

/* ─── Tooltip ───────────────────────────────────────────────────────────── */
function Tooltip({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={springs.soft}
          className="pointer-events-none absolute bottom-full mb-3 right-0 whitespace-nowrap rounded-xl border border-white/10 bg-black/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary shadow-[0_0_16px_rgba(0,255,136,0.2)] backdrop-blur-md"
        >
          {ATHENA_CONFIG.NAME} ✦
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ─── Ripple ao clicar ──────────────────────────────────────────────────── */
function Ripple({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.span
          key={trigger}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
          initial={{ scale: 0.85, opacity: 0.8 }}
          animate={{ scale: 2.2, opacity: 0 }}
          exit={{}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
  );
}

/* ─── Conic gradient rotativo (CSS puro via keyframe inline) ────────────── */
const CONIC_KEYFRAMES = `
@keyframes athena-conic-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes athena-halo-pulse {
  0%,100% { opacity:.28; transform:scale(0.94); }
  50%      { opacity:.58; transform:scale(1.08); }
}
@keyframes athena-orb-breathe {
  0%,100% { transform:scale(1); }
  50%      { transform:scale(1.03); }
}
`;

/* ══════════════════════════════════════════════════════════════════════════ */
/*  COMPONENTE PRINCIPAL                                                     */
/* ══════════════════════════════════════════════════════════════════════════ */
export function FloatingAIButton() {
  const { openChat, isOpen, setViewMode } = useAIUI();
  const reduced = useReducedMotion() ?? false;

  /* Estado local */
  const [hover, setHover] = React.useState(false);
  const [ripple, setRipple] = React.useState(0);
  const [blink, setBlink] = React.useState(false);

  /* Piscada aleatória */
  useEffect(() => {
    if (reduced) return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 5000 + Math.random() * 6000;
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 160);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(t);
  }, [reduced]);

  if (isOpen) return null;

  const handleOpen = () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
    setRipple(r => r + 1);
    setTimeout(() => {
      setViewMode('sidebar');
      openChat('Geral');
    }, 120);
  };

  const SIZE = 72; // px

  return (
    <>
      {/* Inject keyframes */}
      <style>{CONIC_KEYFRAMES}</style>

      <motion.button
        type="button"
        aria-label={`Abrir ${ATHENA_CONFIG.NAME}`}
        onClick={handleOpen}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springs.bouncy, delay: 0.15 }}
        whileTap={{ scale: 0.88, transition: springs.snappy }}
        className="fixed z-[100] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e0d]"
        style={{
          right: 18,
          bottom: 'calc(6.05rem + env(safe-area-inset-bottom, 0px))',
          width: SIZE,
          height: SIZE,
        }}
      >
        {/* ── Tooltip ─────────────────────────────────────── */}
        <Tooltip visible={hover} />

        {/* ── Ripple ──────────────────────────────────────── */}
        <Ripple trigger={ripple} />

        {/* ── Conic-gradient giratório (aurora boreal) ────── */}
        {!reduced && (
          <span
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              inset: -10,
              background: `conic-gradient(
                from 0deg,
                rgba(0,255,136,0)    0%,
                rgba(0,255,200,0.6) 20%,
                rgba(0,200,255,0.4) 35%,
                rgba(167,139,250,0.38) 50%,
                rgba(0,255,136,0.5) 70%,
                rgba(0,255,136,0)   100%
              )`,
              borderRadius: '50%',
              animation: `athena-conic-spin ${reduced ? '0s' : '8s'} linear infinite`,
              willChange: 'transform',
              opacity: hover ? 0.9 : 0.55,
              transition: 'opacity 0.4s ease',
              filter: 'blur(2px)',
            }}
          />
        )}

        {/* ── Halo pulse ──────────────────────────────────── */}
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: -8,
            background: 'radial-gradient(circle, rgba(0,240,168,0.38) 0%, rgba(96,245,255,0.1) 38%, transparent 72%)',
            animation: reduced ? 'none' : `athena-halo-pulse ${hover ? '1.6s' : '3.2s'} ease-in-out infinite`,
            willChange: 'opacity, transform',
            filter: 'blur(6px)',
          }}
        />

        {/* ── Partículas orbitando ─────────────────────────── */}
        {PARTICLES.map((p, i) => (
          <OrbitingParticle key={i} {...p} reduced={reduced} />
        ))}

        {/* ── Anel iridescente (borda gradient) ───────────── */}
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-full transition-all duration-300"
          style={{
            inset: -2,
            padding: 2,
            background: hover
              ? `conic-gradient(from 90deg, #00f0a8, #60f5ff, #a78bfa, #f8c66d, #00f0a8)`
              : `conic-gradient(from 90deg, #00c985, #14b8a6, #4f46e5, #00c985)`,
            borderRadius: '50%',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            opacity: hover ? 1 : 0.7,
            boxShadow: hover
              ? '0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,200,255,0.2)'
              : '0 0 12px rgba(0,255,136,0.25)',
          }}
        />

        {/* ── Disco central (glassmorphism) ────────────────── */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 34% 24%, rgba(255,255,255,0.24) 0%, rgba(53,255,188,0.16) 28%, rgba(8,20,18,0.94) 64%, rgba(2,8,7,0.99) 100%)`,
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            boxShadow: hover
              ? 'inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.4), 0 0 32px rgba(0,255,136,0.35)'
              : 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.3)',
            animation: reduced ? 'none' : `athena-orb-breathe 4s ease-in-out infinite`,
            willChange: 'transform',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'box-shadow 0.35s ease',
          }}
        />

        {/* ── Coruja SVG ──────────────────────────────────── */}
        <span
          className="relative z-10 flex h-full w-full items-center justify-center"
          aria-hidden
        >
          <OwlSVG blinking={blink} hover={hover} />
        </span>

        {/* ── Badge online ─────────────────────────────────── */}
        <motion.span
          aria-hidden
          className="absolute right-[8%] top-[8%] z-20 flex h-3 w-3 items-center justify-center rounded-full"
          animate={reduced ? {} : {
            scale: [1, 1.25, 1],
            boxShadow: [
              '0 0 6px rgba(52,211,153,0.8)',
              '0 0 14px rgba(52,211,153,1)',
              '0 0 6px rgba(52,211,153,0.8)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            border: '2px solid #0a0e0d',
          }}
        />
      </motion.button>
    </>
  );
}
