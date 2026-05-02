import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, MessageCircle, Target, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '../UI';
import { useAuth } from '../../contexts/AuthContext';

interface RoomTabsProps {
  activeTab: 'users' | 'chat' | 'goals';
  setActiveTab: (tab: 'users' | 'chat' | 'goals') => void;
  users: any[];
  messages: any[];
  sendMessage: (text: string, type?: string) => void;
  accentColor: string;
}

export const RoomTabs = ({ activeTab, setActiveTab, users, messages, sendMessage, accentColor }: RoomTabsProps) => {
  const { user } = useAuth();
  const [inputText, setInputText] = React.useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleSendReaction = (emoji: string) => {
    sendMessage(emoji, 'reaction');
  };

  return (
    <div className="flex-1 flex flex-col bg-black/60 backdrop-blur-3xl border-t border-white/5 overflow-hidden">
      {/* Mobile Tab Stepper */}
      <div className="flex border-b border-white/10 shrink-0">
        {[
          { id: 'users', label: 'Conectados', count: users.length, icon: Users },
          { id: 'chat', label: 'Chat', count: messages.length, icon: MessageCircle },
          { id: 'goals', label: 'Metas', count: 0, icon: Target }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 relative",
                isActive ? "text-white border-emerald-500 bg-emerald-500/5" : "text-white/40 border-transparent"
              )}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count > 0 && <span className="absolute top-2 right-2 px-1 rounded bg-white/10 text-[8px]">{tab.count}</span>}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div 
              key="users" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="p-4 space-y-3"
            >
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="relative shrink-0">
                    <img src={u.userAvatar} className="w-10 h-10 rounded-full border border-white/10" alt={u.userName} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white/90 truncate">
                      {u.userName} {u.isMe && <span className="text-emerald-500 ml-1">(Tu)</span>}
                    </p>
                    <p className="text-[10px] text-white/50 uppercase font-bold truncate tracking-tight">{u.status} • {u.timeStr}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div 
              key="chat" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col h-full"
            >
              <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {messages.map(m => (
                  <div key={m.id} className={cn("flex items-end gap-2", m.userId === user?.id ? "flex-row-reverse" : "flex-row")}>
                    <img src={m.userAvatar} className="w-8 h-8 rounded-lg opacity-80 shrink-0" />
                    <div className={cn("flex flex-col gap-1 max-w-[80%]", m.userId === user?.id ? "items-end" : "items-start")}>
                       <span className="text-[8px] text-white/30 uppercase font-bold px-1">
                          {m.userName.split(' ')[0]} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                       {m.type === 'reaction' ? (
                         <span className="text-3xl">{m.text}</span>
                       ) : (
                         <div className={cn("p-3 rounded-2xl text-[13px] leading-relaxed", 
                            m.userId === user?.id ? "bg-emerald-500 text-black font-medium rounded-br-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-white/10 text-white/90 rounded-bl-sm")}>
                           {m.text}
                         </div>
                       )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              {/* Chat Input */}
              <div className="p-4 bg-black/40 border-t border-white/5">
                <div className="flex justify-between mb-4 px-2">
                  {['👍', '❤️', '🔥', '🧠', '✨'].map(emoji => (
                    <button key={emoji} onClick={() => handleSendReaction(emoji)} className="text-xl hover:scale-125 active:scale-90 transition-transform">{emoji}</button>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="relative">
                  <input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Sussurrar na sala..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm text-white placeholder:text-white/20 outline-none focus:bg-white/10 transition-all border-emerald-500/0 focus:border-emerald-500/30"
                  />
                  <button type="submit" disabled={!inputText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500 text-black disabled:opacity-30 transition-all shadow-lg active:scale-95">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div 
              key="goals" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="p-8 flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-premium-title italic text-white/90">Evolução em Grupo</h4>
              <p className="text-xs text-white/40 uppercase font-bold leading-relaxed tracking-wider">Metas coletivas estarão disponíveis na próxima expansão neural.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
