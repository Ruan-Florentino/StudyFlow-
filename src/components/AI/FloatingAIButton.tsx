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
        width: '55%',
        height: '55%',
        filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.55))',
        transform: hover ? 'rotate(-4deg) scale(1.08)' : 'rotate(0deg) scale(1)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        willChange: 'transform',
      }}
    >
      {/* Corpo */}
      <g id="body">
        <ellipse cx="32" cy="40" rx="16" ry="18" fill="#3d2314" />
        <ellipse cx="32" cy="40" rx="12" ry="14" fill="#c8825e" />
        {/* Penas do peito */}
        <ellipse cx="32" cy="44" rx="9" ry="10" fill="#e8a07a" opacity="0.55" />
        {/* Asas */}
        <ellipse
          cx="18"
          cy="40"
          rx="7"
          ry="12"
          fill="#2b1a10"
          style={{
            transform: hover ? 'rotate(-8deg) translateY(-2px)' : 'none',
            transformOrigin: '18px 34px',
            transition: 'transform 0.4s ease',
          }}
        />
        <ellipse
          cx="46"
          cy="40"
          rx="7"
          ry="12"
          fill="#2b1a10"
          style={{
            transform: hover ? 'rotate(8deg) translateY(-2px)' : 'none',
            transformOrigin: '46px 34px',
            transition: 'transform 0.4s ease',
          }}
        />
      </g>

      {/* Cabeça */}
      <g id="head">
        <circle cx="32" cy="24" r="15" fill="#3d2314" />
        <circle cx="32" cy="24" r="11" fill="#c8825e" />
        {/* Orelhas */}
        <polygon points="20,13 16,4 25,11" fill="#2b1a10" />
        <polygon points="44,13 48,4 39,11" fill="#2b1a10" />
      </g>

      {/* Olhos — piscam via clipPath height */}
      <g id="eyes">
        {/* órbita esquerda */}
        <circle cx="25" cy="23" r="6" fill="#f0f0f0" />
        <circle cx="47" cy="23" r="6" fill="#f0f0f0" />
        {/* iris */}
        <circle cx="25" cy="23" r="3.8" fill="#00c96a" />
        <circle cx="47" cy="23" r="3.8" fill="#00c96a" />
        {/* pupila */}
        <circle cx="25.6" cy="22.4" r="2.2" fill="#0a0e0d" />
        <circle cx="47.6" cy="22.4" r="2.2" fill="#0a0e0d" />
        {/* brilho */}
        <circle cx="26.5" cy="21.5" r="0.8" fill="white" />
        <circle cx="48.5" cy="21.5" r="0.8" fill="white" />
        {/* Pálpebras (piscada) */}
        {blinking && (
          <>
            <rect x="18.5" y="17.5" width="13" height="11" rx="5" fill="#c8825e" />
            <rect x="40.5" y="17.5" width="13" height="11" rx="5" fill="#c8825e" />
          </>
        )}
      </g>

      {/* Bico */}
      <g id="beak">
        <polygon points="32,27 29,31 35,31" fill="#e8944a" />
      </g>

      {/* Patas */}
      <g id="feet" opacity="0.7">
        <rect x="25" y="56" width="5" height="3" rx="1.5" fill="#e8944a" />
        <rect x="34" y="56" width="5" height="3" rx="1.5" fill="#e8944a" />
      </g>
    </svg>
  );
}

/* ─── Partículas orbitando ──────────────────────────────────────────────── */
const PARTICLES = [
  { delay: 0,   size: 3,   orbit: 42, speed: 6,  color: 'rgba(0,255,136,0.8)' },
  { delay: 1.2, size: 2,   orbit: 36, speed: 8,  color: 'rgba(0,255,200,0.6)' },
  { delay: 2.4, size: 2.5, orbit: 46, speed: 10, color: 'rgba(100,255,200,0.7)' },
  { delay: 0.8, size: 2,   orbit: 39, speed: 7,  color: 'rgba(0,200,255,0.5)' },
  { delay: 3,   size: 1.5, orbit: 44, speed: 9,  color: 'rgba(180,255,200,0.4)' },
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

  const SIZE = 66; // px

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
          right: 16,
          bottom: 'calc(5.85rem + env(safe-area-inset-bottom, 0px))',
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
                rgba(120,80,255,0.3) 50%,
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
            background: 'radial-gradient(circle, rgba(0,255,136,0.35) 0%, transparent 70%)',
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
              ? `conic-gradient(from 90deg, #00ff88, #00e5cc, #4f46e5, #00ff88)`
              : `conic-gradient(from 90deg, #00cc6a, #00a888, #2d8a5e, #00cc6a)`,
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
            background: `radial-gradient(circle at 38% 30%, rgba(255,255,255,0.18) 0%, rgba(10,20,16,0.92) 60%, rgba(0,20,12,0.98) 100%)`,
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
