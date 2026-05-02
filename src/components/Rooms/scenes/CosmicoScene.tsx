import React from 'react';
import { motion } from 'motion/react';

export const CosmicoScene = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0f172a]">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="nebulaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="planetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4c1d95" stopOpacity="1" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Nebulosas */}
        <motion.circle 
          cx="300" cy="400" r="300" fill="url(#nebulaGlow)"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.circle 
          cx="700" cy="600" r="250" fill="url(#nebulaGlow)"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        {/* Estrelas */}
        {[...Array(60)].map((_, i) => (
          <motion.circle
            key={i}
            cx={Math.random() * 1000}
            cy={Math.random() * 1000}
            r={0.5 + Math.random() * 1.5}
            fill="white"
            initial={{ opacity: Math.random() }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* Planeta Grande */}
        <g transform="translate(800, 200)">
          <circle r="80" fill="url(#planetGlow)" />
          <ellipse cx="0" cy="0" rx="120" ry="20" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeOpacity="0.4" transform="rotate(-20)" />
        </g>

        {/* Cometa */}
        <motion.g
          initial={{ x: -100, y: 300, opacity: 0 }}
          animate={{ x: 1100, y: 100, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 10, ease: "linear" }}
        >
          <path d="M 0 0 L -30 10" stroke="white" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="2" fill="white" />
        </motion.g>
      </svg>
    </div>
  );
};
