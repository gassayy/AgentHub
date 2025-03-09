import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, MessageCircle } from 'lucide-react';
import { useAgentContext } from '../context/AgentContext';

export default function AgentExplorer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agents } = useAgentContext();
  const publishedAgents = agents.filter(agent => agent.published);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get categories from agents
  const categories = ['All', ...new Set(publishedAgents.map(agent => agent.category))];
  
  // Get search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, [location.search]);
  
  // Filter agents based on category and search query
  const filteredAgents = publishedAgents.filter(agent => {
    const categoryMatch = selectedCategory === 'All' || agent.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Explore Agents</h1>
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        <div className="flex items-center mr-2">
          <Filter size={16} className="text-gray-500 mr-1" />
          <span className="text-sm text-gray-500">Categories:</span>
        </div>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              selectedCategory === category 
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
            } border`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {filteredAgents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map(agent => (
            <div 
              key={agent.id}
              className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/chat/${agent.id}`)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{agent.name}</h2>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {agent.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{agent.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Model: {agent.model.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <MessageCircle size={16} className="mr-1" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No agents found matching your criteria.</p>
          <button 
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
