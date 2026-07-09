import React, { useEffect, useRef, useState } from 'react';
import { Mic, Paperclip, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { springs } from '../../../lib/animations/easings';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled,
  placeholder,
  value,
  onChange,
  inputRef,
}) => {
  const [localInput, setLocalInput] = useState('');
  const [focused, setFocused] = useState(false);
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? internalRef;
  const input = value ?? localInput;
  const hasText = Boolean(input.trim());

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  }, [input, textareaRef]);

  const updateInput = (nextValue: string) => {
    if (value === undefined) setLocalInput(nextValue);
    onChange?.(nextValue);
  };

  const handleSend = () => {
    const content = input.trim();
    if (!content || disabled) return;

    onSend(content);
    updateInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="athena-input-shell relative rounded-[26px] p-2 transition-all duration-300 ease-out backdrop-blur-xl"
      data-focused={focused ? 'true' : 'false'}
      data-has-text={hasText ? 'true' : 'false'}
    >
      <div className="flex items-end gap-1.5 px-1 sm:gap-2 sm:px-2">
        <button
          type="button"
          className="athena-attach-button shrink-0 rounded-2xl p-2.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white"
          title="Anexar arquivo"
          aria-label="Anexar arquivo"
        >
          <Paperclip size={19} />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(event) => updateInput(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Pergunte sobre ENEM, redacao ou questoes...'}
          rows={1}
          aria-label="Mensagem para ATHENA V3"
          className="max-h-[200px] min-h-[44px] flex-1 resize-none border-none bg-transparent py-3 text-sm font-medium leading-relaxed text-white outline-none scrollbar-none placeholder:text-white/25"
          disabled={disabled}
        />

        <button
          type="button"
          className="athena-voice-button hidden shrink-0 rounded-2xl p-2.5 text-white/25 sm:inline-flex"
          title="Entrada por voz em breve"
          aria-label="Entrada por voz em breve"
          disabled
        >
          <Mic size={18} />
        </button>

        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!hasText || disabled}
          whileTap={hasText && !disabled ? { scale: 0.94, transition: springs.snappy } : undefined}
          className={
            'athena-send-button athena-signal shrink-0 rounded-2xl p-3 transition-all duration-200 ease-out ' +
            (hasText && !disabled
              ? 'scale-100 bg-primary text-black shadow-[0_0_24px_rgba(var(--hub-primary-rgb),0.3)]'
              : 'scale-95 bg-white/5 text-white/20')
          }
          title="Enviar mensagem"
          aria-label="Enviar mensagem"
        >
          <Send size={19} />
        </motion.button>
      </div>
    </div>
  );
};
