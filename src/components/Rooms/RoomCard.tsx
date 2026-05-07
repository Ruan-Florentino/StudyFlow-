import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/animations/easings';
import { cn } from '../UI';
import { ROOMS } from '../../data/rooms';
import { Users } from 'lucide-react';

interface RoomCardProps {
  roomState: any;
  onJoin: (id: string) => void;
  index: number;
}

export const RoomCard: React.FC<RoomCardProps> = ({ roomState, onJoin, index }) => {
  const staticRoomDef = ROOMS.find(sr => sr.id === roomState.id) || ROOMS[0];
  const Icon = staticRoomDef.icon || Users;
  const numOnline = roomState.onlineUsers?.length || staticRoomDef.online; 

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onJoin(roomState.id)}
      className="relative group cursor-pointer rounded-[32px] overflow-hidden bg-[#0a0a0a] border border-white/5"
    >
      {/* Background Glow */}
      <div 
        className={cn("absolute -top-24 -right-24 w-64 h-64 blur-[80px] rounded-full transition-all duration-700 opacity-20 group-hover:opacity-40")}
        style={{ backgroundColor: staticRoomDef.color.primary }}
      />
      
      <div className="p-6 relative z-10 flex flex-col h-full min-h-[220px]">
        {/* Room Meta */}
        <div className="flex justify-between items-start mb-6">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-xl"
            style={{ color: staticRoomDef.color.primary }}
          >
            <Icon size={24} strokeWidth={1.5} />
          </div>
          
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--hub-primary-rgb),0.85)]" />
            <span className="text-[9px] font-bold text-white uppercase tracking-widest leading-none mt-px">AO VIVO</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <h3 className="text-xl font-premium-title italic font-bold tracking-wide mb-1 text-white">
            {staticRoomDef.name}
          </h3>
          <p className="text-[11px] text-white/50 font-medium uppercase tracking-widest max-w-[85%] leading-tight mb-6">
            {staticRoomDef.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
              {numOnline} ESTUDANDO
            </span>
          </div>
          
          <div className="flex -space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <img 
                key={i} 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${roomState.id}_${i}`} 
                className="w-6 h-6 rounded-full border border-black bg-black object-cover" 
                referrerPolicy="no-referrer"
                alt="user"
              />
            ))}
            <div 
              className="w-6 h-6 rounded-full border border-black text-[8px] font-bold flex items-center justify-center text-black bg-primary"
            >
              +{Math.floor(numOnline/2)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
