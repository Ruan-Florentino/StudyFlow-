import React, { useState } from 'react';
import { GlassCard, AnimatedButton } from '../../components/UI';
import { ChevronLeft, Mail, Copy, ExternalLink, Smartphone, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../store/useToastStore';
import {
  SUPPORT_EMAIL,
  buildMailtoStoreIssue,
  postPurchaseEmailTemplate,
} from '../../lib/supportPostPurchase';

const PLAY_SUBSCRIPTIONS_HELP = 'https://support.google.com/googleplay/answer/2476088';
const APPLE_SUBSCRIPTIONS_HELP = 'https://support.apple.com/billing';

export const Suporte = () => {
  const navigate = useNavigate();
  const [templateOpen, setTemplateOpen] = useState(false);

  const handleSendEmail = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Suporte StudyFlow')}`;
  };

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(SUPPORT_EMAIL);
    toast.success('Sucesso', 'E-mail copiado para a área de transferência.');
  };

  const handleCopyTemplate = async () => {
    await navigator.clipboard.writeText(postPurchaseEmailTemplate);
    toast.success('Copiado', 'Modelo de mensagem copiado. Cole no seu e-mail e preencha os campos.');
  };

  const handleOpenStoreIssueMail = () => {
    window.location.href = buildMailtoStoreIssue();
  };

  return (
    <div className="app-shell-premium max-w-xl pt-6 md:pt-8 pb-32 md:pb-36">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-white/60 hover:text-white"
      >
        <ChevronLeft size={20} /> Voltar
      </button>

      <div className="space-y-6">
        <GlassCard className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary">
            <Mail size={32} />
          </div>

          <h1 className="text-2xl font-bold">Suporte oficial</h1>
          <p className="text-white/60">Altavista Holding LTDA · StudyFlow</p>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-lg font-mono break-all">{SUPPORT_EMAIL}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <AnimatedButton onClick={handleCopyEmail} className="flex items-center gap-2">
                <Copy size={16} /> Copiar
              </AnimatedButton>
              <AnimatedButton onClick={handleSendEmail} variant="secondary" className="flex items-center gap-2">
                <ExternalLink size={16} /> Enviar
              </AnimatedButton>
            </div>
          </div>

          <div className="text-left text-sm text-white/60 space-y-2">
            <p>
              <span className="text-white/80 font-semibold">Horário:</span> seg a sex, 9h–18h (horário de Brasília).
            </p>
            <p>
              <span className="text-white/80 font-semibold">Resposta:</span> até 72h úteis na fila geral.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4 border-[rgba(var(--hub-primary-rgb),0.18)]">
          <div className="flex items-center gap-2 text-white/90">
            <Smartphone size={20} className="text-primary shrink-0" aria-hidden />
            <h2 className="text-lg font-bold">Assinatura na loja (Google Play / App Store)</h2>
          </div>
          <p className="text-xs text-white/65 leading-relaxed">
            Se a compra aparece <strong className="text-white/85">ativa na loja</strong>, mas o app não liberou o
            Premium, use primeiro o menu de assinaturas do sistema. Se não resolver, fale conosco com{' '}
            <strong className="text-white/85">comprovante</strong> (print ou ID do pedido).
          </p>
          <ul className="text-xs text-white/55 space-y-2 list-disc pl-5">
            <li>
              <a
                href={PLAY_SUBSCRIPTIONS_HELP}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Gerenciar assinaturas no Google Play
              </a>
            </li>
            <li>
              <a
                href={APPLE_SUBSCRIPTIONS_HELP}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Cobranças e assinaturas da Apple
              </a>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <AnimatedButton onClick={handleOpenStoreIssueMail} className="flex items-center justify-center gap-2 w-full sm:flex-1">
              <Mail size={16} /> Abrir e-mail (caso loja + app)
            </AnimatedButton>
            <AnimatedButton
              onClick={() => setTemplateOpen((o) => !o)}
              variant="secondary"
              className="flex items-center justify-center gap-2 w-full sm:flex-1"
            >
              <ClipboardList size={16} /> {templateOpen ? 'Ocultar modelo' : 'Ver modelo de mensagem'}
            </AnimatedButton>
          </div>

          {templateOpen ? (
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-2">
              <pre className="text-[11px] text-white/70 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
                {postPurchaseEmailTemplate}
              </pre>
              <AnimatedButton onClick={handleCopyTemplate} variant="secondary" className="w-full text-xs">
                Copiar modelo
              </AnimatedButton>
            </div>
          ) : null}
        </GlassCard>
      </div>
    </div>
  );
};
