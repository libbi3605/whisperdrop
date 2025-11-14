export interface Message {
  id: string;
  type: 'me' | 'other';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'deleting';
}
