import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router-dom';
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

type RouteMotion = {
  behind: boolean;
  pulse: number;
};

type ScrollSnapshot = {
  top: number;
  left: number;
  maxTop: number;
  maxLeft: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function AthenaOwl({ blinking, active, gliding }: { blinking: boolean; active: boolean; gliding: boolean }) {
  const leftWingMotion = gliding
    ? { rotate: [-8, 10, -5], x: [-0.8, 1.1, -0.5], y: [1.1, -2.2, 0.5] }
    : { rotate: [-1.8, 1.2, -1.4], x: [-0.18, 0.16, -0.12], y: [0.1, -0.35, 0.1] };
  const rightWingMotion = gliding
    ? { rotate: [8, -10, 5], x: [0.8, -1.1, 0.5], y: [1.1, -2.2, 0.5] }
    : { rotate: [1.8, -1.2, 1.4], x: [0.18, -0.16, 0.12], y: [0.1, -0.35, 0.1] };
  const headMotion = gliding
    ? { y: [-0.8, 0.6, -0.4], rotate: [-1.4, 1.1, -0.8] }
    : { y: [0, -0.55, 0], rotate: [-0.5, 0.55, -0.35] };
  const gazeShift = active ? 1.25 : 0;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 112 112"
      aria-hidden
      className="pointer-events-none h-full w-full select-none"
    >
      <defs>
        <radialGradient id="athena-aura-core" cx="50%" cy="42%" r="58%">
          <stop offset="0" stopColor="#eafff6" stopOpacity="0.56" />
          <stop offset="0.36" stopColor="#22f0b3" stopOpacity="0.28" />
          <stop offset="0.75" stopColor="#2dd4ff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#020806" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="athena-body-premium" x1="30" x2="77" y1="13" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f1dec0" />
          <stop offset="0.18" stopColor="#9a7656" />
          <stop offset="0.46" stopColor="#4c3425" />
          <stop offset="0.76" stopColor="#17211b" />
          <stop offset="1" stopColor="#060706" />
        </linearGradient>
        <linearGradient id="athena-body-side" x1="15" x2="94" y1="23" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#251b14" />
          <stop offset="0.42" stopColor="#75583f" />
          <stop offset="0.74" stopColor="#193027" />
          <stop offset="1" stopColor="#070908" />
        </linearGradient>
        <linearGradient id="athena-face-premium" x1="24" x2="86" y1="28" y2="61" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff8e8" />
          <stop offset="0.36" stopColor="#f3dfbd" />
          <stop offset="0.68" stopColor="#d9fff2" />
          <stop offset="1" stopColor="#40e6b1" />
        </linearGradient>
        <linearGradient id="athena-feather-stroke" x1="16" x2="94" y1="36" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d9fff1" stopOpacity="0.8" />
          <stop offset="0.44" stopColor="#46f1b9" stopOpacity="0.46" />
          <stop offset="1" stopColor="#02100c" stopOpacity="0.62" />
        </linearGradient>
        <radialGradient id="athena-eye-premium" cx="46%" cy="40%" r="64%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.22" stopColor="#d9fff3" />
          <stop offset="0.46" stopColor="#51f2bf" />
          <stop offset="0.72" stopColor="#0c8f68" />
          <stop offset="1" stopColor="#04251d" />
        </radialGradient>
        <linearGradient id="athena-beak-premium" x1="51" x2="60" y1="48" y2="61" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe7ae" />
          <stop offset="0.54" stopColor="#f0a23a" />
          <stop offset="1" stopColor="#7c3f18" />
        </linearGradient>
        <linearGradient id="athena-chest-plume" x1="37" x2="75" y1="58" y2="89" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0d8b6" stopOpacity="0.72" />
          <stop offset="0.42" stopColor="#7f5f43" stopOpacity="0.52" />
          <stop offset="1" stopColor="#06100d" stopOpacity="0.18" />
        </linearGradient>
        <filter id="athena-soft-glow" x="-55%" y="-55%" width="210%" height="210%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#00e88f" floodOpacity="0.2" />
          <feDropShadow dx="0" dy="13" stdDeviation="12" floodColor="#020807" floodOpacity="0.66" />
        </filter>
        <filter id="athena-eye-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feColorMatrix
            in="blur"
            result="glow"
            values="0 0 0 0 0.06  0 0 0 0 0.98  0 0 0 0 0.64  0 0 0 0.7 0"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="athena-feather-depth" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#120b06" floodOpacity="0.36" />
        </filter>
      </defs>

      <motion.ellipse
        cx="56"
        cy="93.5"
        rx="25"
        ry="6.2"
        fill="rgba(0,0,0,0.46)"
        animate={{ opacity: active ? 0.34 : 0.22, scaleX: active ? 0.74 : 1, y: gliding ? 1.2 : 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      />
      <motion.circle
        cx="56"
        cy="54"
        r="42"
        fill="url(#athena-aura-core)"
        animate={gliding ? { opacity: [0.54, 0.82, 0.54], scale: [0.96, 1.04, 0.98] } : { opacity: [0.28, 0.48, 0.3], scale: [0.98, 1.02, 0.99] }}
        transition={{ duration: gliding ? 1.05 : 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.g
        animate={leftWingMotion}
        transition={{ duration: gliding ? 0.92 : 2.75, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '44px 47px' }}
      >
        <path
          d="M42.6 39.7C30.1 34.8 16.8 38.9 9.4 50.7c7.8 7.1 19.4 9.4 29.4 5.5l8.7-3.4-4.9-13.1Z"
          fill="url(#athena-body-side)"
          stroke="rgba(221,255,242,0.45)"
          strokeWidth="1.35"
        />
        <path d="M15.2 51.6c7.8-1 15.3-3.6 22.7-8.4" fill="none" stroke="url(#athena-feather-stroke)" strokeLinecap="round" strokeWidth="1.55" />
        <path d="M18.7 59.7c6.8-.8 13.5-2.9 20.1-7" fill="none" stroke="rgba(3,12,9,0.45)" strokeLinecap="round" strokeWidth="1.35" />
        <path d="M25.2 66.1c5.1-1.3 9.7-3.7 14.2-7.1" fill="none" stroke="rgba(213,255,239,0.2)" strokeLinecap="round" strokeWidth="1.25" />
      </motion.g>

      <motion.g
        animate={rightWingMotion}
        transition={{ duration: gliding ? 0.92 : 2.75, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '68px 47px' }}
      >
        <path
          d="M69.4 39.7c12.5-4.9 25.8-.8 33.2 11-7.8 7.1-19.4 9.4-29.4 5.5l-8.7-3.4 4.9-13.1Z"
          fill="url(#athena-body-side)"
          stroke="rgba(221,255,242,0.45)"
          strokeWidth="1.35"
        />
        <path d="M96.8 51.6c-7.8-1-15.3-3.6-22.7-8.4" fill="none" stroke="url(#athena-feather-stroke)" strokeLinecap="round" strokeWidth="1.55" />
        <path d="M93.3 59.7c-6.8-.8-13.5-2.9-20.1-7" fill="none" stroke="rgba(3,12,9,0.45)" strokeLinecap="round" strokeWidth="1.35" />
        <path d="M86.8 66.1c-5.1-1.3-9.7-3.7-14.2-7.1" fill="none" stroke="rgba(213,255,239,0.2)" strokeLinecap="round" strokeWidth="1.25" />
      </motion.g>

      <motion.g
        filter="url(#athena-soft-glow)"
        animate={headMotion}
        transition={{ duration: gliding ? 1.18 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '56px 45px' }}
      >
        <path
          d="M35.6 27.6 31.4 12l14.9 9.2c3.1-1.2 6.4-1.8 9.7-1.8 3.5 0 6.8.6 9.9 1.8L80.7 12l-4.3 15.6c6.1 6 9.5 14.6 9.5 24.7 0 20.5-12.8 37.6-29.9 37.6S26.1 72.8 26.1 52.3c0-10.1 3.4-18.7 9.5-24.7Z"
          fill="url(#athena-body-premium)"
          stroke="rgba(255,244,218,0.5)"
          strokeWidth="1.55"
        />
        <path
          d="M34.6 35.3c5.2-8.3 14.7-8.1 21.4-1.7 6.7-6.4 16.2-6.6 21.4 1.7 5.8 9.2.5 21.7-10.4 23.4-4.7.8-8.5-.6-11-3.9-2.5 3.3-6.3 4.7-11 3.9-10.9-1.7-16.2-14.2-10.4-23.4Z"
          fill="url(#athena-face-premium)"
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="1.15"
        />
        <path d="M37.5 31.8c5.6-5.1 12.1-4.7 18.5 1.8 6.4-6.5 12.9-6.9 18.5-1.8" fill="none" stroke="rgba(255,255,255,0.38)" strokeLinecap="round" strokeWidth="1.35" />
        <path d="M39.4 60.4c4.9 4 10.4 5.9 16.6 5.9s11.7-1.9 16.6-5.9c-1.2 15.9-7.1 25.8-16.6 25.8S40.6 76.3 39.4 60.4Z" fill="url(#athena-chest-plume)" filter="url(#athena-feather-depth)" opacity="0.88" />
        <g opacity="0.72" filter="url(#athena-feather-depth)">
          <path d="M43 65.4c3.7 2.8 8 4.2 13 4.2s9.3-1.4 13-4.2" fill="none" stroke="rgba(255,238,204,0.28)" strokeLinecap="round" strokeWidth="1.2" />
          <path d="M45.8 71.3c3 2.1 6.4 3.1 10.2 3.1s7.2-1 10.2-3.1" fill="none" stroke="rgba(255,255,255,0.18)" strokeLinecap="round" strokeWidth="1.05" />
          <path d="M49.5 77.1c2 1.2 4.2 1.8 6.5 1.8s4.5-.6 6.5-1.8" fill="none" stroke="rgba(0,232,143,0.18)" strokeLinecap="round" strokeWidth="1" />
        </g>
        <path d="M37.6 39.1c4.3-3.8 9.3-4.3 14.9-1.3" fill="none" stroke="rgba(48,28,15,0.52)" strokeLinecap="round" strokeWidth="2.1" />
        <path d="M74.4 39.1c-4.3-3.8-9.3-4.3-14.9-1.3" fill="none" stroke="rgba(48,28,15,0.52)" strokeLinecap="round" strokeWidth="2.1" />
        <path d="M39.5 68.8c4 3.3 9.4 5 16.5 5s12.5-1.7 16.5-5" fill="none" stroke="rgba(221,255,242,0.62)" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M42 62.8c3.7 2.2 8.4 3.4 14 3.4s10.3-1.2 14-3.4" fill="none" stroke="rgba(8,19,15,0.28)" strokeLinecap="round" strokeWidth="1.4" />
        <path d="M48.1 73.8c1.9 1 4.5 1.5 7.9 1.5s6-.5 7.9-1.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeLinecap="round" strokeWidth="1.2" />

        <g opacity="0.78">
          <path d="M43.2 78.5c2.4-1.2 4.8-1.8 7.2-1.8" fill="none" stroke="rgba(150,255,217,0.28)" strokeLinecap="round" strokeWidth="1.05" />
          <path d="M61.6 76.7c2.4 0 4.8.6 7.2 1.8" fill="none" stroke="rgba(150,255,217,0.28)" strokeLinecap="round" strokeWidth="1.05" />
          <path d="M48.7 81.8c2.2-.8 4.6-1.2 7.3-1.2s5.1.4 7.3 1.2" fill="none" stroke="rgba(255,255,255,0.15)" strokeLinecap="round" strokeWidth="1" />
        </g>
      </motion.g>

      <motion.g
        animate={gliding ? { y: [0.4, 1.7, 0.4], rotate: [-1, 1.4, -0.8] } : { y: [0, 0.55, 0], rotate: [-0.4, 0.5, -0.3] }}
        transition={{ duration: gliding ? 0.95 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '56px 88px' }}
        opacity="0.9"
      >
        <path d="M48.8 84.5c1.6 5.8 4 9.4 7.2 10.8 3.2-1.4 5.6-5 7.2-10.8-4.6 2.1-9.8 2.1-14.4 0Z" fill="#2b2118" stroke="rgba(255,238,204,0.28)" strokeWidth="1" />
        <path d="M53.5 86.8c.4 3.2 1.2 5.8 2.5 7.6 1.3-1.8 2.1-4.4 2.5-7.6" fill="none" stroke="rgba(0,232,143,0.2)" strokeLinecap="round" strokeWidth="1" />
      </motion.g>

      <g filter="url(#athena-eye-glow)">
        <ellipse cx="45.1" cy="45.4" rx="10" ry="10.7" fill="#10130f" stroke="rgba(255,240,211,0.44)" strokeWidth="1.15" />
        <ellipse cx="66.9" cy="45.4" rx="10" ry="10.7" fill="#10130f" stroke="rgba(255,240,211,0.44)" strokeWidth="1.15" />
        <ellipse cx="45.1" cy="45.4" rx="7.3" ry="7.9" fill="rgba(0,232,143,0.18)" />
        <ellipse cx="66.9" cy="45.4" rx="7.3" ry="7.9" fill="rgba(0,232,143,0.18)" />
        {blinking ? (
          <>
            <path d="M38.7 45.2h12.8" stroke="#d7fff1" strokeLinecap="round" strokeWidth="2.8" />
            <path d="M60.5 45.2h12.8" stroke="#d7fff1" strokeLinecap="round" strokeWidth="2.8" />
          </>
        ) : (
          <>
            <circle cx={45.1 + gazeShift} cy="45.1" r="5.8" fill="url(#athena-eye-premium)" />
            <circle cx={66.9 + gazeShift} cy="45.1" r="5.8" fill="url(#athena-eye-premium)" />
            <circle cx={45.8 + gazeShift} cy="45.4" r="2.65" fill="#04100c" />
            <circle cx={67.6 + gazeShift} cy="45.4" r="2.65" fill="#04100c" />
            <circle cx={47.5 + gazeShift * 0.6} cy="42.2" r="1.18" fill="#ffffff" opacity="0.96" />
            <circle cx={69.3 + gazeShift * 0.6} cy="42.2" r="1.18" fill="#ffffff" opacity="0.96" />
            <circle cx={42.6 + gazeShift * 0.4} cy="48.8" r="0.72" fill="#ccfff0" opacity="0.6" />
            <circle cx={64.4 + gazeShift * 0.4} cy="48.8" r="0.72" fill="#ccfff0" opacity="0.6" />
          </>
        )}
      </g>

      <path d="M56 50.1 50.5 58.2h11L56 50.1Z" fill="url(#athena-beak-premium)" stroke="rgba(70,33,8,0.28)" strokeWidth="0.8" />
      <path d="M49.4 89.4c1.7 1.6 3.9 2.4 6.6 2.4s4.9-.8 6.6-2.4" fill="none" stroke="rgba(246,179,92,0.82)" strokeLinecap="round" strokeWidth="2.1" />
      <path d="M47.2 93.2h6.3" stroke="#f5b15e" strokeLinecap="round" strokeWidth="2.75" />
      <path d="M58.5 93.2h6.3" stroke="#f5b15e" strokeLinecap="round" strokeWidth="2.75" />
    </svg>
  );
}
export function FloatingAIButton() {
  const { openChat, isOpen, setViewMode } = useAIUI();
  const location = useLocation();
  const reduced = useReducedMotion() ?? false;
  const [mounted, setMounted] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [ripple, setRipple] = React.useState(0);
  const [blink, setBlink] = React.useState(false);
  const [routeMotion, setRouteMotion] = React.useState<RouteMotion>({ behind: false, pulse: 0 });
  const previousPathRef = React.useRef(location.pathname);
  const routeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [flight, setFlight] = React.useState<FlightState>({
    x: -24,
    y: typeof window === 'undefined' ? 360 : Math.round(window.innerHeight * 0.56),
    tilt: 0,
    flip: 1,
    burst: 0,
    gliding: false,
    peek: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return undefined;
    previousPathRef.current = location.pathname;

    if (routeTimerRef.current) clearTimeout(routeTimerRef.current);
    setRouteMotion((current) => ({ behind: true, pulse: current.pulse + 1 }));
    setFlight((current) => ({
      ...current,
      tilt: 0,
      gliding: false,
      peek: true,
      burst: current.burst + 1,
    }));

    routeTimerRef.current = setTimeout(() => {
      setRouteMotion((current) => ({ behind: false, pulse: current.pulse + 1 }));
      setFlight((current) => ({ ...current, peek: false }));
    }, 360);

    return undefined;
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current);
    };
  }, []);
  useEffect(() => {
    if (reduced) return undefined;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let releaseTimer: ReturnType<typeof setTimeout>;
    let rafId: number | null = null;
    let lastTop = 0;
    let lastLeft = 0;
    let lastX = -24;
    let lastY = Math.round((window.innerHeight || 720) * 0.56);

    const getMain = () => document.getElementById('app-main-scroll');
    const readScroll = (): ScrollSnapshot => {
      const main = getMain();
      const doc = document.scrollingElement ?? document.documentElement;
      const body = document.body;
      const mainTop = main?.scrollTop ?? 0;
      const docTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      const mainLeft = main?.scrollLeft ?? 0;
      const docLeft = window.scrollX || doc.scrollLeft || body.scrollLeft || 0;
      const mainMaxTop = main ? Math.max(0, main.scrollHeight - main.clientHeight) : 0;
      const docMaxTop = Math.max(0, doc.scrollHeight - window.innerHeight);
      const mainMaxLeft = main ? Math.max(0, main.scrollWidth - main.clientWidth) : 0;
      const docMaxLeft = Math.max(0, doc.scrollWidth - window.innerWidth);

      return {
        top: Math.abs(mainTop) > Math.abs(docTop) ? mainTop : docTop,
        left: Math.abs(mainLeft) > Math.abs(docLeft) ? mainLeft : docLeft,
        maxTop: Math.max(1, mainMaxTop, docMaxTop),
        maxLeft: Math.max(1, mainMaxLeft, docMaxLeft),
      };
    };

    const calculateFlight = (snapshot: ScrollSnapshot, deltaTop: number, deltaLeft: number) => {
      const viewportHeight = window.innerHeight || 720;
      const viewportWidth = window.innerWidth || 390;
      const progressY = clamp(snapshot.top / snapshot.maxTop, 0, 1);
      const progressX = clamp(snapshot.left / snapshot.maxLeft, 0, 1);
      const upper = Math.max(54, viewportHeight * 0.075);
      const lower = Math.max(upper + 330, viewportHeight - 64);
      const mappedY = upper + progressY * (lower - upper);
      const directY = lastY + deltaTop * 4.6;
      const y = Math.round(clamp(Math.abs(deltaTop) > 0.05 ? directY : mappedY, upper, lower));
      const maxSideTravel = Math.min(210, viewportWidth * 0.54);
      const sideWave = Math.sin(progressY * Math.PI * 3.4) * Math.min(42, viewportWidth * 0.1);
      const mappedX = -18 - Math.abs(sideWave) - progressX * Math.min(132, viewportWidth * 0.3);
      const directX = lastX - deltaLeft * 1.8;
      const x = Math.round(clamp(Math.abs(deltaLeft) > 0.05 ? directX : mappedX, -maxSideTravel, -10));
      const horizontal = x - lastX;
      const vertical = y - lastY;
      const strongMotion = Math.abs(deltaTop) > 0.5 || Math.abs(deltaLeft) > 0.5;
      lastX = x;
      lastY = y;

      const flip: 1 | -1 = horizontal < -1 ? -1 : 1;

      return {
        x,
        y,
        tilt: clamp(vertical * 0.16 + horizontal * 0.08, -24, 24),
        flip,
        peek: strongMotion,
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
          tilt: 0,
          gliding: false,
          peek: false,
        }));
      }, 420);
    };

    const syncToScroll = () => {
      rafId = null;
      const snapshot = readScroll();
      const deltaTop = snapshot.top - lastTop;
      const deltaLeft = snapshot.left - lastLeft;
      lastTop = snapshot.top;
      lastLeft = snapshot.left;
      const next = calculateFlight(snapshot, deltaTop, deltaLeft);
      const activeMotion = Math.abs(deltaTop) > 0.1 || Math.abs(deltaLeft) > 0.1;

      setFlight((current) => ({
        x: next.x,
        y: next.y,
        tilt: activeMotion ? next.tilt : current.tilt,
        flip: next.flip,
        burst: activeMotion ? current.burst + 1 : current.burst,
        gliding: activeMotion,
        peek: next.peek,
      }));
      if (activeMotion) settleFlight();
    };

    const requestSync = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(syncToScroll);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const width = window.innerWidth || 1;
      const zone = event.clientX / width;
      if (zone < 0.18 || zone > 0.82) {
        setFlight((current) => ({
          ...current,
          x: zone < 0.18 ? -154 : -14,
          flip: zone < 0.18 ? -1 : 1,
          tilt: zone < 0.18 ? -12 : 8,
          gliding: true,
          peek: true,
          burst: current.burst + 1,
        }));
        settleFlight();
      }
    };

    const handleResize = () => {
      lastY = Math.round((window.innerHeight || 720) * 0.56);
      requestSync();
    };

    const initial = readScroll();
    lastTop = initial.top;
    lastLeft = initial.left;
    const initialFlight = calculateFlight(initial, 0, 0);
    setFlight((current) => ({ ...current, x: initialFlight.x, y: initialFlight.y }));
    scheduleBlink();

    const main = getMain();
    const visualViewport = window.visualViewport;
    main?.addEventListener('scroll', requestSync, { passive: true });
    document.addEventListener('scroll', requestSync, { passive: true, capture: true });
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('wheel', requestSync, { passive: true });
    window.addEventListener('touchmove', requestSync, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    visualViewport?.addEventListener('scroll', requestSync, { passive: true });
    visualViewport?.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(releaseTimer);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      main?.removeEventListener('scroll', requestSync);
      document.removeEventListener('scroll', requestSync, true);
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('wheel', requestSync);
      window.removeEventListener('touchmove', requestSync);
      window.removeEventListener('resize', handleResize);
      visualViewport?.removeEventListener('scroll', requestSync);
      visualViewport?.removeEventListener('resize', handleResize);
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

  const button = (
    <motion.button
      type="button"
      aria-label={`Abrir ${ATHENA_CONFIG.NAME}`}
      onClick={handleOpen}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.72, x: -18, y: 460 }}
      animate={{
        opacity: routeMotion.behind ? 0.42 : flight.peek ? 0.9 : 1,
        scale: routeMotion.behind ? 0.64 : hover ? 1.06 : flight.peek ? 0.96 : 1,
        x: flight.x,
        y: flight.y - (routeMotion.behind ? 34 : 0),
        rotate: routeMotion.behind ? -4 : flight.tilt,
      }}
      transition={reduced ? { duration: 0.08 } : { type: 'spring', stiffness: 230, damping: 24, mass: 0.42 }}
      whileTap={{ scale: 0.9, transition: springs.snappy }}
      className="athena-floating-button fixed right-0 top-0 z-[100] h-[6.65rem] w-[6.65rem] overflow-visible rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e0d] max-[380px]:h-[6.15rem] max-[380px]:w-[6.15rem]"
    >
      <AnimatePresence>
        {ripple > 0 && (
          <motion.span
            key={ripple}
            aria-hidden
            className="pointer-events-none absolute inset-1 rounded-full border border-primary/70 shadow-[0_0_20px_rgba(var(--hub-primary-rgb),0.24)]"
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
            className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-16 rounded-full bg-gradient-to-r from-transparent via-primary/60 to-transparent blur-md"
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
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-full border border-white/15 shadow-[inset_0_0_22px_rgba(var(--hub-primary-rgb),0.16),0_0_24px_rgba(0,245,174,0.12)]"
        animate={reduced ? {} : { scale: hover || flight.gliding ? [0.97, 1.04, 0.98] : [0.98, 1.01, 0.99], opacity: hover || flight.gliding ? [0.72, 0.96, 0.74] : [0.38, 0.58, 0.4] }}
        transition={{ duration: hover || flight.gliding ? 1.05 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-[1.05rem] rounded-full border border-primary/20 border-t-white/45 border-r-cyan-200/30"
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: hover || flight.gliding ? 3.8 : 7.5, repeat: Infinity, ease: 'linear' }}
      />

      <motion.span
        className="athena-owl-shell relative z-10 flex h-full w-full items-center justify-center rounded-full p-[0.12rem]"
        animate={{
          rotateY: routeMotion.behind ? 180 : flight.flip === -1 ? 180 : 0,
          x: routeMotion.behind ? 0 : flight.peek ? flight.flip * 7 : 0,
          y: routeMotion.behind ? -12 : 0,
          scale: routeMotion.behind ? 0.84 : 1,
        }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transformPerspective: 760,
          background:
            'radial-gradient(circle at 42% 24%, rgba(255,244,218,0.24), rgba(var(--hub-primary-rgb),0.12) 30%, rgba(34,21,13,0.12) 58%, rgba(0,0,0,0.01) 100%)',
          filter: routeMotion.behind
            ? 'blur(1.6px) drop-shadow(0 0 8px rgba(var(--hub-primary-rgb),0.16))'
            : hover
              ? 'drop-shadow(0 0 32px rgba(var(--hub-primary-rgb),0.42)) drop-shadow(0 16px 28px rgba(0,0,0,0.34))'
              : 'drop-shadow(0 0 21px rgba(var(--hub-primary-rgb),0.28)) drop-shadow(0 12px 22px rgba(0,0,0,0.28))',
        }}
      >
        <AthenaOwl blinking={blink} active={hover || flight.gliding} gliding={flight.gliding} />
        <span className="absolute right-[1.05rem] top-[1.18rem] h-2.5 w-2.5 rounded-full border-2 border-[#06100d] bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.82)]" />
      </motion.span>
    </motion.button>
  );

  if (typeof document === 'undefined' || !mounted) return button;
  return createPortal(button, document.body);
}
