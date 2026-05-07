import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/animations/easings';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  color: string;
  created_at: string;
}

interface RoomChatProps {
  roomId: string;
  color: string;
}

export function RoomChat({ roomId, color }: RoomChatProps) {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion() ?? false;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('room_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const row = payload.new;
          if (!row || typeof row !== 'object') return;
          setMessages((prev) => [...prev, row as Message]);
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setLoading(false);
        }
      });

    void fetchMessages();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [roomId, fetchMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    
    const content = input;
    setInput('');

    try {
      const { error } = await supabase.from('room_messages').insert({
        room_id: roomId,
        user_id: user.id,
        user_name: user.user_metadata?.name || user.email?.split('@')[0] || 'Estudante',
        content,
        color
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      // Optional: show error to user
    }
  };
  
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div 
      className="rounded-3xl flex flex-col relative overflow-hidden border border-[rgba(var(--hub-primary-rgb),0.2)]"
      style={{
        background: `linear-gradient(180deg, rgba(var(--hub-primary-rgb),0.06), rgba(255,255,255,0.02))`,
        backdropFilter: 'blur(20px)',
        height: '320px',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 40px rgba(0,0,0,0.35)`,
      }}
    >
      <div
        className="shrink-0 px-3 py-2.5 flex items-center justify-between gap-2 border-b border-[rgba(var(--hub-primary-rgb),0.15)]"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full animate-pulse shrink-0 bg-primary shadow-[0_0_10px_rgba(var(--hub-primary-rgb),0.55)]"
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/55 truncate">
            Canal da sala
          </span>
        </div>
        <span className="text-[9px] text-white/30 font-medium uppercase tracking-wider shrink-0">
          Tempo real
        </span>
      </div>
      {/* Lista de mensagens */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar min-h-0"
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <Loader2 className="animate-spin mb-2" size={20} />
            <p className="text-[10px] font-premium-mono tracking-widest uppercase">Sincronizando...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-30">
            <MessageCircle size={32} className="mb-2" />
            <p className="text-[10px] font-premium-mono tracking-widest font-bold uppercase">Silêncio Produtivo</p>
            <p className="text-[10px] mt-1 italic">Mande um "olá" para os outros fifeiros!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0.1 } : springs.card}
              className="flex flex-col gap-1"
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{ color: msg.color || color }}
                >
                  {msg.user_name ?? 'Estudante'}
                </span>
                <span className="text-[8px] text-white/20">
                  {formatTime(msg.created_at)}
                </span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-2 rounded-xl rounded-tl-none border border-white/5">
                {msg.content ?? ''}
              </p>
            </motion.div>
          ))
        )}
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
          type="button"
          whileTap={{ scale: 0.9, transition: springs.snappy }}
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-30"
          style={{
            background: input.trim()
              ? `linear-gradient(135deg, rgba(var(--hub-primary-rgb),0.42), rgba(var(--hub-primary-rgb),0.15))`
              : 'rgba(255,255,255,0.05)',
            border: input.trim()
              ? `1px solid rgba(var(--hub-primary-rgb),0.5)`
              : '1px solid rgba(255,255,255,0.1)',
            boxShadow: input.trim()
              ? `0 0 12px rgba(var(--hub-primary-rgb),0.35)`
              : 'none',
          }}
        >
          <Send
            size={14}
            className={input.trim() ? 'text-primary' : 'text-white/30'}
            strokeWidth={2.5}
          />
        </motion.button>
      </div>
    </div>
  );
}
