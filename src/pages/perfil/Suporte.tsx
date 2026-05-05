import React from 'react';
import { GlassCard, AnimatedButton } from '../../components/UI';
import { ChevronLeft, Mail, Copy, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../store/useToastStore';

export const Suporte = () => {
    const navigate = useNavigate();
    const handleSendEmail = () => {
        window.location.href = 'mailto:altavistaholdingltda@gmail.com?subject=Suporte StudyFlow';
      };
    
      const handleCopyEmail = async () => {
        await navigator.clipboard.writeText('altavistaholdingltda@gmail.com');
        toast.success("Sucesso", "Email copiado para a área de transferência!");
      };

    return (
        <div className="app-shell-premium max-w-xl pt-6 md:pt-8 pb-32 md:pb-36">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-white/60 hover:text-white">
            <ChevronLeft size={20} /> Voltar
          </button>
          <GlassCard className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary">
                <Mail size={32} />
            </div>
            
            <h1 className="text-2xl font-bold">Suporte Oficial</h1>
            <p className="text-white/60">Altavista Holding LTDA</p>
            
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-lg font-mono">altavistaholdingltda@gmail.com</p>
                <div className="flex gap-2 justify-center mt-4">
                    <AnimatedButton onClick={handleCopyEmail} className="flex items-center gap-2"><Copy size={16}/> Copiar</AnimatedButton>
                    <AnimatedButton onClick={handleSendEmail} variant="secondary" className="flex items-center gap-2"><ExternalLink size={16}/> Enviar</AnimatedButton>
                </div>
            </div>

            <div className="text-left text-sm text-white/60 space-y-2">
                <p>⏰ <b>Horário:</b> Seg a Sex, 9h-18h</p>
                <p>⚡ <b>Resposta:</b> Até 72h</p>
            </div>
          </GlassCard>
        </div>
    );
};
