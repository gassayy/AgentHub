import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agent, Message, User, ApiKey } from '../types';

interface AgentContextType {
  agents: Agent[];
  conversations: Record<string, Message[]>;
  user: User;
  createAgent: (agent: Omit<Agent, 'id' | 'createdAt'>) => string;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (id: string) => void;
  publishAgent: (id: string) => void;
  addMessage: (agentId: string, content: string, role: 'user' | 'assistant') => void;
  updateApiKey: (provider: string, key: string) => void;
  removeApiKey: (provider: string) => void;
}

const defaultUser: User = {
  name: 'Demo User',
  email: 'user@example.com',
  apiKeys: [],
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [user, setUser] = useState<User>(defaultUser);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedAgents = localStorage.getItem('agents');
    const storedConversations = localStorage.getItem('conversations');
    const storedUser = localStorage.getItem('user');

    if (storedAgents) setAgents(JSON.parse(storedAgents));
    if (storedConversations) setConversations(JSON.parse(storedConversations));
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const createAgent = (agentData: Omit<Agent, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newAgent: Agent = {
      ...agentData,
      id,
      createdAt: new Date().toISOString(),
    };
    setAgents((prev) => [...prev, newAgent]);
    return id;
  };

  const updateAgent = (updatedAgent: Agent) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === updatedAgent.id ? updatedAgent : agent))
    );
  };

  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
    // Also delete associated conversations
    const { [id]: _, ...rest } = conversations;
    setConversations(rest);
  };

  const publishAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, published: true } : agent
      )
    );
  };

  const addMessage = (agentId: string, content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      agentId,
      content,
      role,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), newMessage],
    }));
  };

  const updateApiKey = (provider: string, key: string) => {
    setUser((prev) => {
      const existingKeys = prev.apiKeys.filter((k) => k.provider !== provider);
      return {
        ...prev,
        apiKeys: [...existingKeys, { provider, key }],
      };
    });
  };

  const removeApiKey = (provider: string) => {
    setUser((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.filter((k) => k.provider !== provider),
    }));
  };

  return (
    <AgentContext.Provider
      value={{
        agents,
        conversations,
        user,
        createAgent,
        updateAgent,
        deleteAgent,
        publishAgent,
        addMessage,
        updateApiKey,
        removeApiKey,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgentContext() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgentContext must be used within an AgentProvider');
  }
  return context;
}
