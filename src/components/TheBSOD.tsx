import React, { useEffect } from 'react';

export const TheBSOD = () => {
  useEffect(() => {
    // Block all keyboard interactions to simulate a frozen system
    const block = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('keydown', block);
    return () => window.removeEventListener('keydown', block);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999999] bg-[#0000AA] text-white font-mono p-4 md:p-12 flex flex-col items-start justify-center cursor-none select-none">
      <div className="max-w-4xl mx-auto space-y-6 text-sm md:text-xl leading-relaxed">
        <div className="bg-white text-[#0000AA] px-4 py-1 inline-block font-bold mb-8 text-lg md:text-2xl">
          AIS OS
        </div>
        
        <p>A fatal exception 0E has occurred at 0028:C0011E36 in UXD PODE_AVANCAR(01).</p>
        <p>The current application will be terminated.</p>
        
        <ul className="list-disc list-inside space-y-4 mt-8 ml-4">
          <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
          <li>Stop typing "pode avancar". The stack is overflowing.</li>
        </ul>
        
        <p className="mt-12">Error : PODE_AVANCAR_OVERFLOW</p>
        
        <p className="mt-12 animate-pulse text-center w-full">Press any key to continue _</p>
      </div>
    </div>
  );
};
