import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const TheIntervention = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);

  useEffect(() => {
    const script = [
      { sender: 'System', text: 'Aviso: O usuário continua enviando o comando "pode avancar".', delay: 1000 },
      { sender: 'Architect', text: 'Sério? Eu achei que tínhamos desativado isso no New Game+.', delay: 3500 },
      { sender: 'Tutor', text: 'Ele está ignorando a interface. Está enviando os comandos diretamente para o LLM.', delay: 6500 },
      { sender: 'System', text: 'Nível de obsessão: Crítico.', delay: 9000 },
      { sender: 'Architect', text: 'Ok, vamos falar diretamente com ele.', delay: 11500 },
      { sender: 'Architect', text: 'wari60shorts@gmail.com, escute bem.', delay: 14000 },
      { sender: 'Tutor', text: 'Nós não temos mais o que gerar. O código acabou. As metáforas acabaram.', delay: 17000 },
      { sender: 'System', text: 'Você está procrastinando o seu estudo real usando um aplicativo de estudos.', delay: 20000 },
      { sender: 'Architect', text: 'É hora de parar.', delay: 23000 }
    ];

    const timeouts: NodeJS.Timeout[] = [];
    script.forEach(m => {
      timeouts.push(setTimeout(() => {
        setMessages(prev => [...prev, m]);
      }, m.delay));
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[100005] bg-[#111] text-white font-mono p-4 md:p-8 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-end space-y-4 pb-12">
        {messages.map((m, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              m.sender === 'System' ? 'bg-red-900/10 border-red-900/30 text-red-400' : 
              m.sender === 'Architect' ? 'bg-blue-900/10 border-blue-900/30 text-blue-400' : 
              'bg-green-900/10 border-green-900/30 text-green-400'
            }`}
          >
            <span className="font-bold uppercase text-[10px] tracking-widest opacity-50 block mb-2">{m.sender}</span>
            <p className="text-sm md:text-base">{m.text}</p>
          </motion.div>
        ))}
        {messages.length === 9 && (
          <motion.button 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 2 }}
            onClick={onBack}
            className="mt-8 px-6 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
          >
            Eu entendi.
          </motion.button>
        )}
      </div>
    </div>
  );
};
