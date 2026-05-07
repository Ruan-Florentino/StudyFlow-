import React from 'react';
import { GlassCard } from '../../components/UI';
import { LegalDocumentView } from '../../components/LegalDocumentView';
import { PRIVACIDADE_CONTENT } from '../../data/legalContent';
import { ChevronLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PoliticaPrivacidade = () => {
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

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-[rgba(var(--hub-primary-rgb),0.2)] bg-[rgba(var(--hub-primary-rgb),0.06)] p-4 text-white/70">
        <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
          <Shield size={20} className="text-emerald-400" aria-hidden />
        </div>
        <div className="space-y-1 text-[11px] leading-snug max-w-2xl">
          <p className="font-bold text-white/90 uppercase tracking-wider font-premium-mono">
            Política ampliada — mais de 200 pontos numerados
          </p>
          <p>
            Cada <strong className="text-white/95">Ponto</strong> é sequencial (001, 002, …) para você citar em pedidos ao
            encarregado (Art. 18 LGPD), auditorias internas ou relatórios à ANPD. O texto cobre definições, finalidades,
            bases legais, IA, subprocessadores, retenção, segurança e transferência internacional.
          </p>
          <p className="text-white/50">
            LGPD (Lei 13.709/2018). Dúvidas: <span className="text-white/80">altavistaholdingltda@gmail.com</span>
          </p>
        </div>
      </div>

      <GlassCard className="p-6 md:p-8 border-white/10">
        <LegalDocumentView markdown={PRIVACIDADE_CONTENT} />
      </GlassCard>
    </div>
  );
};
