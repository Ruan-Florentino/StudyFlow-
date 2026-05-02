import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface RoomUser {
  id: string;
  userName: string;
  userAvatar: string;
  status: string;
  timeStr: string;
  isMe?: boolean;
}

export function useRoomUsers(roomId: string) {
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (!roomId) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('room_presence')
        .select('*')
        .eq('room_id', roomId);

      if (error) {
        console.error('Error fetching room users:', error);
        return;
      }

      setUsers(data.map(u => ({
        id: u.user_id,
        userName: u.user_name,
        userAvatar: u.user_avatar,
        status: u.status,
        timeStr: u.time_str,
        isMe: u.user_id === currentUserId
      })));
    };

    fetchUsers();

    const subscription = supabase
      .channel(`room_presence:${roomId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'room_presence', 
        filter: `room_id=eq.${roomId}` 
      }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, currentUserId]);

  return users;
}
