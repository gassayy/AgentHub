import { useNavigate } from 'react-router-dom';
import { MessagesSquare, CirclePlus, Search, TrendingUp } from 'lucide-react';
import { useAgentContext } from '../context/AgentContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { agents, conversations } = useAgentContext();
  
  const publishedAgents = agents.filter(agent => agent.published);
  const myAgents = agents.filter(agent => !agent.published);
  
  // Recent chats
  const recentChats = Object.entries(conversations)
    .map(([agentId, messages]) => {
      const agent = agents.find(a => a.id === agentId);
      if (!agent || messages.length === 0) return null;
      
      return {
        agent,
        lastMessage: messages[messages.length - 1],
      };
    })
    .filter(Boolean)
    .sort((a, b) => 
      new Date(b!.lastMessage.timestamp).getTime() - 
      new Date(a!.lastMessage.timestamp).getTime()
    )
    .slice(0, 3);

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to AI Agent Portal</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CirclePlus size={20} className="mr-2 text-blue-600" />
            Get Started
          </h2>
          <p className="text-gray-600 mb-4">
            Create your own AI agent or explore existing ones to help with your tasks.
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Agent
            </button>
            <button 
              onClick={() => navigate('/explore')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Explore Agents
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2 text-green-600" />
            Platform Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Agents</p>
              <p className="text-2xl font-semibold">{agents.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Published Agents</p>
              <p className="text-2xl font-semibold">{publishedAgents.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">My Agents</p>
              <p className="text-2xl font-semibold">{myAgents.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Chats</p>
              <p className="text-2xl font-semibold">{Object.keys(conversations).length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {recentChats.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <MessagesSquare size={20} className="mr-2 text-indigo-600" />
            Recent Chats
          </h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {recentChats.map((chat) => (
              <div 
                key={chat!.agent.id}
                className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/chat/${chat!.agent.id}`)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{chat!.agent.name}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(chat!.lastMessage.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {chat!.lastMessage.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
