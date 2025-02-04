export interface Message {
  role: 'user' | 'agent' | 'system';
  message: string;
}

export interface Agent {
  id: number;
  name: string;
  description?: string;
  files: string[];
  urls: string[];
  url_recursive: boolean;
  context: Message[];
  created_at: string;
  system_prompt?: string;
}

export interface ChatResponse {
  response: string;
  context: Message[];
}