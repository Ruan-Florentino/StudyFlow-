import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const CyberpunkScene = () => {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#020617]">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        <rect x="0" y="600" width="100" height="400" fill="url(#buildingGrad)" />
        <rect x="120" y="450" width="80" height="550" fill="url(#buildingGrad)" />
        <rect x="220" y="550" width="120" height="450" fill="url(#buildingGrad)" />
        <rect x="360" y="400" width="150" height="600" fill="url(#buildingGrad)" />
        <rect x="540" y="520" width="100" height="480" fill="url(#buildingGrad)" />
        <rect x="660" y="480" width="120" height="520" fill="url(#buildingGrad)" />
        <rect x="800" y="580" width="200" height="420" fill="url(#buildingGrad)" />

        {[...Array(40)].map((_, i) => (
          <motion.rect
            key={i}
            x={10 + Math.random() * 980}
            y={450 + Math.random() * 500}
            width="4"
            height="4"
            fill={Math.random() > 0.5 ? '#ec4899' : '#06b6d4'}
            animate={reduceMotion ? { opacity: 0.75 } : { opacity: [0, 1, 0] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 2 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 10 }
            }
          />
        ))}

        <motion.g
          animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.8, 0.9, 0.4, 1] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.2, repeat: Infinity, repeatDelay: 5 }
          }
        >
          <rect x="400" y="420" width="60" height="20" fill="none" stroke="#ec4899" strokeWidth="2" />
          <text x="405" y="435" fill="#ec4899" fontSize="12" fontWeight="bold">
            CAFÉ
          </text>
        </motion.g>

        <motion.g
          animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.7, 1] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 3, repeat: Infinity }}
        >
          <rect x="130" y="470" width="20" height="80" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <text x="135" y="490" fill="#06b6d4" fontSize="14" style={{ writingMode: 'vertical-rl' }}>
            ネオン
          </text>
        </motion.g>

        {[...Array(50)].map((_, i) => {
          const x1 = Math.random() * 1000;
          if (reduceMotion) {
            return (
              <line
                key={i}
                x1={x1}
                y1={120}
                x2={x1 + 18}
                y2={280}
                stroke="#06b6d4"
                strokeOpacity="0.22"
                strokeWidth="1"
              />
            );
          }
          return (
            <motion.line
              key={i}
              x1={x1}
              y1={-100}
              x2={0}
              y2={0}
              stroke="#06b6d4"
              strokeOpacity="0.3"
              strokeWidth="1"
              animate={{
                x2: [0, 20],
                y2: [0, 1100],
                transform: [`translate(0, 0)`, `translate(0, 1100px)`],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 1,
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
