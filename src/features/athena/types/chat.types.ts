export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
  content?: string; // extracted text for PDF
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  modelId: string;
  lastUpdated: number;
}

export interface ChatResponse {
  message: string;
  session_id?: string;
}
