import React from 'react';

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-6xl mb-4">📚</div>
      
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
      
      <button
        onClick={handleRetry}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        {isChunkError ? '🔄 Atualizar agora' : '🔄 Tentar novamente'}
      </button>
    </div>
  );
}
