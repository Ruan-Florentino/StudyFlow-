import React from 'react';

export function QuestionsLoadingSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-32 bg-gray-200 rounded mb-3" />
      <div className="h-32 bg-gray-200 rounded mb-3" />
      <div className="h-32 bg-gray-200 rounded" />
    </div>
  );
}
