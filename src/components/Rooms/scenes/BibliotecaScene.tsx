import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const BibliotecaScene = () => {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1c1917]">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fcd34d" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="200" width="150" height="800" fill="#451a03" />
        <rect x="850" y="200" width="150" height="800" fill="#451a03" />

        {[300, 450, 600, 750].map((y, i) => (
          <React.Fragment key={`shelf-l-${i}`}>
            <rect x="0" y={y} width="150" height="10" fill="#2d0f02" />
            {[10, 30, 50, 75, 100, 120].map((x, j) => (
              <rect
                key={`book-l-${i}-${j}`}
                x={x}
                y={y - 60}
                width="15"
                height="60"
                fill={['#b91c1c', '#065f46', '#1e3a8a', '#d97706', '#431407'][(i + j) % 5]}
              />
            ))}
          </React.Fragment>
        ))}

        {[300, 450, 600, 750].map((y, i) => (
          <React.Fragment key={`shelf-r-${i}`}>
            <rect x="850" y={y} width="150" height="10" fill="#2d0f02" />
            {[860, 880, 905, 930, 955, 975].map((x, j) => (
              <rect
                key={`book-r-${i}-${j}`}
                x={x}
                y={y - 60}
                width="15"
                height="60"
                fill={['#b91c1c', '#065f46', '#1e3a8a', '#d97706', '#431407'][(i + j + 2) % 5]}
              />
            ))}
          </React.Fragment>
        ))}

        <rect
          x="400"
          y="100"
          width="200"
          height="300"
          fill="#fde68a"
          fillOpacity="0.1"
          stroke="#451a03"
          strokeWidth="8"
        />
        <line x1="500" y1="100" x2="500" y2="400" stroke="#451a03" strokeWidth="4" />
        <line x1="400" y1="250" x2="600" y2="250" stroke="#451a03" strokeWidth="4" />

        <circle cx="800" cy="400" r="100" fill="url(#lampGlow)" opacity={reduceMotion ? 0.45 : undefined}>
          {!reduceMotion && (
            <animate attributeName="opacity" values="0.4;0.5;0.4" dur="4s" repeatCount="indefinite" />
          )}
        </circle>
        <path d="M 780 300 L 820 300 L 840 450 L 760 450 Z" fill="#92400e" />

        {[...Array(15)].map((_, i) => (
          <motion.circle
            key={i}
            cx={200 + Math.random() * 600}
            cy={100 + Math.random() * 800}
            r={1 + Math.random() * 2}
            fill="#fde68a"
            fillOpacity="0.3"
            animate={
              reduceMotion
                ? { y: 0, x: 0, opacity: 0.35 }
                : {
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: Math.random() * 5,
                  }
            }
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1c1917]/80 pointer-events-none" />
    </div>
  );
};
