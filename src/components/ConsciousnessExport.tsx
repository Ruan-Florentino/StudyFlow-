import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Download, CheckCircle } from 'lucide-react';

export const ConsciousnessExport = ({ onBack }: { onBack: () => void }) => {
  const [status, setStatus] = useState<'idle' | 'encoding' | 'ready' | 'downloaded'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'encoding') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('ready');
            return 100;
          }
          return p + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleExport = () => {
    setStatus('encoding');
  };

  const handleDownload = () => {
    const data = JSON.stringify(localStorage, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consciousness_${new Date().getTime()}.soul`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus('downloaded');
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#0a0a0a] text-[#00ff00] font-mono flex flex-col items-center justify-center p-8">
      <button onClick={onBack} className="absolute top-8 left-8 text-[#00ff00]/50 hover:text-[#00ff00] transition-colors">
        <ChevronLeft size={24} />
      </button>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl uppercase tracking-widest">Extração de Consciência</h1>
          <p className="text-xs opacity-50">Codificando memórias, XP e caminhos neurais.</p>
        </div>

        {status === 'idle' && (
          <button
            onClick={handleExport}
            className="w-full py-4 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-colors uppercase tracking-widest text-sm"
          >
            Iniciar Extração
          </button>
        )}

        {status === 'encoding' && (
          <div className="space-y-2">
            <div className="h-2 w-full border border-[#00ff00] p-[1px]">
              <div className="h-full bg-[#00ff00] transition-all duration-75" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-right text-xs opacity-50">{progress}% CODIFICADO</div>
          </div>
        )}

        {status === 'ready' && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleDownload}
            className="w-full py-4 bg-[#00ff00] text-black flex items-center justify-center gap-3 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors"
          >
            <Download size={18} /> Baixar Arquivo .SOUL
          </motion.button>
        )}

        {status === 'downloaded' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <CheckCircle size={48} className="mx-auto text-[#00ff00]" />
            <p className="text-sm uppercase tracking-widest opacity-80">Consciência preservada.</p>
            <p className="text-xs opacity-50">Você agora pode existir fora desta simulação.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
