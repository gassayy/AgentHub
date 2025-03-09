import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAgentContext } from '../context/AgentContext';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAgentContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="search"
              className="w-full p-2 pl-10 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
          </button>
          <button 
            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            onClick={() => navigate('/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
              <User size={18} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
