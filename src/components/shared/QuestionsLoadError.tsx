import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { springs } from '../../lib/animations';

interface QuestionsLoadErrorProps {
  error?: Error;
  onRetry?: () => void;
}

export function QuestionsLoadError({ error, onRetry }: QuestionsLoadErrorProps) {
  const isChunkError = error?.message?.includes('dynamically imported module') 
    || error?.message?.includes('Loading chunk');

  const handleRetry = () => {
    if (isChunkError) {
      // Limpa cache e recarrega
      window.location.reload();
    } else {
      onRetry?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.card}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
    >
      <div className="text-6xl mb-4" aria-hidden>📚</div>
      
      <h2 className="text-xl font-semibold text-white mb-2 text-center">
        {isChunkError 
          ? 'Nova versão disponível!' 
          : 'Erro ao carregar questões'}
      </h2>
      
      <p className="text-gray-400 text-center mb-6 max-w-md">
        {isChunkError
          ? 'Detectamos uma atualização do app. Vamos recarregar para você.'
          : 'Não conseguimos carregar as questões agora. Verifique sua conexão e tente novamente.'}
      </p>
      
      <motion.button
        onClick={handleRetry}
        whileTap={{ scale: 0.97 }}
        transition={springs.snappy}
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-xl font-bold transition-colors duration-300 ease-out"
      >
        <RefreshCw size={16} />
        {isChunkError ? 'Atualizar agora' : 'Tentar novamente'}
      </motion.button>
    </motion.div>
  );
}
