
import type { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  type: 'me' | 'other';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'deleting';
}

export interface MessageFromDb {
  id: string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
}
