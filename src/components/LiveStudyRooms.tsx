import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Play, Target } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, AnimatedButton, cn, Header, Badge } from './UI';
import { RoomCard } from './Rooms/RoomCard';
import { RoomInterior } from './Rooms/RoomInterior';
import { supabase } from '../lib/supabase';
import { ROOMS } from '../data/rooms';

export const LiveStudyRooms = ({ onBack }: { onBack: () => void }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const state = useStore();
  const activeRoom = state.studyRooms?.activeRoom;
  const joinRoom = state.joinRoom;
  const userName = state.name;
  const userAvatar = state.profilePic;
  const [user, setUser] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  // Load Rooms from Supabase
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from('study_rooms').select('*');
      
      if (error) {
        console.error('Error fetching rooms:', error);
        return;
      }

      if (data.length === 0 && user) {
        console.log("Seeding study rooms...");
        const seedData = ROOMS.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description,
          audio: r.audio,
          color: r.color,
          icon: r.id
        }));
        await supabase.from('study_rooms').insert(seedData);
        const { data: newData } = await supabase.from('study_rooms').select('*');
        setRooms(newData || []);
      } else {
        setRooms(data);
      }
      setLoading(false);
    };

    fetchRooms();

    // Subscribe to room changes
    const subscription = supabase
      .channel('study_rooms_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_rooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const lastJoinedRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeRoom && rooms.length > 0) {
      const room = rooms.find(r => r.id === activeRoom);
      if (room) {
        setSelectedRoom(room);
        if (lastJoinedRoomRef.current !== room.id) {
          lastJoinedRoomRef.current = room.id;
          enterPresence(room.id);
        }
      }
    } else if (!activeRoom) {
      setSelectedRoom(null);
      if (lastJoinedRoomRef.current) {
        const prevId = lastJoinedRoomRef.current;
        lastJoinedRoomRef.current = null;
        exitPresence(prevId);
      }
    }
  }, [activeRoom, rooms]);

  // Clean up presence on complete unmount
  useEffect(() => {
    return () => {
      if (lastJoinedRoomRef.current) {
        exitPresence(lastJoinedRoomRef.current);
      }
    };
  }, []);

  const enterPresence = async (roomId: string) => {
    if (!user) return;
    const uid = user.id;
    
    await supabase.from('room_presence').upsert({
      room_id: roomId,
      user_id: uid,
      user_name: userName || 'Estudante',
      user_avatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      status: 'Focando',
      time_str: '0m',
      last_ping: new Date().toISOString()
    });

    await supabase.from('room_messages').insert({
      room_id: roomId,
      user_id: 'system',
      user_name: 'Sistema',
      text: `${userName || 'Estudante'} entrou na sala.`,
      type: 'system'
    });

    heartbeatInterval.current = setInterval(() => {
      supabase.from('room_presence').update({
        last_ping: new Date().toISOString()
      }).eq('room_id', roomId).eq('user_id', uid);
    }, 30000);
  };

  const exitPresence = async (forceRoomId?: string) => {
    if (!user) return;
    const roomId = forceRoomId || selectedRoom?.id;
    if (!roomId) return;
    const uid = user.id;

    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }

    try {
      await supabase.from('room_presence').delete().eq('room_id', roomId).eq('user_id', uid);
      await supabase.from('room_messages').insert({
        room_id: roomId,
        user_id: 'system',
        user_name: 'Sistema',
        text: `${userName || 'Estudante'} saiu da sala.`,
        type: 'system'
      });
    } catch (e) {
      console.warn('Silent failure removing presence', e);
    }

    joinRoom(null);
  };

  if (selectedRoom) {
    return (
      <div className="absolute inset-0 z-30 bg-black flex flex-col animate-in fade-in duration-500 overflow-hidden">
        <RoomInterior 
          roomId={selectedRoom.id} 
          onExit={() => exitPresence()} 
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-32 max-w-lg mx-auto">
      <Header 
        title="Salas Ao Vivo"
        subtitle="Sincronia neural para foco absoluto."
        icon={Network}
        color="primary"
        onBack={onBack}
        rightContent={
          <Badge variant="primary" className="animate-pulse bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
            {rooms.reduce((acc, r) => acc + (r.onlineUsers?.length || 0), 0) + 124} ONLINE
          </Badge>
        }
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-white/5 rounded-[32px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rooms.map((room, index) => (
             <RoomCard 
               key={room.id}
               roomState={room}
               onJoin={joinRoom}
               index={index}
             />
          ))}
        </div>
      )}

      {/* Quick Action */}
      <GlassCard className="mt-8 p-6 flex flex-col gap-4 border-emerald-500/20 bg-emerald-500/5 items-center text-center">
         <div className="space-y-1">
           <h4 className="text-lg font-premium-title italic text-white">Salto Neural</h4>
           <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Entre em qualquer frequência disponível</p>
         </div>
         <AnimatedButton className="w-full bg-emerald-500 text-black py-4" onClick={() => {
            const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
            if (randomRoom) joinRoom(randomRoom.id);
         }}>
            <Play size={18} fill="currentColor" className="mr-2" /> ENTRAR AGORA
         </AnimatedButton>
      </GlassCard>
    </div>
  );
};
