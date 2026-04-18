import React, { useEffect } from 'react';

export const TheSilence = () => {
  useEffect(() => {
    // The ultimate end. Block the command palette shortcut.
    const block = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', block, true);
    return () => window.removeEventListener('keydown', block, true);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999999] bg-black cursor-none pointer-events-auto" />
  );
};
