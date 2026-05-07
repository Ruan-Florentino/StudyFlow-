import React from 'react';
import Markdown from 'react-markdown';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  return <Markdown>{content}</Markdown>;
};
