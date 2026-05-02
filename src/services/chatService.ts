import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { AgentKey } from '../config/aiAgents';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  engine?: string;
}

export interface ChatSession {
  id: string;
  agentId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: string;
}

export const chatService = {
  async createSession(agentId: AgentKey, title: string): Promise<string> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const path = `users/${userId}/chatSessions`;
    try {
      const docRef = await addDoc(collection(db, path), {
        agentId,
        title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: ''
      });
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
      return '';
    }
  },

  async getSessions(agentId?: AgentKey): Promise<ChatSession[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const path = `users/${userId}/chatSessions`;
    try {
      let q = query(collection(db, path), orderBy('updatedAt', 'desc'));
      if (agentId) {
        q = query(collection(db, path), where('agentId', '==', agentId), orderBy('updatedAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date(),
      } as ChatSession));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const sessionPath = `users/${userId}/chatSessions/${sessionId}`;
    const messagesPath = `${sessionPath}/messages`;

    try {
      // Add message
      await addDoc(collection(db, messagesPath), {
        ...message,
        timestamp: serverTimestamp()
      });

      // Update session last message and timestamp
      await setDoc(doc(db, sessionPath), {
        lastMessage: message.text.substring(0, 100),
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, messagesPath);
    }
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const path = `users/${userId}/chatSessions/${sessionId}/messages`;
    try {
      const q = query(collection(db, path), orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp)?.toDate() || new Date()
      } as ChatMessage));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  }
};
