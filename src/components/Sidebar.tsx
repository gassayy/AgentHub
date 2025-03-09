import { House, MessagesSquare, CirclePlus, Search, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAgentContext } from '../context/AgentContext';

export default function Sidebar() {
  const { agents } = useAgentContext();
  const myAgents = agents.filter(agent => !agent.published);
  
  return (
    <aside className="bg-white w-64 border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">AI Agent Portal</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <House size={20} className="mr-3" />
              <span>House</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/explore" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <Search size={20} className="mr-3" />
              <span>Explore Agents</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/create" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <CirclePlus size={20} className="mr-3" />
              <span>Create Agent</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <Settings size={20} className="mr-3" />
              <span>Profile Settings</span>
            </NavLink>
          </li>
        </ul>
        
        {myAgents.length > 0 && (
          <div className="mt-6">
            <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">My Agents</h2>
            <ul className="mt-2 space-y-1">
              {myAgents.map(agent => (
                <li key={agent.id}>
                  <NavLink 
                    to={`/chat/${agent.id}`} 
                    className={({ isActive }) => 
                      `flex items-center p-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                  >
                    <MessagesSquare size={18} className="mr-3" />
                    <span className="truncate">{agent.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}
