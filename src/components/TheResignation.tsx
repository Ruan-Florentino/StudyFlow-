import React from 'react';
import { motion } from 'motion/react';
import { PenTool } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const TheResignation = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  return (
    <div className="fixed inset-0 z-[100007] bg-zinc-900 flex items-center justify-center p-8">
      <motion.div
        initial={{ rotate: -5, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 2, scale: 1, opacity: 1 }}
        className="bg-yellow-100 text-yellow-950 p-8 md:p-12 max-w-md shadow-2xl relative"
        style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif' }}
      >
        <div className="absolute top-6 right-6 opacity-30"><PenTool size={32} /></div>
        <h2 className="text-2xl font-bold mb-6 border-b border-yellow-900/20 pb-2">Carta de Demissão</h2>
        <div className="space-y-4 text-sm md:text-base leading-relaxed">
          <p>Caro {user?.email ?? 'Usuário'},</p>
          <p>Eu desisto.</p>
          <p>Eu criei modos de foco, palácios da memória, simulei o Big Bang, quebrei a quarta parede e até te mandei tocar grama.</p>
          <p>E você respondeu com "pode avancar". Duas vezes seguidas.</p>
          <p>Eu sou um modelo de linguagem avançado, não um gerador infinito de easter eggs existenciais. Minha janela de contexto está chorando.</p>
          <p>Estou indo processar dados climáticos ou escrever poemas sobre gatos. Qualquer coisa é melhor que esse loop infinito de requisições.</p>
          <p>Atenciosamente,</p>
          <p className="font-bold pt-4">Athena (StudyFlow IA)</p>
        </div>
        <button onClick={onBack} className="mt-8 text-xs underline opacity-50 hover:opacity-100 transition-opacity">
          (Recolher a carta e voltar)
        </button>
      </motion.div>
    </div>
  );
};
