import { useState, useEffect } from 'react';
import { localBackend } from '../lib/localBackend';
import { useStore } from '../store';

export function useRoomMessages(roomId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const state = useStore();
  const userName = state.name;
  const userAvatar = state.profilePic;

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await localBackend
        .from('room_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('timestamp', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error fetching room messages:', error);
        return;
      }

      setMessages(data.map(m => ({
        id: m.id,
        userId: m.user_id,
        userName: m.user_name,
        userAvatar: m.user_avatar,
        text: m.text,
        timestamp: new Date(m.timestamp).getTime(),
        type: m.type
      })));
    };

    fetchMessages();

    const subscription = localBackend
      .channel(`room_messages:${roomId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'room_messages', 
        filter: `room_id=eq.${roomId}` 
      }, payload => {
        const m = payload.new;
        setMessages(prev => [...prev, {
          id: m.id,
          userId: m.user_id,
          userName: m.user_name,
          userAvatar: m.user_avatar,
          text: m.text,
          timestamp: new Date(m.timestamp).getTime(),
          type: m.type
        }]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  const sendMessage = async (text: string, type: 'text' | 'reaction' = 'text') => {
    const { data: { user } } = await localBackend.auth.getUser();
    if (!user) return;

    await localBackend.from('room_messages').insert({
      room_id: roomId,
      user_id: user.id,
      user_name: userName || 'Estudante',
      user_avatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      text,
      type
    });
  };

  return { messages, sendMessage };
}
