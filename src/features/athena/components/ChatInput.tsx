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
    <div className="athena-input-shell relative rounded-[24px] p-2 transition-all duration-300 ease-out backdrop-blur-xl">
      <div className="flex items-end gap-2 px-1 sm:px-2">
        <button
          type="button"
          className="shrink-0 rounded-2xl p-2.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white"
          title="Anexar arquivo"
        >
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Pergunte algo para ATHENA V3...'}
          rows={1}
          className="max-h-[200px] min-h-[44px] flex-1 resize-none border-none bg-transparent py-3 text-sm font-medium leading-relaxed text-white outline-none scrollbar-none placeholder:text-white/25"
          disabled={disabled}
        />

        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          whileTap={input.trim() && !disabled ? { scale: 0.94, transition: springs.snappy } : undefined}
          className={`athena-signal shrink-0 rounded-2xl p-3 transition-all duration-200 ease-out ${
            input.trim() && !disabled
              ? 'scale-100 bg-primary text-black shadow-[0_0_24px_rgba(var(--hub-primary-rgb),0.38)]'
              : 'scale-95 bg-white/5 text-white/20'
          }`}
          title="Enviar mensagem"
        >
          <Send size={20} />
        </motion.button>
      </div>
    </div>
  );
};
