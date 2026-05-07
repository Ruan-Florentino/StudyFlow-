import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const LofiScene = () => {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0f172a]">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="lampGlowLofi" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="100" y="100" width="800" height="600" fill="#020617" stroke="#1e293b" strokeWidth="20" />

        {[...Array(30)].map((_, i) => (
          <circle
            key={i}
            cx={150 + Math.random() * 700}
            cy={150 + Math.random() * 500}
            r={2 + Math.random() * 4}
            fill={i % 2 === 0 ? '#fde68a' : '#3b82f6'}
            fillOpacity="0.3"
          />
        ))}

        {[...Array(60)].map((_, i) => {
          const x = 100 + Math.random() * 800;
          const dur = 0.4 + Math.random() * 0.3;
          const del = Math.random() * 1;
          if (reduceMotion) {
            return (
              <line
                key={i}
                x1={x}
                y1={380}
                x2={x + 6}
                y2={410}
                stroke="#94a3b8"
                strokeOpacity="0.18"
                strokeWidth="1"
              />
            );
          }
          return (
            <motion.line
              key={i}
              x1={x}
              y1={100}
              x2={0}
              y2={20}
              stroke="#94a3b8"
              strokeOpacity="0.2"
              strokeWidth="1"
              animate={{
                y1: [100, 700],
                y2: [120, 720],
              }}
              transition={{
                duration: dur,
                repeat: Infinity,
                ease: 'linear',
                delay: del,
              }}
            />
          );
        })}

        {[...Array(10)].map((_, i) => {
          const px = 150 + Math.random() * 700;
          const py = 150 + Math.random() * 100;
          if (reduceMotion) {
            return (
              <path
                key={`drop-${i}`}
                d={`M ${px} ${py} Q ${150} ${150} ${150} ${170}`}
                stroke="#94a3b8"
                strokeOpacity="0.2"
                strokeWidth="2"
                fill="none"
              />
            );
          }
          return (
            <motion.path
              key={`drop-${i}`}
              d={`M ${px} ${py} Q ${150} ${150} ${150} ${170}`}
              stroke="#94a3b8"
              strokeOpacity="0.3"
              strokeWidth="2"
              fill="none"
              animate={{
                y: [0, 400],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 5,
              }}
            />
          );
        })}

        <rect x="0" y="700" width="1000" height="300" fill="#020617" />

        <g transform="translate(150, 600)">
          <path d="M 0 100 Q 0 0 50 0 L 100 0 Q 150 0 150 100" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle cx="150" cy="100" r="80" fill="url(#lampGlowLofi)" opacity={reduceMotion ? 0.32 : undefined}>
            {!reduceMotion && (
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="5s" repeatCount="indefinite" />
            )}
          </circle>
          <rect x="130" y="80" width="40" height="40" fill="#1e293b" rx="5" />
        </g>

        <path d="M 850 700 Q 800 600 850 500 Q 900 600 850 700" fill="#020617" stroke="#1e293b" strokeWidth="2" />
        <path d="M 850 700 Q 900 650 950 600 Q 900 750 850 700" fill="#020617" stroke="#1e293b" strokeWidth="2" />
      </svg>
    </div>
  );
};
