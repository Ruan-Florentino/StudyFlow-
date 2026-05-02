import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';

export const DUMMY_NAMES = [
  'Ana Carolina', 'João Pedro', 'Maria Santos', 'Lucas Silva', 'Julia Costa',
  'Pedro Henrique', 'Beatriz Lima', 'Gabriel Souza', 'Leticia Alves', 'Matheus Gomes',
  'Camila Rocha', 'Rafael Ribeiro', 'Sofia Carvalho', 'Enzo Pereira', 'Isabella Vieira',
  'Felipe Martins', 'Mariana Barbosa', 'Thiago Pinto', 'Laura Mendes', 'Gustavo Dias',
  'Vitoria Castro'
];

const STATUSES = [
  'focando', 'resolvendo questões', 'lendo', 'fazendo redação', 'assistindo aula', 'no pomodoro'
];

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

  useEffect(() => {
    if (!roomId) {
      setUsers([]);
      return;
    }

    const mockUsers: RoomUser[] = Array.from({ length: 21 }).map((_, i) => {
      const name = DUMMY_NAMES[i] || `Estudante ${i + 1}`;
      const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
      // random time between 1 and 120 minutes
      const mins = Math.floor(Math.random() * 120) + 1;
      const timeStr = mins > 60 ? `há 1h${(mins - 60).toString().padStart(2, '0')}m` : `há ${mins}min`;

      return {
        id: `mock_user_${i}`,
        userName: name,
        userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${roomId}_${i}`,
        status,
        timeStr
      };
    });

    if (auth.currentUser) {
      mockUsers.unshift({
        id: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Você',
        userAvatar: auth.currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser.uid}`,
        status: 'focando',
        timeStr: 'agora',
        isMe: true
      });
    }

    setUsers(mockUsers);
  }, [roomId, auth.currentUser]);

  return users;
}
