export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  createdBy: string;
  createdAt: string;
  published: boolean;
  category: string;
  instructions: string;
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  attachments?: string[];
}

export interface ApiKey {
  provider: string;
  key: string;
}

export interface User {
  name: string;
  email: string;
  apiKeys: ApiKey[];
}
