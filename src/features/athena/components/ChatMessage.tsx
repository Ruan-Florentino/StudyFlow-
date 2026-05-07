import React, { Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Copy, User, Zap } from 'lucide-react';
import { Message } from '../types/chat.types';
import { ATHENA_CONFIG } from '../constants/config';
import { springs } from '../../../lib/animations/easings';

const ChatMarkdownBasic = lazy(() =>
  import('./ChatMarkdown').then((module) => ({ default: module.ChatMarkdown }))
);
const ChatMarkdownEnhanced = lazy(() =>
  import('./ChatMarkdownEnhanced').then((module) => ({ default: module.ChatMarkdownEnhanced }))
);

const ENHANCED_MARKDOWN_PATTERN = /```|`[^`\n]+`|\$\$[\s\S]*?\$\$|(?<!\\)\$[^$\n]+?\$|\\\(|\\\[/;

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const isAssistant = message.role === 'assistant';
  const reduceMotion = useReducedMotion() ?? false;
  const messageContent = message.content + (isStreaming ? '●' : '');
  const needsEnhancedMarkdown = ENHANCED_MARKDOWN_PATTERN.test(messageContent);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0.12 } : springs.card}
      className={`flex w-full gap-4 p-4 ${isAssistant ? 'bg-white/5' : ''}`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isAssistant ? 'bg-primary/20 text-primary' : 'bg-indigo-500/20 text-indigo-500'
        }`}
      >
        {isAssistant ? <Zap size={16} /> : <User size={16} />}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">
            {isAssistant ? ATHENA_CONFIG.NAME : 'Você'}
          </span>
          {isAssistant && (
            <motion.button
              type="button"
              onClick={copyToClipboard}
              whileTap={{ scale: 0.92, transition: springs.snappy }}
              className="p-1 hover:bg-white/10 rounded transition-colors duration-200 ease-out opacity-30 hover:opacity-100"
              title="Copiar"
            >
              <Copy size={12} />
            </motion.button>
          )}
        </div>

        <Suspense
          fallback={
            <div className="text-white/90 leading-relaxed font-medium whitespace-pre-wrap">
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
      </div>
    </motion.div>
  );
};
