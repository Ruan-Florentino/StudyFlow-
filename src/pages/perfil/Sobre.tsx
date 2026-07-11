import React from 'react';
import { GlassCard } from '../../components/UI';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AthenaLogo } from '../../components/brand/AthenaLogo';

export const Sobre = () => {
    const navigate = useNavigate();
    return (
        <div className="app-shell-premium max-w-xl pt-6 md:pt-8 pb-32 md:pb-36">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-white/60 hover:text-white">
            <ChevronLeft size={20} /> Voltar
          </button>
          <GlassCard className="p-8 space-y-6">
            <AthenaLogo variant="horizontal" size={72} accessibilityLabel="Athena — sua IA de estudos" />
            <h1 className="sr-only">Athena</h1>
            <p className="text-white/60">Versão 1.0.0</p>
            <p className="text-sm">Sua inteligência de estudos para organizar o foco, praticar questões e evoluir com clareza.</p>
            <p className="text-xs leading-relaxed text-white/45">Identidade Athena: capacete, sabedoria e estratégia aplicados à aprendizagem.</p>
            <div className="border-t border-white/10 pt-6 text-sm text-white/40">
                <p>&copy; 2026 Altavista Holding LTDA</p>
                <p>Todos os direitos reservados.</p>
            </div>
          </GlassCard>
        </div>
    );
};
