import React from 'react';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { GlassCard, AnimatedButton } from './UI';

interface ViewDisabledFallbackProps {
  feature: string;
  onBack: () => void;
}

export const ViewDisabledFallback = ({ feature, onBack }: ViewDisabledFallbackProps) => {
  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <GlassCard className="p-8 text-center max-w-sm space-y-6" glow>
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle size={32} className="text-rose-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Acesso Restrito</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            O recurso <span className="text-rose-400 font-bold">{feature}</span> está temporariamente desativado para manutenção ou processamento neural.
          </p>
        </div>

        <AnimatedButton onClick={onBack} variant="secondary" className="w-full py-3 text-xs uppercase tracking-widest font-bold">
          <ChevronLeft size={16} className="mr-2" />
          Voltar ao Banco
        </AnimatedButton>
      </GlassCard>
    </div>
  );
};

export default ViewDisabledFallback;
