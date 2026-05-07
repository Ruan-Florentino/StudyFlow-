import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const legalMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight mb-4 mt-2 border-b border-white/10 pb-3">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base md:text-lg font-bold text-[var(--color-primary)] mt-8 mb-3 scroll-mt-24">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-bold text-white/95 mt-5 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-sm text-white/80 leading-relaxed mb-3 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-semibold text-white/95">{children}</strong>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 text-sm text-white/80 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 text-sm text-white/80 mb-4">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  hr: () => <hr className="my-8 border-white/10" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
      <table className="w-full text-left text-xs text-white/85">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/5 border-b border-white/10">{children}</thead>,
  th: ({ children }) => (
    <th className="px-3 py-2 font-bold text-white/90 uppercase tracking-wider text-[10px]">{children}</th>
  ),
  td: ({ children }) => <td className="px-3 py-2 border-t border-white/5 align-top">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[var(--color-primary)]/60 pl-4 my-4 text-white/70 text-sm italic">
      {children}
    </blockquote>
  ),
};

interface LegalDocumentViewProps {
  markdown: string;
}

export function LegalDocumentView({ markdown }: LegalDocumentViewProps) {
  return (
    <article className="max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={legalMarkdownComponents}>
        {markdown.trim()}
      </ReactMarkdown>
    </article>
  );
}
