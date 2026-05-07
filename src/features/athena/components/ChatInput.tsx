import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { motion } from 'motion/react';
import { springs } from '../../../lib/animations/easings';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, placeholder }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-primary/50 transition-all duration-300 ease-out shadow-2xl backdrop-blur-xl">
      <div className="flex items-end gap-2 px-2">
        <button className="p-2.5 text-white/30 hover:text-white transition-colors shrink-0">
          <Paperclip size={20} />
        </button>
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Pergunte algo para ATHENA V3…'}
          rows={1}
          className="flex-1 bg-transparent border-none py-2.5 text-sm text-white outline-none resize-none max-h-[200px] scrollbar-none placeholder:text-white/20"
          disabled={disabled}
        />

        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          whileTap={input.trim() && !disabled ? { scale: 0.94, transition: springs.snappy } : undefined}
          className={`p-2.5 rounded-xl transition-all duration-200 ease-out shrink-0 ${
            input.trim() && !disabled
              ? 'bg-primary text-black shadow-[0_0_20px_rgba(var(--hub-primary-rgb),0.35)] scale-100'
              : 'bg-white/5 text-white/20 scale-95'
          }`}
        >
          <Send size={20} />
        </motion.button>
      </div>
    </div>
  );
};
