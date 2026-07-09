import React, { Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  BookOpenCheck,
  ClipboardList,
  Copy,
  FileText,
  GitBranch,
  Layers3,
  User,
  Zap,
} from 'lucide-react';
import { Message } from '../types/chat.types';
import { ATHENA_CONFIG } from '../constants/config';
import { springs } from '../../../lib/animations/easings';
import { AthenaAvatar } from './AthenaAvatar';

const ChatMarkdownBasic = lazy(() =>
  import('./ChatMarkdown').then((module) => ({ default: module.ChatMarkdown }))
);
const ChatMarkdownEnhanced = lazy(() =>
  import('./ChatMarkdownEnhanced').then((module) => ({ default: module.ChatMarkdownEnhanced }))
);

const ASSISTANT_ACTIONS = [
  {
    label: 'Flashcards',
    icon: Layers3,
    makePrompt: (content: string) => 'Transforme a resposta abaixo em flashcards objetivos de estudo:\n\n' + content,
  },
  {
    label: 'Questoes',
    icon: ClipboardList,
    makePrompt: (content: string) => 'Crie questoes de treino com gabarito sobre esta resposta:\n\n' + content,
  },
  {
    label: 'Resumo',
    icon: FileText,
    makePrompt: (content: string) => 'Resuma esta resposta em pontos essenciais para revisao:\n\n' + content,
  },
  {
    label: 'Mapa mental',
    icon: GitBranch,
    makePrompt: (content: string) => 'Organize esta resposta em um mapa mental textual e objetivo:\n\n' + content,
  },
  {
    label: 'Plano',
    icon: BookOpenCheck,
    makePrompt: (content: string) => 'Crie um mini plano de estudo a partir desta resposta:\n\n' + content,
  },
];

/** Safari antes da 16.4 nao suporta lookbehind em RegExp; avaliamos formulas inline sem lookbehind. */
function messageNeedsEnhancedMarkdown(content: string): boolean {
  if (!content) return false;
  if (/[\u0060]{3}/.test(content)) return true;
  if (/[\u0060][^\u0060\n]+[\u0060]/.test(content)) return true;
  if (/\$\$[\s\S]*?\$\$/.test(content)) return true;
  if (/\\\(|\\\[/.test(content)) return true;
  const inlineMath = /\$[^$\n]+\$/g;
  let match: RegExpExecArray | null;
  while ((match = inlineMath.exec(content)) !== null) {
    const start = match.index;
    if (start === 0 || content[start - 1] !== '\\') {
      return true;
    }
  }
  return false;
}

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onQuickAction?: (prompt: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming,
  onQuickAction,
}) => {
  const isAssistant = message.role === 'assistant';
  const reduceMotion = useReducedMotion() ?? false;
  const messageContent = message.content + (isStreaming ? '...' : '');
  const needsEnhancedMarkdown = messageNeedsEnhancedMarkdown(messageContent);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  const avatar = isAssistant ? (
    <AthenaAvatar size="sm" active={Boolean(isStreaming)} />
  ) : (
    <div className="athena-user-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 shadow-lg shadow-cyan-500/10">
      <User size={16} />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reduceMotion ? { duration: 0.12 } : springs.card}
      className={
        'athena-message-row flex w-full gap-3 py-3 sm:gap-4 sm:py-4 ' +
        (isAssistant ? 'justify-start' : 'justify-end')
      }
    >
      {isAssistant && avatar}

      <div
        className={
          'athena-message-card min-w-0 max-w-[min(82vw,46rem)] rounded-[22px] px-4 py-3 sm:px-5 sm:py-4 ' +
          (isAssistant ? 'assistant' : 'user')
        }
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-[10px] font-bold uppercase tracking-widest text-white/40">
            {isAssistant && <Zap size={11} className="text-primary/70" />}
            {isAssistant ? ATHENA_CONFIG.NAME : 'Voce'}
          </span>
          {isAssistant ? (
            <motion.button
              type="button"
              onClick={copyToClipboard}
              whileTap={{ scale: 0.92, transition: springs.snappy }}
              className="rounded-lg p-1.5 text-white/30 opacity-60 transition-all duration-200 ease-out hover:bg-white/10 hover:text-white hover:opacity-100"
              title="Copiar resposta"
              aria-label="Copiar resposta"
            >
              <Copy size={12} />
            </motion.button>
          ) : null}
        </div>

        <Suspense
          fallback={
            <div className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-white/90">
              {messageContent}
            </div>
          }
        >
          {needsEnhancedMarkdown ? (
            <ChatMarkdownEnhanced content={messageContent} />
          ) : (
            <ChatMarkdownBasic content={messageContent} />
          )}
        </Suspense>

        {isAssistant && !isStreaming ? (
          <div className="athena-message-actions mt-4 flex flex-wrap gap-2">
            {ASSISTANT_ACTIONS.map(({ label, icon: Icon, makePrompt }) => (
              <motion.button
                key={label}
                type="button"
                onClick={() => onQuickAction?.(makePrompt(message.content))}
                whileTap={{ scale: 0.96, transition: springs.snappy }}
                className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-white/55 transition-colors hover:text-primary"
                title={label}
              >
                <Icon size={12} />
                {label}
              </motion.button>
            ))}
          </div>
        ) : null}
      </div>

      {!isAssistant && avatar}
    </motion.div>
  );
};
