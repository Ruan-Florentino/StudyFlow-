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
  energy: number;
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
const smoothstep = (value: number) => value * value * (3 - 2 * value);
const isMobileMotionViewport = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);

const readPageScroll = (): ScrollSnapshot => {
  const main = document.getElementById('app-main-scroll');
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

const getFlightBounds = () => {
  const viewportWidth = window.innerWidth || 390;
  const viewportHeight = window.innerHeight || 720;
  const buttonSize = viewportWidth <= 430 ? 96 : 106;
  const bottomInset = viewportWidth < 768 ? 124 : 76;
  const availableBottom = Math.max(96, viewportHeight - buttonSize - bottomInset);
  const upper = Math.min(availableBottom, Math.max(86, viewportHeight * 0.16));

  return {
    viewportWidth,
    viewportHeight,
    buttonSize,
    upper,
    lower: Math.max(upper + 96, availableBottom),
    minX: -(viewportWidth - buttonSize - 12),
    maxX: viewportWidth < 768 ? 18 : -8,
  };
};

const getFlightTarget = (snapshot: ScrollSnapshot, manualOffset: { x: number; y: number }) => {
  const bounds = getFlightBounds();
  const mobileFollowRange = Math.max(1, bounds.viewportHeight * 1.8);
  const progressY = bounds.viewportWidth < 768
    ? clamp(snapshot.top / mobileFollowRange, 0, 1)
    : clamp(snapshot.top / snapshot.maxTop, 0, 1);
  const progressX = clamp(snapshot.left / snapshot.maxLeft, 0, 1);
  const easedY = smoothstep(progressY);
  const sideWave = Math.sin(progressY * Math.PI * 2.25) * Math.min(24, bounds.viewportWidth * 0.055);
  const baseY = bounds.upper + easedY * (bounds.lower - bounds.upper);
  const baseX = (bounds.viewportWidth < 768 ? 12 : -18)
    - progressX * Math.min(132, bounds.viewportWidth * 0.32)
    + sideWave;

  return {
    x: clamp(baseX + manualOffset.x, bounds.minX, bounds.maxX),
    y: clamp(baseY + manualOffset.y, bounds.upper, bounds.lower),
    bounds,
  };
};

function AthenaOwl({
  blinking,
  active,
  gliding,
  intensity,
  lite,
}: {
  blinking: boolean;
  active: boolean;
  gliding: boolean;
  intensity: number;
  lite: boolean;
}) {
  const alert = active || gliding;
  const flightEnergy = clamp(intensity, 0, 1);
  const wingDuration = lite
    ? gliding ? 0.68 + (1 - flightEnergy) * 0.18 : 3.35
    : gliding ? 0.42 + (1 - flightEnergy) * 0.2 : 2.95;
  const bodyDuration = lite
    ? gliding ? 1.05 + (1 - flightEnergy) * 0.18 : 3.6
    : gliding ? 0.72 + (1 - flightEnergy) * 0.22 : 3.25;
  const featherEase: [number, number, number, number] = [0.36, 0, 0.2, 1];
  const leftWingMotion = gliding
    ? lite
      ? { rotate: [-16, 8, -12, 5, -15], x: [-1.6, 0.7, -0.9, 0.4, -1.4], y: [1.4, -2.6, 0.4, -1.4, 1.2], scaleX: [1.02, 0.96, 1.01, 0.98, 1.02], scaleY: [0.98, 1.04, 0.99, 1.02, 0.98] }
      : { rotate: [-26, 15, -19, 9, -24], x: [-2.8, 1.4, -1.8, 0.9, -2.5], y: [2.6, -5.2, 0.7, -2.8, 2.2], scaleX: [1.04, 0.9, 1.02, 0.95, 1.04], scaleY: [0.95, 1.08, 0.98, 1.03, 0.96] }
    : { rotate: [-2, 0.9, -1.5], x: [-0.14, 0.12, -0.1], y: [0.08, -0.34, 0.08], scaleX: [1, 0.995, 1], scaleY: [1, 1.006, 1] };
  const rightWingMotion = gliding
    ? lite
      ? { rotate: [16, -8, 12, -5, 15], x: [1.6, -0.7, 0.9, -0.4, 1.4], y: [1.4, -2.6, 0.4, -1.4, 1.2], scaleX: [1.02, 0.96, 1.01, 0.98, 1.02], scaleY: [0.98, 1.04, 0.99, 1.02, 0.98] }
      : { rotate: [26, -15, 19, -9, 24], x: [2.8, -1.4, 1.8, -0.9, 2.5], y: [2.6, -5.2, 0.7, -2.8, 2.2], scaleX: [1.04, 0.9, 1.02, 0.95, 1.04], scaleY: [0.95, 1.08, 0.98, 1.03, 0.96] }
    : { rotate: [2, -0.9, 1.5], x: [0.14, -0.12, 0.1], y: [0.08, -0.34, 0.08], scaleX: [1, 0.995, 1], scaleY: [1, 1.006, 1] };
  const headMotion = gliding
    ? lite
      ? { y: [-0.9, 0.34, -0.56, 0.1], rotate: [-1.1, 0.45, -0.72, 0.18] }
      : { y: [-1.9, 0.65, -1.25, 0.15], rotate: [-2.9, 1, -1.9, 0.5] }
    : { y: [0, -0.46, 0], rotate: [-0.36, 0.42, -0.24] };
  const gazeShift = lite ? (alert ? 0.62 + flightEnergy * 0.55 : 0.18) : (alert ? 1.15 + flightEnergy * 1.25 : 0.25);
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
          <stop offset="0" stopColor="#eefcff" />
          <stop offset="0.16" stopColor="#8fc6d7" />
          <stop offset="0.38" stopColor="#6b4a35" />
          <stop offset="0.7" stopColor="#1b2d35" />
          <stop offset="1" stopColor="#030608" />
        </linearGradient>
        <linearGradient id="athena-body-side" x1="15" x2="94" y1="23" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#141b20" />
          <stop offset="0.34" stopColor="#6f523c" />
          <stop offset="0.68" stopColor="#214759" />
          <stop offset="1" stopColor="#06080a" />
        </linearGradient>
        <linearGradient id="athena-face-premium" x1="24" x2="86" y1="28" y2="61" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.32" stopColor="#d8f7ff" />
          <stop offset="0.68" stopColor="#73f7ff" />
          <stop offset="1" stopColor="#12b7c8" />
        </linearGradient>
        <linearGradient id="athena-feather-stroke" x1="16" x2="94" y1="36" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e7fbff" stopOpacity="0.86" />
          <stop offset="0.46" stopColor="#46d9ff" stopOpacity="0.52" />
          <stop offset="1" stopColor="#021019" stopOpacity="0.68" />
        </linearGradient>
        <radialGradient id="athena-eye-premium" cx="46%" cy="40%" r="64%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.2" stopColor="#c9fbff" />
          <stop offset="0.42" stopColor="#57e7ff" />
          <stop offset="0.68" stopColor="#1686ff" />
          <stop offset="1" stopColor="#03182f" />
        </radialGradient>
        <radialGradient id="athena-eye-ring" cx="48%" cy="42%" r="58%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="0.34" stopColor="#7ff8ff" stopOpacity="0.72" />
          <stop offset="0.68" stopColor="#00d4ff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#00395e" stopOpacity="0.18" />
        </radialGradient>
        <linearGradient id="athena-plume-rim" x1="38" x2="74" y1="55" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff3d8" stopOpacity="0.5" />
          <stop offset="0.42" stopColor="#54f2ff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#00e88f" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="athena-beak-premium" x1="51" x2="60" y1="48" y2="61" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe7ae" />
          <stop offset="0.54" stopColor="#f0a23a" />
          <stop offset="1" stopColor="#7c3f18" />
        </linearGradient>
        <linearGradient id="athena-chest-plume" x1="37" x2="75" y1="58" y2="89" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d8fbff" stopOpacity="0.74" />
          <stop offset="0.46" stopColor="#7f6046" stopOpacity="0.54" />
          <stop offset="1" stopColor="#041018" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="athena-tech-cyan" x1="42" x2="72" y1="58" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e7fbff" />
          <stop offset="0.42" stopColor="#3ee7ff" />
          <stop offset="1" stopColor="#1377ff" />
        </linearGradient>
        <linearGradient id="athena-shield-glass" x1="43" x2="72" y1="58" y2="87" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#bdfcff" stopOpacity="0.34" />
          <stop offset="0.48" stopColor="#02d4ff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#071422" stopOpacity="0.56" />
        </linearGradient>
        <filter id="athena-soft-glow" x="-55%" y="-55%" width="210%" height="210%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#41dfff" floodOpacity="0.24" />
          <feDropShadow dx="0" dy="0" stdDeviation="2.8" floodColor="#00e88f" floodOpacity="0.14" />
          <feDropShadow dx="0" dy="13" stdDeviation="12" floodColor="#020807" floodOpacity="0.66" />
        </filter>
        <filter id="athena-eye-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feColorMatrix
            in="blur"
            result="glow"
            values="0 0 0 0 0.08  0 0 0 0 0.78  0 0 0 0 1  0 0 0 0.76 0"
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
      {lite ? (
        <circle cx="56" cy="54" r="42" fill="url(#athena-aura-core)" opacity={gliding ? 0.42 : 0.28} />
      ) : (
        <motion.circle
          cx="56"
          cy="54"
          r="42"
          fill="url(#athena-aura-core)"
          animate={gliding ? { opacity: [0.54, 0.82, 0.54], scale: [0.96, 1.04, 0.98] } : { opacity: [0.28, 0.48, 0.3], scale: [0.98, 1.02, 0.99] }}
          transition={{ duration: gliding ? 1.05 : 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <motion.g
        animate={leftWingMotion}
        transition={{ duration: wingDuration, repeat: Infinity, ease: featherEase }}
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
        transition={{ duration: wingDuration, repeat: Infinity, ease: featherEase }}
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
        filter={lite ? undefined : 'url(#athena-soft-glow)'}
        animate={headMotion}
        transition={{ duration: bodyDuration, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '56px 45px' }}
      >
        <path
          d="M35.6 27.6 31.4 12l14.9 9.2c3.1-1.2 6.4-1.8 9.7-1.8 3.5 0 6.8.6 9.9 1.8L80.7 12l-4.3 15.6c6.1 6 9.5 14.6 9.5 24.7 0 20.5-12.8 37.6-29.9 37.6S26.1 72.8 26.1 52.3c0-10.1 3.4-18.7 9.5-24.7Z"
          fill="url(#athena-body-premium)"
          stroke="rgba(255,244,218,0.5)"
          strokeWidth="1.55"
        />
        <motion.path
          d="M38.4 28.2c8.2-5.4 21.3-6.2 31.3-1.3 8.8 4.3 13.7 13.5 12.6 25.6-.9 10-4.6 18.7-10.5 25.3 3.2-7.4 4.7-15.5 3.9-23.1-1.3-12.7-8.9-20.3-19.8-20.3S37.7 42 36.4 54.7c-.8 7.6.7 15.7 3.9 23.1-6-6.6-9.6-15.3-10.5-25.3-1.1-10.8 2.3-19.1 8.6-24.3Z"
          fill="rgba(255,255,255,0.08)"
          animate={lite ? { opacity: alert ? 0.18 : 0.1 } : { opacity: alert ? [0.16, 0.27, 0.16] : [0.08, 0.14, 0.08] }}
          transition={lite ? { duration: 0.18, ease: 'easeOut' } : { duration: alert ? 1.1 : 3.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path
          d="M34.6 35.3c5.2-8.3 14.7-8.1 21.4-1.7 6.7-6.4 16.2-6.6 21.4 1.7 5.8 9.2.5 21.7-10.4 23.4-4.7.8-8.5-.6-11-3.9-2.5 3.3-6.3 4.7-11 3.9-10.9-1.7-16.2-14.2-10.4-23.4Z"
          fill="url(#athena-face-premium)"
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="1.15"
        />
        <path d="M39.3 36.4c4.3-5.4 10.3-4.8 16.7 1.4 6.4-6.2 12.4-6.8 16.7-1.4 4.7 5.9 1.5 14.4-6.3 16.2-4.5 1-8-.3-10.4-3.7-2.4 3.4-5.9 4.7-10.4 3.7-7.8-1.8-11-10.3-6.3-16.2Z" fill="rgba(255,255,255,0.18)" />
        <path d="M37.5 31.8c5.6-5.1 12.1-4.7 18.5 1.8 6.4-6.5 12.9-6.9 18.5-1.8" fill="none" stroke="rgba(255,255,255,0.38)" strokeLinecap="round" strokeWidth="1.35" />
        <path d="M33.8 15.6c3.9 4.7 8.3 7.5 13.1 8.4" fill="none" stroke="rgba(227,251,255,0.62)" strokeLinecap="round" strokeWidth="1.35" />
        <path d="M78.2 15.6c-3.9 4.7-8.3 7.5-13.1 8.4" fill="none" stroke="rgba(227,251,255,0.62)" strokeLinecap="round" strokeWidth="1.35" />
        <path d="M39.4 60.4c4.9 4 10.4 5.9 16.6 5.9s11.7-1.9 16.6-5.9c-1.2 15.9-7.1 25.8-16.6 25.8S40.6 76.3 39.4 60.4Z" fill="url(#athena-chest-plume)" filter={lite ? undefined : 'url(#athena-feather-depth)'} opacity="0.88" />
        <motion.g
          animate={lite ? { opacity: alert ? 0.82 : 0.52 } : { opacity: alert ? [0.72, 1, 0.72] : [0.46, 0.64, 0.46] }}
          transition={lite ? { duration: 0.18, ease: 'easeOut' } : { duration: alert ? 1.18 : 3.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M42.7 62.2c3.6 2.3 8 3.5 13.3 3.5s9.7-1.2 13.3-3.5" fill="none" stroke="url(#athena-plume-rim)" strokeLinecap="round" strokeWidth="1.25" />
          <path d="M44.8 68.2c3.1 2 6.8 3 11.2 3s8.1-1 11.2-3" fill="none" stroke="rgba(221,255,242,0.34)" strokeLinecap="round" strokeWidth="1.05" />
          <path d="M48.4 74.2c2.1 1.2 4.7 1.8 7.6 1.8s5.5-.6 7.6-1.8" fill="none" stroke="rgba(255,238,204,0.26)" strokeLinecap="round" strokeWidth="1" />
        </motion.g>
        <g opacity="0.94" filter={lite ? undefined : 'url(#athena-feather-depth)'}>
          <path
            d="M44.8 60.9c3.8 1 7.6 1.5 11.2 1.5s7.4-.5 11.2-1.5c-.4 9.6-4.1 16.2-11.2 20.1-7.1-3.9-10.8-10.5-11.2-20.1Z"
            fill="url(#athena-shield-glass)"
            stroke="url(#athena-tech-cyan)"
            strokeWidth="1.2"
          />
          <path d="M48.9 65.8c2.7.8 5 1.2 7.1 1.2s4.4-.4 7.1-1.2" fill="none" stroke="rgba(231,251,255,0.54)" strokeLinecap="round" strokeWidth="0.95" />
          <path d="M49.8 72.3 54.3 76l8.4-10.2" fill="none" stroke="#7df5ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
          <circle cx="45.1" cy="65.2" r="1" fill="#72f7ff" opacity="0.76" />
          <circle cx="66.9" cy="65.2" r="1" fill="#72f7ff" opacity="0.76" />
        </g>
        <g opacity="0.72" filter={lite ? undefined : 'url(#athena-feather-depth)'}>
          <path d="M43 65.4c3.7 2.8 8 4.2 13 4.2s9.3-1.4 13-4.2" fill="none" stroke="rgba(255,238,204,0.28)" strokeLinecap="round" strokeWidth="1.2" />
          <path d="M45.8 71.3c3 2.1 6.4 3.1 10.2 3.1s7.2-1 10.2-3.1" fill="none" stroke="rgba(255,255,255,0.18)" strokeLinecap="round" strokeWidth="1.05" />
          <path d="M49.5 77.1c2 1.2 4.2 1.8 6.5 1.8s4.5-.6 6.5-1.8" fill="none" stroke="rgba(0,232,143,0.18)" strokeLinecap="round" strokeWidth="1" />
        </g>
        <path d="M37.6 39.1c4.3-3.8 9.3-4.3 14.9-1.3" fill="none" stroke="rgba(6,18,25,0.64)" strokeLinecap="round" strokeWidth="2.1" />
        <path d="M74.4 39.1c-4.3-3.8-9.3-4.3-14.9-1.3" fill="none" stroke="rgba(6,18,25,0.64)" strokeLinecap="round" strokeWidth="2.1" />
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
        transition={{ duration: lite ? (gliding ? 1.35 : 3.4) : (gliding ? 0.95 : 2.8), repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '56px 88px' }}
        opacity="0.9"
      >
        <path d="M48.8 84.5c1.6 5.8 4 9.4 7.2 10.8 3.2-1.4 5.6-5 7.2-10.8-4.6 2.1-9.8 2.1-14.4 0Z" fill="#2b2118" stroke="rgba(255,238,204,0.28)" strokeWidth="1" />
        <path d="M53.5 86.8c.4 3.2 1.2 5.8 2.5 7.6 1.3-1.8 2.1-4.4 2.5-7.6" fill="none" stroke="rgba(0,232,143,0.2)" strokeLinecap="round" strokeWidth="1" />
      </motion.g>

      <g filter={lite ? undefined : 'url(#athena-eye-glow)'}>
        <ellipse cx="45.1" cy="45.4" rx="10.4" ry="11" fill="#041018" stroke="rgba(196,247,255,0.5)" strokeWidth="1.15" />
        <ellipse cx="66.9" cy="45.4" rx="10.4" ry="11" fill="#041018" stroke="rgba(196,247,255,0.5)" strokeWidth="1.15" />
        <motion.ellipse
          cx="45.1"
          cy="45.4"
          rx="7.75"
          ry="8.25"
          fill="url(#athena-eye-ring)"
          animate={lite ? { opacity: alert ? 0.92 : 0.58, scale: alert ? 1.02 : 1 } : { opacity: alert ? [0.78, 1, 0.8] : [0.5, 0.72, 0.52], scale: alert ? [1, 1.04, 1] : [0.98, 1.01, 0.99] }}
          transition={lite ? { duration: 0.18, ease: 'easeOut' } : { duration: alert ? 1.1 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '45.1px 45.4px' }}
        />
        <motion.ellipse
          cx="66.9"
          cy="45.4"
          rx="7.75"
          ry="8.25"
          fill="url(#athena-eye-ring)"
          animate={lite ? { opacity: alert ? 0.92 : 0.58, scale: alert ? 1.02 : 1 } : { opacity: alert ? [0.78, 1, 0.8] : [0.5, 0.72, 0.52], scale: alert ? [1, 1.04, 1] : [0.98, 1.01, 0.99] }}
          transition={lite ? { duration: 0.18, ease: 'easeOut' } : { duration: alert ? 1.1 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '66.9px 45.4px' }}
        />
        {blinking ? (
          <>
            <path d="M38.7 45.2h12.8" stroke="#d7fff1" strokeLinecap="round" strokeWidth="2.8" />
            <path d="M60.5 45.2h12.8" stroke="#d7fff1" strokeLinecap="round" strokeWidth="2.8" />
          </>
        ) : (
          <>
            <motion.circle animate={{ cx: 45.1 + gazeShift }} cy="45.1" r="5.8" fill="url(#athena-eye-premium)" transition={{ duration: 0.18, ease: 'easeOut' }} />
            <motion.circle animate={{ cx: 66.9 + gazeShift }} cy="45.1" r="5.8" fill="url(#athena-eye-premium)" transition={{ duration: 0.18, ease: 'easeOut' }} />
            <motion.circle animate={{ cx: 45.8 + gazeShift }} cy="45.4" r="2.65" fill="#04100c" transition={{ duration: 0.18, ease: 'easeOut' }} />
            <motion.circle animate={{ cx: 67.6 + gazeShift }} cy="45.4" r="2.65" fill="#04100c" transition={{ duration: 0.18, ease: 'easeOut' }} />
            <motion.circle animate={{ cx: 47.5 + gazeShift * 0.6 }} cy="42.2" r="1.18" fill="#ffffff" opacity="0.96" transition={{ duration: 0.18, ease: 'easeOut' }} />
            <motion.circle animate={{ cx: 69.3 + gazeShift * 0.6 }} cy="42.2" r="1.18" fill="#ffffff" opacity="0.96" transition={{ duration: 0.18, ease: 'easeOut' }} />
            <motion.circle animate={{ cx: 42.6 + gazeShift * 0.4 }} cy="48.8" r="0.72" fill="#ccfff0" opacity="0.6" transition={{ duration: 0.18, ease: 'easeOut' }} />
            <motion.circle animate={{ cx: 64.4 + gazeShift * 0.4 }} cy="48.8" r="0.72" fill="#ccfff0" opacity="0.6" transition={{ duration: 0.18, ease: 'easeOut' }} />
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
  const [mobileMotion, setMobileMotion] = React.useState(isMobileMotionViewport);
  const [mounted, setMounted] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [ripple, setRipple] = React.useState(0);
  const [blink, setBlink] = React.useState(false);
  const [routeMotion, setRouteMotion] = React.useState<RouteMotion>({ behind: false, pulse: 0 });
  const previousPathRef = React.useRef(location.pathname);
  const routeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [flight, setFlight] = React.useState<FlightState>({
    x: isMobileMotionViewport() ? 12 : -24,
    y: typeof window === 'undefined' ? 360 : Math.round(window.innerHeight * 0.56),
    tilt: 0,
    flip: 1,
    burst: 0,
    gliding: false,
    peek: false,
    energy: 0,
  });
  const flightRef = React.useRef(flight);
  const dragRef = React.useRef<{
    pointerId: number | null;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    moved: boolean;
  }>({
    pointerId: null,
    startClientX: 0,
    startClientY: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });
  const suppressClickRef = React.useRef(false);
  const lastDragAtRef = React.useRef(0);
  const manualOffsetRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    flightRef.current = flight;
  }, [flight]);

  const commitFlight = React.useCallback((updater: React.SetStateAction<FlightState>) => {
    setFlight((current) => {
      const next = typeof updater === 'function' ? (updater as (value: FlightState) => FlightState)(current) : updater;
      flightRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const smallViewport = window.matchMedia('(max-width: 767px)');
    const updateMobileMotion = () => setMobileMotion(coarsePointer.matches || smallViewport.matches);

    updateMobileMotion();
    coarsePointer.addEventListener('change', updateMobileMotion);
    smallViewport.addEventListener('change', updateMobileMotion);
    window.addEventListener('resize', updateMobileMotion, { passive: true });

    return () => {
      coarsePointer.removeEventListener('change', updateMobileMotion);
      smallViewport.removeEventListener('change', updateMobileMotion);
      window.removeEventListener('resize', updateMobileMotion);
    };
  }, []);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return undefined;
    previousPathRef.current = location.pathname;

    if (routeTimerRef.current) clearTimeout(routeTimerRef.current);
    setRouteMotion((current) => ({ behind: true, pulse: current.pulse + 1 }));
    commitFlight((current) => ({
      ...current,
      tilt: 0,
      gliding: true,
      peek: true,
      energy: Math.max(current.energy, 0.68),
      burst: current.burst + 1,
    }));

    routeTimerRef.current = setTimeout(() => {
      setRouteMotion((current) => ({ behind: false, pulse: current.pulse + 1 }));
      commitFlight((current) => ({ ...current, gliding: false, peek: false, energy: 0 }));
    }, 360);

    return undefined;
  }, [commitFlight, location.pathname]);

  useEffect(() => {
    return () => {
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current);
    };
  }, []);
  useEffect(() => {
    const liteMotion = reduced || mobileMotion;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let releaseTimer: ReturnType<typeof setTimeout>;
    let rafId: number | null = null;
    let lastTop = 0;
    let lastLeft = 0;
    let activeUntil = 0;

    const calculateFlight = (snapshot: ScrollSnapshot, deltaTop: number, deltaLeft: number) => {
      const currentPosition = flightRef.current;
      const target = getFlightTarget(snapshot, manualOffsetRef.current);
      const scrollSpeed = Math.hypot(deltaTop, deltaLeft);
      const targetDistance = Math.hypot(target.x - currentPosition.x, target.y - currentPosition.y);
      const inputEnergy = liteMotion
        ? clamp(scrollSpeed / 88 + targetDistance / 540, 0, 0.72)
        : clamp(scrollSpeed / 56 + targetDistance / 360, 0, 1);
      const energy = liteMotion
        ? clamp(currentPosition.energy * 0.58 + inputEnergy * 0.34, 0, 0.72)
        : clamp(currentPosition.energy * 0.74 + inputEnergy * 0.42, 0, 1);
      const follow = liteMotion ? 0.44 + energy * 0.16 : 0.13 + energy * 0.24;
      const lift = liteMotion ? clamp(deltaTop * 0.012, -2.2, 2.2) : clamp(deltaTop * 0.032, -6.5, 6.5);
      const drift = liteMotion ? clamp(deltaLeft * -0.032, -2.2, 2.2) : clamp(deltaLeft * -0.07, -6, 6);
      const y = clamp(
        currentPosition.y + (target.y - currentPosition.y) * follow + lift,
        target.bounds.upper,
        target.bounds.lower,
      );
      const x = clamp(
        currentPosition.x + (target.x - currentPosition.x) * (follow + 0.035) + drift,
        target.bounds.minX,
        target.bounds.maxX,
      );
      const horizontal = x - currentPosition.x;
      const vertical = y - currentPosition.y;
      const flip: 1 | -1 = horizontal < -0.75 ? -1 : horizontal > 0.75 ? 1 : currentPosition.flip;
      const distanceAfter = Math.hypot(target.x - x, target.y - y);

      return {
        x,
        y,
        tilt: liteMotion ? clamp(vertical * 0.07 + horizontal * 0.035, -7, 7) : clamp(vertical * 0.14 + horizontal * 0.075, -14, 14),
        flip,
        energy,
        distanceAfter,
        active: liteMotion ? scrollSpeed > 0.08 || energy > 0.08 : scrollSpeed > 0.08 || energy > 0.038 || distanceAfter > 0.48,
      };
    };

    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 130);
        scheduleBlink();
      }, 3400 + Math.random() * 3800);
    };

    const settleFlight = (delay = 260) => {
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(() => {
        commitFlight((current) => ({
          ...current,
          tilt: 0,
          gliding: false,
          peek: false,
          energy: 0,
        }));
      }, delay);
    };

    const syncToScroll = () => {
      rafId = null;
      const snapshot = readPageScroll();
      const deltaTop = snapshot.top - lastTop;
      const deltaLeft = snapshot.left - lastLeft;
      lastTop = snapshot.top;
      lastLeft = snapshot.left;

      if (Math.abs(deltaTop) > 0.08 || Math.abs(deltaLeft) > 0.08) {
        activeUntil = Date.now() + (liteMotion ? 420 : 620);
      }

      const next = calculateFlight(snapshot, deltaTop, deltaLeft);
      const shouldKeepFlying = liteMotion
        ? next.active || Date.now() < activeUntil
        : next.active || Date.now() < activeUntil;

      commitFlight((current) => ({
        ...current,
        x: next.x,
        y: next.y,
        tilt: shouldKeepFlying ? next.tilt : current.tilt * 0.72,
        flip: next.flip,
        burst: !liteMotion && shouldKeepFlying && next.energy > 0.16 ? current.burst + 1 : current.burst,
        gliding: shouldKeepFlying,
        peek: shouldKeepFlying,
        energy: shouldKeepFlying ? next.energy : Math.max(0, current.energy * 0.68),
      }));

      if (shouldKeepFlying && (!liteMotion || (next.distanceAfter > 8 && Date.now() < activeUntil))) {
        rafId = window.requestAnimationFrame(syncToScroll);
      } else {
        settleFlight(liteMotion ? 90 : 140);
      }
    };

    const requestSync = () => {
      activeUntil = Date.now() + (liteMotion ? 360 : 540);
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(syncToScroll);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (liteMotion || event.pointerType === 'touch') return;
      const width = window.innerWidth || 1;
      const zone = event.clientX / width;
      if (zone < 0.18 || zone > 0.82) {
        commitFlight((current) => ({
          ...current,
          x: zone < 0.18 ? -154 : -14,
          flip: zone < 0.18 ? -1 : 1,
          tilt: zone < 0.18 ? -12 : 8,
          gliding: true,
          peek: true,
          energy: Math.max(current.energy, 0.74),
          burst: current.burst + 1,
        }));
        activeUntil = Date.now() + 420;
        requestSync();
        settleFlight(520);
      }
    };

    const handleResize = () => {
      requestSync();
    };

    const initial = readPageScroll();
    lastTop = initial.top;
    lastLeft = initial.left;
    const initialFlight = getFlightTarget(initial, manualOffsetRef.current);
    commitFlight((current) => ({ ...current, x: initialFlight.x, y: initialFlight.y, energy: 0 }));
    scheduleBlink();

    const main = document.getElementById('app-main-scroll');
    const visualViewport = window.visualViewport;
    main?.addEventListener('scroll', requestSync, { passive: true });
    document.addEventListener('scroll', requestSync, { passive: true, capture: true });
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('wheel', requestSync, { passive: true });
    if (!liteMotion) window.addEventListener('touchmove', requestSync, { passive: true });
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
      if (!liteMotion) window.removeEventListener('touchmove', requestSync);
      window.removeEventListener('resize', handleResize);
      visualViewport?.removeEventListener('scroll', requestSync);
      visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [commitFlight, mobileMotion, reduced]);

  if (isOpen) return null;

  const liteMotion = reduced || mobileMotion;
  const heavyEffects = !liteMotion;

  const clampDraggedFlight = (x: number, y: number) => {
    const bounds = getFlightBounds();

    return {
      x: clamp(x, bounds.minX, bounds.maxX),
      y: clamp(y, bounds.upper, bounds.lower),
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: flightRef.current.x,
      startY: flightRef.current.y,
      moved: false,
    };
    suppressClickRef.current = false;
    setHover(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    commitFlight((current) => ({
      ...current,
      tilt: current.flip === -1 ? -8 : 8,
      gliding: true,
      peek: true,
      energy: Math.max(current.energy, 0.72),
      burst: current.burst + 1,
    }));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startClientX;
    const deltaY = event.clientY - drag.startClientY;
    const distance = Math.hypot(deltaX, deltaY);

    if (!drag.moved && distance < 7) return;

    drag.moved = true;
    suppressClickRef.current = true;
    setIsDragging(true);
    event.preventDefault();

    const nextPosition = clampDraggedFlight(drag.startX + deltaX, drag.startY + deltaY);
    const neutralTarget = getFlightTarget(readPageScroll(), { x: 0, y: 0 });
    manualOffsetRef.current = {
      x: clamp(nextPosition.x - neutralTarget.x, -neutralTarget.bounds.viewportWidth * 0.44, 18),
      y: clamp(nextPosition.y - neutralTarget.y, -neutralTarget.bounds.viewportHeight * 0.36, neutralTarget.bounds.viewportHeight * 0.36),
    };
    commitFlight((current) => ({
      ...current,
      x: nextPosition.x,
      y: nextPosition.y,
      tilt: clamp(deltaY * 0.08 + deltaX * 0.04, -18, 18),
      flip: deltaX < -1 ? -1 : 1,
      gliding: true,
      peek: true,
      burst: current.burst + 1,
      energy: Math.max(current.energy, 0.9),
    }));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current.pointerId = null;
    setIsDragging(false);
    setHover(false);

    if (drag.moved) {
      lastDragAtRef.current = Date.now();
      window.setTimeout(() => {
        commitFlight((current) => ({ ...current, tilt: 0, gliding: false, peek: false, energy: 0 }));
      }, 180);
    }
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.pointerId = null;
    setIsDragging(false);
    setHover(false);
    commitFlight((current) => ({ ...current, tilt: 0, gliding: false, peek: false, energy: 0 }));
  };

  const handleOpen = () => {
    if (suppressClickRef.current || Date.now() - lastDragAtRef.current < 240) {
      suppressClickRef.current = false;
      return;
    }

    if ('vibrate' in navigator) navigator.vibrate(10);
    setRipple((value) => value + 1);
    commitFlight((current) => ({
      ...current,
      y: Math.max(88, current.y - 28),
      tilt: -12,
      gliding: true,
      peek: true,
      burst: current.burst + 1,
      energy: Math.max(current.energy, 0.88),
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
        opacity: routeMotion.behind ? 0.38 : flight.peek ? 0.94 : 1,
        scale: routeMotion.behind ? 0.72 : isDragging ? (mobileMotion ? 1.035 : 1.08) : hover ? 1.07 : flight.peek ? 0.985 : 1,
        x: flight.x,
        y: flight.y - (routeMotion.behind ? (mobileMotion ? 12 : 22) : 0),
        rotate: routeMotion.behind ? (flight.flip === -1 ? -6 : 6) : flight.tilt,
      }}
      transition={
        reduced
          ? { duration: 0.08 }
          : mobileMotion
            ? { duration: flight.gliding ? 0.14 : 0.18, ease: [0.22, 1, 0.36, 1] }
            : { type: 'spring', stiffness: flight.gliding ? 220 : 175, damping: flight.gliding ? 28 : 24, mass: 0.62 }
      }
      whileTap={{ scale: 0.9, transition: springs.snappy }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className="athena-floating-button fixed right-0 top-0 z-[100] h-[6.65rem] w-[6.65rem] overflow-visible rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e0d] max-[430px]:h-24 max-[430px]:w-24"
      data-dragging={isDragging ? 'true' : 'false'}
      data-gliding={flight.gliding ? 'true' : 'false'}
      data-mobile-motion={mobileMotion ? 'true' : 'false'}
      data-route-motion={routeMotion.behind ? 'behind' : 'idle'}
    >
      <AnimatePresence>
        {ripple > 0 && heavyEffects && (
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
        {flight.burst > 0 && heavyEffects && (
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

      {heavyEffects && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            animate={{ opacity: hover || flight.gliding ? [0.5, 0.76, 0.5] : [0.24, 0.42, 0.24] }}
            transition={{ duration: hover || flight.gliding ? 1 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(circle, rgba(var(--hub-primary-rgb),0.4), rgba(96,245,255,0.16) 42%, transparent 74%)',
              filter: 'blur(15px)',
            }}
          />

          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-3 rounded-full border border-white/15 shadow-[inset_0_0_22px_rgba(var(--hub-primary-rgb),0.16),0_0_24px_rgba(0,245,174,0.12)]"
            animate={{ scale: hover || flight.gliding ? [0.97, 1.04, 0.98] : [0.98, 1.01, 0.99], opacity: hover || flight.gliding ? [0.72, 0.96, 0.74] : [0.38, 0.58, 0.4] }}
            transition={{ duration: hover || flight.gliding ? 1.05 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-[1.05rem] rounded-full border border-primary/20 border-t-white/45 border-r-cyan-200/30"
            animate={{ rotate: 360 }}
            transition={{ duration: hover || flight.gliding ? 3.8 : 7.5, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      <AnimatePresence>
        {routeMotion.behind && heavyEffects && (
          <motion.span
            key={`route-${routeMotion.pulse}`}
            aria-hidden
            className="athena-route-warp pointer-events-none absolute inset-4 rounded-full"
            initial={{ opacity: 0.54, scale: 0.72, rotate: -20 }}
            animate={{ opacity: 0, scale: 1.36, rotate: 18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      <motion.span
        className="athena-owl-shell relative z-10 flex h-full w-full items-center justify-center rounded-full p-[0.12rem]"
        animate={{
          rotateY: routeMotion.behind
            ? mobileMotion ? 176 : [flight.flip === -1 ? 180 : 0, flight.flip === -1 ? 18 : 166, 176]
            : flight.flip === -1 ? 180 : 0,
          x: routeMotion.behind ? (mobileMotion ? 0 : [0, flight.flip * -5, 0]) : flight.peek ? flight.flip * (mobileMotion ? 2 : 4) : 0,
          y: routeMotion.behind ? (mobileMotion ? -6 : [0, -18, -10]) : flight.gliding ? (mobileMotion ? -1 : -2) : 0,
          scale: routeMotion.behind ? (mobileMotion ? 0.9 : [1, 0.78, 0.86]) : flight.gliding ? (mobileMotion ? 1.01 : 1.025) : 1,
        }}
        transition={{ duration: routeMotion.behind ? (mobileMotion ? 0.24 : 0.46) : (mobileMotion ? 0.22 : 0.5), ease: [0.22, 1, 0.36, 1] }}
        style={{
          transformPerspective: 760,
          background:
            'radial-gradient(circle at 42% 24%, rgba(255,244,218,0.24), rgba(var(--hub-primary-rgb),0.12) 30%, rgba(34,21,13,0.12) 58%, rgba(0,0,0,0.01) 100%)',
          filter: mobileMotion
            ? 'drop-shadow(0 10px 14px rgba(0,0,0,0.28))'
            : routeMotion.behind
              ? 'blur(1.6px) drop-shadow(0 0 8px rgba(var(--hub-primary-rgb),0.16))'
              : hover
                ? 'drop-shadow(0 0 32px rgba(var(--hub-primary-rgb),0.42)) drop-shadow(0 16px 28px rgba(0,0,0,0.34))'
                : 'drop-shadow(0 0 21px rgba(var(--hub-primary-rgb),0.28)) drop-shadow(0 12px 22px rgba(0,0,0,0.28))',
        }}
      >
        <AthenaOwl blinking={blink} active={hover || flight.gliding} gliding={flight.gliding} intensity={flight.energy} lite={liteMotion} />
        <span className="absolute right-[1.05rem] top-[1.18rem] h-2.5 w-2.5 rounded-full border-2 border-[#06100d] bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.82)]" />
      </motion.span>
    </motion.button>
  );

  if (typeof document === 'undefined' || !mounted) return button;
  return createPortal(button, document.body);
}
