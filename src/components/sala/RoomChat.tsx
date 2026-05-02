import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: number;
  color: string;
}

const MOCK_MESSAGES: Message[] = [
  { id: '1', user: 'Marina', text: 'Bom dia, galera 💚', timestamp: Date.now() - 600000, color: '#34d399' },
  { id: '2', user: 'João',   text: 'Bora estudar!', timestamp: Date.now() - 540000, color: '#38bdf8' },
  { id: '3', user: 'Ana',    text: 'Alguém tem dica de exercício?', timestamp: Date.now() - 300000, color: '#f472b6' },
  { id: '4', user: 'Pedro',  text: 'Tem na aba questões 👍', timestamp: Date.now() - 240000, color: '#fbbf24' },
  { id: '5', user: 'Sofia',  text: 'Esse lofi é viciante kkk', timestamp: Date.now() - 60000, color: '#a78bfa' },
];

interface RoomChatProps {
  color: string;
  glow: string;
}

export function RoomChat({ color, glow }: RoomChatProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      user: 'Você',
      text: input,
      timestamp: Date.now(),
      color,
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };
  
  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 60000);
    if (diff < 1) return 'agora';
    if (diff < 60) return `${diff}m`;
    return `${Math.floor(diff / 60)}h`;
  };
  
  return (
    <div 
      className="rounded-3xl flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        height: '320px',
      }}
    >
      {/* Lista de mensagens */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2"
          >
            {/* Avatar */}
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
              style={{
                background: `linear-gradient(135deg, ${msg.color}, rgba(0,0,0,0.3))`,
                color: '#fff',
                boxShadow: `0 0 8px ${msg.color}40`,
              }}
            >
              {msg.user.charAt(0)}
            </div>
            
            {/* Mensagem */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-[11px] font-bold"
                  style={{ color: msg.color }}
                >
                  {msg.user}
                </span>
                <span className="text-[9px] text-white/30">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <p className="text-xs text-white/85 break-words">
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Input */}
      <div 
        className="p-2 border-t flex items-center gap-2"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Mensagem..."
          className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 outline-none px-2"
          maxLength={200}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-30"
          style={{
            background: input.trim() 
              ? `linear-gradient(135deg, rgba(${glow},0.4), rgba(${glow},0.2))` 
              : 'rgba(255,255,255,0.05)',
            border: input.trim() 
              ? `1px solid rgba(${glow},0.5)` 
              : '1px solid rgba(255,255,255,0.1)',
            boxShadow: input.trim() ? `0 0 12px rgba(${glow},0.4)` : 'none',
          }}
        >
          <Send 
            size={14} 
            style={{ color: input.trim() ? color : 'rgba(255,255,255,0.3)' }} 
            strokeWidth={2.5}
          />
        </motion.button>
      </div>
    </div>
  );
}
