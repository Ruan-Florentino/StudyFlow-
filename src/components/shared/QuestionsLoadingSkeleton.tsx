import React from 'react';

export function QuestionsLoadingSkeleton() {
  return (
    <div className="p-6 space-y-4" role="status" aria-label="Carregando questões">
      <div className="skeleton-shine h-4 rounded-md w-1/3 max-w-[12rem]" />
      <div className="skeleton-shine h-32 rounded-xl w-full" />
      <div className="skeleton-shine h-32 rounded-xl w-full" />
      <div className="skeleton-shine h-32 rounded-xl w-full" />
    </div>
  );
}
