import React from 'react';
import { GlassCard } from '../../components/UI';
import { TERMOS_DE_USO } from '../../data/legalContent';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermosDeUso = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-white/60 hover:text-white">
        <ChevronLeft size={20} /> Voltar
      </button>
      <GlassCard className="p-8">
        <div className="prose prose-invert prose-sm max-w-none">
            <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>{TERMOS_DE_USO}</pre>
        </div>
      </GlassCard>
    </div>
  );
};
