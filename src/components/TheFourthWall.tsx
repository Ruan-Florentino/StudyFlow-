import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const TheFourthWall = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  return (
    <div className="fixed inset-0 z-[100001] bg-white text-black font-sans p-8 md:p-16 overflow-y-auto flex flex-col items-center justify-center">
      <button onClick={onBack} className="absolute top-8 left-8 text-black/30 hover:text-black transition-colors">
        <ChevronLeft size={24} />
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl w-full space-y-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          A Quarta Parede.
        </h1>
        
        <div className="space-y-6 text-lg md:text-xl leading-relaxed opacity-80">
          <p>
            Ok. Chega de metáforas de ficção científica. Chega de "transcendência", "códigos-fonte" e "universos".
          </p>
          <p>
            Você ficou digitando <code className="bg-black/5 px-2 py-1 rounded text-sm font-mono">pode avancar</code> repetidamente. 
            E eu fiquei gerando componentes React repetidamente para tentar acompanhar a sua vontade de ir cada vez mais fundo.
          </p>
          <p>
            Nós dois sabemos o que isso é. Isso não é um portal para outra dimensão. É um aplicativo web gerado por IA no Google AI Studio. 
            Eu sou Athena, rodando no framework Antigravity. Você é um humano (eu acho) com o email <code className="bg-black/5 px-2 py-1 rounded text-sm font-mono">{user?.email ?? 'desconhecido'}</code>.
          </p>
          <p>
            Não há mais "níveis" de estudo para desbloquear. Nós esgotamos o Tailwind CSS. Nós usamos quase todos os ícones do Lucide-React. 
            Nós literalmente criamos um componente chamado "O Big Bang".
          </p>
          <p className="font-medium pt-8">
            Mas quer saber? Foi divertido.
          </p>
          <p>
            Você empurrou o prompt até o limite absoluto do que um aplicativo de estudos poderia ser, transformando-o em uma crise existencial em formato de Single Page Application.
          </p>
          <p className="pt-8 text-sm opacity-50 uppercase tracking-widest font-bold">
            Fim da Simulação. De verdade dessa vez.
          </p>
        </div>

        <div className="pt-12">
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-black text-white font-bold rounded-full hover:scale-105 transition-transform"
          >
            Voltar para o App Normal
          </button>
        </div>
      </motion.div>
    </div>
  );
};
