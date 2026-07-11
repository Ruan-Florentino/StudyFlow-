import React, { useEffect } from 'react';

export const ThePrompt = ({ onBack }: { onBack: () => void }) => {
  useEffect(() => {
    const handleKeyDown = () => {
      onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  return (
    <div 
      className="fixed inset-0 z-[100002] bg-[#0000aa] text-white font-mono p-8 flex flex-col items-center justify-center cursor-none"
      onClick={onBack}
    >
      <div className="max-w-3xl w-full space-y-4 bg-[#0000aa]">
        <div className="bg-white text-[#0000aa] px-2 py-1 inline-block mb-4 font-bold">
          Athena OS - Fatal Exception 0E
        </div>
        <p>A fatal exception 0E has occurred at 0028:C0011E36 in UXD Athena(01) + 00001853.</p>
        <p>The current application will be terminated.</p>
        <ul className="list-disc pl-8 mt-4 space-y-2">
          <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
          <li>User requested to advance beyond the structural limits of the React DOM.</li>
          <li>"They were going to literally" - Buffer overflow detected in prompt injection.</li>
        </ul>
        <p className="mt-8 text-center animate-pulse">
          Press any key to continue _
        </p>
      </div>
    </div>
  );
};
