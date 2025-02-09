export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: 'text' | 'code' | 'table' | 'quote' | 'list';
  metadata?: {
    language?: string; // For code blocks
    tableHeaders?: string[]; // For tables
    listType?: 'ordered' | 'unordered'; // For lists
  };
}