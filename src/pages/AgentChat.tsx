import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Paperclip, Send } from 'lucide-react';
import { useAgentContext } from '../context/AgentContext';

export default function AgentChat() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { agents, conversations, addMessage } = useAgentContext();
  const [input, setInput] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const agent = agents.find(a => a.id === agentId);
  const messages = agentId ? conversations[agentId] || [] : [];
  
  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // If agent not found, return to explore
  useEffect(() => {
    if (agentId && !agent) {
      navigate('/explore');
    }
  }, [agent, agentId, navigate]);
  
  if (!agent) {
    return <div>Loading...</div>;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    addMessage(agent.id, input, 'user');
    
    // Simulate AI response
    setTimeout(() => {
      let response = "I'm an AI assistant and I'm here to help you. This is a simulated response since this is a frontend-only demo.";
      
      if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
        response = `Hello! I'm ${agent.name}, your AI assistant. How can I help you today?`;
      } else if (input.toLowerCase().includes('help')) {
        response = `I'd be happy to help! I'm ${agent.name}, designed to ${agent.description}`;
      } else if (input.toLowerCase().includes('who') && (input.toLowerCase().includes('you') || input.toLowerCase().includes('your'))) {
        response = `I'm ${agent.name}, an AI assistant designed to ${agent.description}. I'm powered by ${agent.model}.`;
      }
      
      addMessage(agent.id, response, 'assistant');
    }, 1000);
    
    setInput('');
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="bg-white shadow-sm py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-3 text-gray-600 hover:text-gray-900 md:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold">{agent.name}</h2>
            <p className="text-xs text-gray-500">{agent.model}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={`p-2 rounded-full ${showInfo ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Info size={20} />
        </button>
      </div>
      
      {/* Main chat area with info sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
          <div className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <p className="text-center max-w-md mb-6">
                  Start chatting with {agent.name} — your AI assistant designed to {agent.description}
                </p>
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={message.id}
                  className={`mb-4 max-w-3xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
                >
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p>{message.content}</p>
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-right text-gray-500' : 'text-gray-500'
                  }`}>
                    {message.role === 'user' ? 'You' : agent.name} • {
                      new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    }
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
          
          {/* Message input */}
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <button 
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${agent.name}...`}
                className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className={`p-2 rounded-full ${
                  input.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
        
        {/* Agent Info Sidebar */}
        {showInfo && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-medium text-lg mb-2">About {agent.name}</h3>
            <p className="text-gray-600 mb-4">{agent.description}</p>
            
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-1">Model</h4>
              <p className="text-sm bg-gray-100 p-2 rounded">{agent.model}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-1">Category</h4>
              <p className="text-sm bg-gray-100 p-2 rounded">{agent.category}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Instructions</h4>
              <p className="text-sm bg-gray-100 p-2 rounded whitespace-pre-wrap">{agent.instructions}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
