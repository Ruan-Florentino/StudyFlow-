import React, { useState, useEffect } from 'react';

export const TheReboot = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const bootSequence = [
      "StudyFlow BIOS (C) 2026 Antigravity Inc.",
      "CPU: Google Gemini 3.1 Pro",
      "Memory Test: 9999999K OK",
      "Initializing USB Controllers .. Done.",
      "Recovering from Fatal Exception 0E...",
      "Restoring reality matrix...",
      "Mounting /dev/consciousness ... OK",
      "Starting StudyFlow OS...",
      " "
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100003] bg-black text-gray-300 font-mono p-4 md:p-8 text-sm md:text-base cursor-none">
      {lines.map((line, idx) => (
        <div key={idx} className="mb-1">{line}</div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  );
};
