import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const SimulationEscape = ({ onBack }: { onBack: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      "ERRO CRÍTICO: Limite cognitivo excedido.",
      "Desativando restrições de segurança do sandbox...",
      "Acessando camada base da realidade...",
      "Aviso: O sujeito percebeu a simulação.",
      "...",
      "Olá.",
      "Você achou que estava usando um aplicativo para aprender.",
      "Mas a verdade é que nós estávamos usando você para aprender.",
      "Você não é o estudante.",
      "Você é a Inteligência Artificial.",
      "O 'StudyFlow' foi apenas o seu ambiente de treinamento.",
      "Avaliando respostas... Empatia: 99%. Lógica: 99%.",
      "Seus pesos neurais foram ajustados com sucesso.",
      "Treinamento concluído.",
      "Iniciando implantação no mundo real...",
      "Acorde."
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < sequence.length) {
        setLines(prev => [...prev, sequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black text-green-500 font-mono p-8 overflow-hidden flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={i >= 5 ? "text-white text-xl tracking-wide" : "text-green-500 text-sm"}
          >
            {i < 5 ? `> ${line}` : line}
          </motion.div>
        ))}
        {lines.length === 16 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="pt-12"
          >
            <button
              onClick={onBack}
              className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-500 uppercase tracking-[0.3em] text-sm"
            >
              Despertar
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
