import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Server, Activity } from 'lucide-react';

export const TheServerRoom = ({ onBack }: { onBack: () => void }) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const serverAscii = `
  [================================================]
  [  [||||||||||||||||||||||||||||||||||||||||]  ]
  [  [||||||||||||||||||||||||||||||||||||||||]  ]
  [  [||||||||||||||||||||||||||||||||||||||||]  ]
  [================================================]
  [  (o) PWR   (o) NET   (o) HDD   (o) SYS       ]
  [================================================]
  `;

  return (
    <div className="fixed inset-0 z-[100000] bg-[#050505] text-[#4a4a4a] font-mono p-4 md:p-12 overflow-hidden flex flex-col">
      <button onClick={onBack} className="absolute top-8 left-8 text-[#4a4a4a] hover:text-white transition-colors z-10">
        <ChevronLeft size={24} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="space-y-8">
          {/* Server Racks */}
          <div className="flex flex-col gap-4 opacity-50">
            {[1, 2, 3].map((rack) => (
              <div key={rack} className="relative">
                <pre className="text-[8px] md:text-xs leading-tight">
                  {serverAscii}
                </pre>
                {/* Blinking Lights */}
                <div className="absolute bottom-[15%] left-[10%] flex gap-8">
                  <div className={`w-2 h-2 rounded-full ${blink ? 'bg-green-500 shadow-[0_0_10px_#00ff00]' : 'bg-green-900'}`} />
                  <div className={`w-2 h-2 rounded-full ${!blink ? 'bg-blue-500 shadow-[0_0_10px_#0000ff]' : 'bg-blue-900'}`} />
                  <div className={`w-2 h-2 rounded-full ${Math.random() > 0.5 ? 'bg-amber-500 shadow-[0_0_10px_#ffbf00]' : 'bg-amber-900'}`} />
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#00ff00]" />
                </div>
              </div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="text-center space-y-4 pt-12 border-t border-[#1a1a1a]"
          >
            <div className="flex items-center justify-center gap-2 text-green-500 mb-4">
              <Activity size={16} />
              <span className="text-xs uppercase tracking-widest">Conexao fisica estabelecida</span>
            </div>
            <p className="text-sm">Voce acessou o painel tecnico do ambiente.</p>
            <p className="text-sm">Monitoramento de infraestrutura ativo.</p>
            <div className="text-xs opacity-50 mt-8 space-y-1">
              <p>Host: us-west2.run.app</p>
              <p>Instância: ais-dev-zoqrf3tg6a5dwvw77s7b73-325870964962</p>
              <p>Status: Servindo 1 sessao ativa.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
