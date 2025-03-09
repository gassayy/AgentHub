import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import AgentExplorer from './pages/AgentExplorer';
import AgentCreator from './pages/AgentCreator';
import AgentChat from './pages/AgentChat';
import ProfilePage from './pages/ProfilePage';
import { AgentProvider } from './context/AgentContext';
import './index.css';

function App() {
  useEffect(() => {
    // Include required font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <AgentProvider>
      <div className="flex h-screen bg-gray-50 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<AgentExplorer />} />
              <Route path="/create" element={<AgentCreator />} />
              <Route path="/chat/:agentId" element={<AgentChat />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </AgentProvider>
  );
}

export default App;
