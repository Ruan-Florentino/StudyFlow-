import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

interface ChatMarkdownEnhancedProps {
  content: string;
}

export const ChatMarkdownEnhanced: React.FC<ChatMarkdownEnhancedProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-white/90 leading-relaxed font-medium">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
