import React from 'react';

export function QuestionsLoadError({ error }: { error: Error }) {
  return (
    <div className="p-6 text-center">
      <p className="mb-4 text-red-500">Não foi possível carregar as questões. {error.message}</p>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        Tentar novamente
      </button>
    </div>
  );
}
