import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Play, Target } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, AnimatedButton, cn, Header, Badge } from './UI';
import { RoomCard } from './Rooms/RoomCard';
import { RoomInterior } from './Rooms/RoomInterior';
import { db, auth } from '../lib/firebase';
import { ROOMS } from '../data/rooms';
import { 
  collection, doc, setDoc, deleteDoc, 
  onSnapshot, query, orderBy, limit, serverTimestamp, 
  arrayUnion, updateDoc, addDoc
} from 'firebase/firestore';

export const LiveStudyRooms = ({ onBack }: { onBack: () => void }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const state = useStore();
  const activeRoom = state.studyRooms?.activeRoom;
  const joinRoom = state.joinRoom;
  const userName = state.name;
  const userAvatar = state.profilePic;
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  const handleFirestoreError = (error: any, operation: string, path: string | null) => {
    console.error(`Firestore Error [${operation}] at ${path}:`, error);
    // Mandatory error structure as per integration rules
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      },
      operationType: operation,
      path
    };
    console.error('Core Error Data:', JSON.stringify(errInfo));
  };

  // Load Rooms from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'studyRooms'), async (snap) => {
      try {
        let roomList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (roomList.length === 0 && auth.currentUser) {
          console.log("Seeding study rooms...");
          setLoading(true);
          const seedPromises = ROOMS.map(async (r) => {
            const roomData = {
              name: r.name,
              description: r.description,
              audio: r.audio,
              color: r.color,
              icon: r.id, // Use ID or some string representation for the icon in DB
              onlineUsers: [],
              createdAt: serverTimestamp()
            };
            try {
              await setDoc(doc(db, 'studyRooms', r.id), roomData);
            } catch (e) {
              handleFirestoreError(e, 'create', `studyRooms/${r.id}`);
            }
          });
          await Promise.all(seedPromises);
          // Snapshot listener will trigger again after seeding
        } else {
          setRooms(roomList);
          setLoading(false);
        }
      } catch (err) {
        handleFirestoreError(err, 'list', 'studyRooms');
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, 'list', 'studyRooms');
      setLoading(false);
    });

    return () => unsub();
  }, []);

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
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    
    await setDoc(doc(db, 'studyRooms', roomId, 'presence', uid), {
      userId: uid,
      userName: userName || 'Estudante',
      userAvatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      joinedAt: serverTimestamp(),
      lastPing: serverTimestamp(),
      status: 'Focando',
      timeStr: '0m'
    });

    await updateDoc(doc(db, 'studyRooms', roomId), {
      onlineUsers: arrayUnion(uid)
    });

    await addDoc(collection(db, 'studyRooms', roomId, 'messages'), {
      userId: 'system',
      userName: 'Sistema',
      text: `${userName || 'Estudante'} entrou na sala.`,
      timestamp: Date.now(),
      type: 'system'
    });

    heartbeatInterval.current = setInterval(() => {
      updateDoc(doc(db, 'studyRooms', roomId, 'presence', uid), {
        lastPing: serverTimestamp()
      });
    }, 30000);
  };

  const exitPresence = async (forceRoomId?: string) => {
    if (!auth.currentUser) return;
    const roomId = forceRoomId || selectedRoom?.id;
    if (!roomId) return;
    const uid = auth.currentUser.uid;

    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }

    try {
      await deleteDoc(doc(db, 'studyRooms', roomId, 'presence', uid));
      await addDoc(collection(db, 'studyRooms', roomId, 'messages'), {
        userId: 'system',
        userName: 'Sistema',
        text: `${userName || 'Estudante'} saiu da sala.`,
        timestamp: Date.now(),
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
