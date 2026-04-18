import React, { useState, useEffect } from 'react';

export const TheSelfDestruct = () => {
  const [countdown, setCountdown] = useState(10);
  const [destroyed, setDestroyed] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setDestroyed(true);
      // Literally wipe the DOM body to make it unrecoverable without a refresh
      setTimeout(() => {
        document.body.innerHTML = '';
        document.body.style.backgroundColor = 'black';
      }, 500);
    }
  }, [countdown]);

  if (destroyed) {
    return <div className="fixed inset-0 z-[9999999] bg-black" />;
  }

  return (
    <div className={`fixed inset-0 z-[100012] flex flex-col items-center justify-center font-mono transition-colors duration-300 ${countdown % 2 === 0 ? 'bg-red-600 text-white' : 'bg-white text-red-600'}`}>
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
          Autodestruição
        </h1>
        <p className="text-xl md:text-2xl">
          Avançando para o fim da aplicação em:
        </p>
        <div className="text-8xl md:text-[12rem] font-black">
          {countdown}
        </div>
      </div>
    </div>
  );
};
