import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { springs } from '../../../lib/animations/easings';
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  FileCheck,
  History,
  MessageSquare,
  PenLine,
  Plus,
  Shield,
  Sidebar,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { AthenaAvatar } from './AthenaAvatar';
import { useAthena } from '../hooks/useAthena';
import { ATHENA_MODELS, DEFAULT_MODEL } from '../constants/models';
import type { ChatSession } from '../types/chat.types';
import { ATHENA_CONFIG } from '../constants/config';
import { AIModel } from '../types/model.types';

const ATHENA_EMPTY_SUGGESTIONS = [
  {
    action: 'Me ajude a resolver uma questao passo a passo.',
    title: 'Resolver questao',
    hint: 'Passo a passo com explicacao',
    icon: BookOpenCheck,
  },
  {
    action: 'Monte uma estrutura de redacao nota 1000 sobre:',
    title: 'Redacao nota 1000',
    hint: 'Estrutura, repertorio e tese',
    icon: PenLine,
  },
  {
    action: 'Faca uma revisao rapida e objetiva sobre:',
    title: 'Revisar materia',
    hint: 'Resumo direto e questoes',
    icon: Brain,
  },
  {
    action: 'Corrija minha redacao no modelo ENEM:',
    title: 'Corrigir redacao',
    hint: 'Nota por competencia',
    icon: FileCheck,
  },
];

interface AthenaChatProps {
  context?: 'home' | 'hub' | 'redacao' | 'questoes' | 'trilhas' | 'sidebar';
  greeting?: string;
  placeholder?: string;
  systemPrompt?: string;
  showSidebar?: boolean;
  defaultSidebarOpen?: boolean;
  compact?: boolean;
  sidebarInCompact?: boolean;
}

export const AthenaChat: React.FC<AthenaChatProps> = ({
  context = 'home',
  greeting,
  placeholder,
  systemPrompt,
  showSidebar: sidebarEnabled = false,
  defaultSidebarOpen = false,
  compact = false,
  sidebarInCompact = false,
}) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>(DEFAULT_MODEL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultSidebarOpen);
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const allowSidebar = !compact || sidebarInCompact;
  const sidebarTransition = reduceMotion
    ? { duration: 0.15, ease: [0.22, 1, 0.36, 1] as const }
    : springs.soft;

  const {
    messages,
    loading,
    sendMessage,
    clearChat,
    sessions,
    loadSession,
    deleteSession,
  } = useAthena(selectedModel, context, systemPrompt);

  const focusComposer = () => {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handlePromptDraft = (prompt: string) => {
    setDraft(prompt);
    focusComposer();
  };

  const handleSendDraft = (content: string) => {
    sendMessage(content, selectedModel);
  };

  const handleNewChat = () => {
    clearChat();
    setDraft('');
    if (compact && sidebarInCompact) setIsSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    const session: ChatSession | null = loadSession(id);
    if (session) {
      const nextModel = ATHENA_MODELS.find((item) => item.id === session.modelId);
      if (nextModel) setSelectedModel(nextModel);
    }
    if (compact && sidebarInCompact) setIsSidebarOpen(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div
      className={
        compact
          ? 'athena-chat-shell athena-chat-shell-compact flex h-full min-h-0 w-full overflow-hidden rounded-[24px] backdrop-blur-xl'
          : 'athena-chat-shell flex h-full min-h-0 w-full overflow-hidden rounded-[30px] backdrop-blur-3xl max-md:rounded-[24px]'
      }
    >
      <AnimatePresence>
        {sidebarEnabled && allowSidebar && isSidebarOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] cursor-pointer border-0 bg-black/60 p-0 md:hidden"
              aria-label="Fechar historico de conversas"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={sidebarTransition}
              className="athena-sidebar-panel mobile-dvh-panel flex h-full shrink-0 flex-col overflow-hidden border-r max-md:fixed max-md:left-0 max-md:top-0 max-md:z-[60] max-md:max-h-screen max-md:shadow-2xl md:relative"
            >
              <div className="athena-chat-header flex items-center justify-between gap-2 border-b border-white/10 p-4">
                <h3 className="flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50">
                  <History size={14} />
                  <span className="truncate">Historico</span>
                </h3>
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="athena-signal shrink-0 rounded-2xl bg-primary/10 p-2 text-primary transition-colors duration-200 ease-out hover:bg-primary/20"
                  title="Nova conversa"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto p-2 no-scrollbar">
                {sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-white/30">
                    <MessageSquare size={32} className="mb-3" />
                    <p className="text-xs leading-relaxed">
                      Nenhuma sessao salva ainda. Envie uma mensagem para criar a primeira.
                    </p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="group flex items-stretch gap-1 rounded-2xl border border-transparent transition-colors hover:border-white/10 hover:bg-white/5"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectSession(session.id)}
                        className="min-w-0 flex-1 px-3 py-2.5 text-left"
                      >
                        <p className="truncate text-xs font-bold text-white/90">
                          {session.title?.trim() || 'Conversa'}
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium text-white/40">
                          {new Date(session.lastUpdated).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="rounded-r-2xl px-2 text-white/20 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Excluir conversa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={
            compact
              ? 'athena-chat-header athena-chat-main-header flex shrink-0 flex-wrap items-center justify-between gap-2 p-2.5 backdrop-blur-xl'
              : 'athena-chat-header athena-chat-main-header flex shrink-0 flex-wrap items-center justify-between gap-2 p-3 backdrop-blur-xl sm:p-4'
          }
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            {sidebarEnabled && allowSidebar ? (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                title={isSidebarOpen ? 'Ocultar historico de conversas' : 'Ver historico de conversas'}
              >
                <Sidebar size={18} />
              </button>
            ) : null}

            <div className="athena-chat-identity flex min-w-0 items-center gap-2.5 sm:gap-3">
              <AthenaAvatar size={compact ? 'sm' : 'md'} active />
              <div className="flex min-w-0 flex-col">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className={compact ? 'text-xs font-black tracking-tight text-white' : 'text-xs font-black tracking-tight text-white sm:text-sm'}>
                    {ATHENA_CONFIG.NAME}
                  </span>
                  <span className="athena-chip athena-online-chip inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                    <span className="athena-status-dot" />
                    Online
                  </span>
                </div>
                {!compact ? (
                  <span className="hidden truncate text-[10px] font-medium text-white/45 sm:block">
                    {ATHENA_CONFIG.TAGLINE}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <ModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} />
            <button
              type="button"
              onClick={handleNewChat}
              className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-white/25 transition-all hover:border-red-400/25 hover:bg-red-500/10 hover:text-red-400"
              title="Limpar chat"
              aria-label="Limpar chat"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        <div
          className={
            'relative min-h-0 flex-1 overflow-y-auto no-scrollbar ' +
            (compact ? 'pt-2' : 'pt-4')
          }
        >
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0.12 } : springs.card}
                className={
                  compact
                    ? 'athena-empty-state flex h-full flex-col items-center justify-center p-4 text-center'
                    : 'athena-empty-state flex h-full flex-col items-center justify-center px-4 py-8 text-center sm:p-8'
                }
              >
                <div className="athena-hero-kicker mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em]">
                  <Sparkles size={12} />
                  Athena Intelligence
                </div>
                <AthenaAvatar size={compact ? 'lg' : 'xl'} active className={compact ? 'mb-3' : 'mb-4 sm:mb-5'} />

                <h2 className={compact ? 'mb-1 text-base font-bold text-white' : 'mb-2 text-lg font-bold text-white sm:text-2xl'}>
                  {greeting || 'Ola, eu sou a ' + ATHENA_CONFIG.NAME}
                </h2>
                <p className={compact ? 'mx-auto max-w-sm text-[11px] leading-relaxed text-white/58' : 'mx-auto max-w-md text-sm leading-relaxed text-white/58'}>
                  Sua tutora inteligente para ENEM, redacao e questoes.
                </p>
                {!compact ? (
                  <p className="athena-hero-subline mt-2 max-w-md text-xs leading-relaxed text-white/34">
                    Explique materias, corrija redacoes ou monte seu plano de estudos.
                  </p>
                ) : null}

                <div className={compact ? 'athena-suggestion-grid mt-4 grid w-full max-w-md grid-cols-2 gap-2' : 'athena-suggestion-grid mt-6 grid w-full max-w-lg grid-cols-2 gap-2 px-1 sm:mt-8 sm:gap-3 sm:px-0'}>
                  {ATHENA_EMPTY_SUGGESTIONS.map(({ action, title, hint, icon: Icon }, index) => (
                    <motion.button
                      key={action}
                      type="button"
                      onClick={() => handlePromptDraft(action)}
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={reduceMotion ? { duration: 0.12 } : { ...springs.card, delay: index * 0.045 }}
                      whileTap={{ scale: 0.97, transition: springs.snappy }}
                      className={compact ? 'athena-suggestion-card group rounded-2xl p-3 text-left' : 'athena-suggestion-card group rounded-[22px] p-4 text-left'}
                    >
                      <span className="athena-suggestion-icon mb-3 flex h-9 w-9 items-center justify-center rounded-2xl text-primary">
                        <Icon size={17} />
                      </span>
                      <span className="block text-[11px] font-black leading-snug text-white sm:text-xs">{title}</span>
                      <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-white/38">{hint}</span>
                      <ArrowRight className="absolute right-3 top-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-70" size={14} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} onQuickAction={handlePromptDraft} />
              ))
            )}

            {loading ? (
              <div className="athena-message-row athena-thinking-row flex items-center gap-3 py-5">
                <AthenaAvatar size="sm" active />
                <div className="flex gap-1">
                  <motion.div
                    animate={reduceMotion ? { opacity: [0.35, 1, 0.35] } : { y: [0, -5, 0] }}
                    transition={reduceMotion ? { repeat: Infinity, duration: 1.1, ease: 'easeInOut' } : { repeat: Infinity, duration: 0.6 }}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                  />
                  <motion.div
                    animate={reduceMotion ? { opacity: [0.35, 1, 0.35] } : { y: [0, -5, 0] }}
                    transition={reduceMotion ? { repeat: Infinity, duration: 1.1, ease: 'easeInOut', delay: 0.15 } : { repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                  />
                  <motion.div
                    animate={reduceMotion ? { opacity: [0.35, 1, 0.35] } : { y: [0, -5, 0] }}
                    transition={reduceMotion ? { repeat: Infinity, duration: 1.1, ease: 'easeInOut', delay: 0.3 } : { repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                  />
                </div>
                <div className="athena-thinking-skeleton h-2.5 w-24 rounded-full" />
                <span className="sr-only">{ATHENA_CONFIG.NAME} esta pensando</span>
              </div>
            ) : null}
          </AnimatePresence>
          <div ref={messagesEndRef} className={compact ? 'h-8' : 'h-20'} />
        </div>

        <div className={compact ? 'athena-composer-zone shrink-0 p-3' : 'athena-composer-zone shrink-0 p-3 sm:p-6'}>
          <ChatInput
            onSend={handleSendDraft}
            disabled={loading}
            placeholder={placeholder || 'Pergunte sobre ENEM, redacao ou questoes...'}
            value={draft}
            onChange={setDraft}
            inputRef={inputRef}
          />
          <div className={'athena-input-footer flex items-center justify-between px-2 ' + (compact ? 'mt-2' : 'mt-4')}>
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/25">
              <Shield size={10} />
              <span>{ATHENA_CONFIG.NAME} Intelligence</span>
            </div>
            {!compact ? (
              <div className="flex items-center gap-1 text-[9px] font-medium text-white/20">
                <span>Shift + Enter para nova linha</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
