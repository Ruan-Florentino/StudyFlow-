import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { motion } from 'motion/react';
import { Copy, RotateCcw, User, Zap } from 'lucide-react';
import { Message } from '../types/chat.types';
import { ATHENA_CONFIG } from '../constants/config';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const isAssistant = message.role === 'assistant';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full gap-4 p-4 ${isAssistant ? 'bg-white/5' : ''}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isAssistant ? 'bg-emerald-500/20 text-emerald-500' : 'bg-indigo-500/20 text-indigo-500'
      }`}>
        {isAssistant ? <Zap size={16} /> : <User size={16} />}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">
            {isAssistant ? ATHENA_CONFIG.NAME : 'Você'}
          </span>
          {isAssistant && (
            <button 
              onClick={copyToClipboard}
              className="p-1 hover:bg-white/10 rounded transition-colors opacity-30 hover:opacity-100"
              title="Copiar"
            >
              <Copy size={12} />
            </button>
          )}
        </div>

        <div className="prose prose-invert prose-sm max-w-none text-white/90 leading-relaxed font-medium">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeHighlight]}
          >
            {message.content + (isStreaming ? '●' : '')}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};
