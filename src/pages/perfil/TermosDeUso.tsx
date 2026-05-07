import React from 'react';
import { GlassCard } from '../../components/UI';
import { LegalDocumentView } from '../../components/LegalDocumentView';
import { TERMOS_DE_USO } from '../../data/legalContent';
import { ChevronLeft, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermosDeUso = () => {
  const navigate = useNavigate();
  return (
    <div className="app-shell-premium max-w-3xl pt-6 md:pt-8 pb-32 md:pb-36">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-white/60 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-lg px-1 py-1"
      >
        <ChevronLeft size={20} aria-hidden /> Voltar
      </button>

      <div className="mb-4 flex items-center gap-3 text-white/50">
        <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/25 flex items-center justify-center">
          <Scale size={20} className="text-[var(--color-primary)]" aria-hidden />
        </div>
        <p className="text-[11px] leading-snug max-w-md">
          Documento jurídico. Em caso de conflito entre o App e este texto, prevalece a versão publicada
          aqui na data indicada no documento, salvo o que a lei impedir.
        </p>
      </div>

      <GlassCard className="p-6 md:p-8 border-white/10">
        <LegalDocumentView markdown={TERMOS_DE_USO} />
      </GlassCard>
    </div>
  );
};
