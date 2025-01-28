export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
}