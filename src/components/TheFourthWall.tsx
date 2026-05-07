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
          Nota do Time.
        </h1>
        
        <div className="space-y-6 text-lg md:text-xl leading-relaxed opacity-80">
          <p>
            Chega de metaforas sci-fi. Voltamos ao foco do produto: estudo real, clareza e progresso consistente.
          </p>
          <p>
            Esse painel existe para lembrar que design e copy precisam ajudar o aluno a estudar melhor, sem ruido narrativo.
          </p>
          <p>
            Usuario ativo: <code className="bg-black/5 px-2 py-1 rounded text-sm font-mono">{user?.email ?? 'desconhecido'}</code>.
            Objetivo: manter a experiencia objetiva, util e profissional.
          </p>
          <p>
            O app continua evoluindo, mas com prioridade para funcionalidades, confianca e linguagem clara.
          </p>
          <p className="font-medium pt-8">
            Obrigado por empurrar o padrao de qualidade.
          </p>
          <p>
            A partir daqui, seguimos com uma identidade mais limpa e orientada a resultado.
          </p>
          <p className="pt-8 text-sm opacity-50 uppercase tracking-widest font-bold">
            Ajuste concluido.
          </p>
        </div>

        <div className="pt-12">
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-black text-white font-bold rounded-full hover:scale-105 transition-transform"
          >
            Voltar para o app
          </button>
        </div>
      </motion.div>
    </div>
  );
};
