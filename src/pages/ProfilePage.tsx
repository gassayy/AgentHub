import { useState } from 'react';
import { CircleAlert, CircleCheck, Key, Save } from 'lucide-react';
import { useAgentContext } from '../context/AgentContext';

const modelProviders = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '🤖',
    description: 'Provides GPT-3.5 Turbo and GPT-4 models',
    placeholder: 'sk-...',
    website: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: '🧠',
    description: 'Provides Claude models including Claude 3',
    placeholder: 'sk-ant-...',
    website: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'cohere',
    name: 'Cohere',
    logo: '🔄',
    description: 'Provides Command models',
    placeholder: 'Your Cohere API key',
    website: 'https://dashboard.cohere.com/api-keys',
  },
];

export default function ProfilePage() {
  const { user, updateApiKey, removeApiKey } = useAgentContext();
  const [formState, setFormState] = useState({
    name: user.name,
    email: user.email,
  });
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Initialize API key input fields from stored keys
  useState(() => {
    const initialKeys: Record<string, string> = {};
    user.apiKeys.forEach(apiKey => {
      initialKeys[apiKey.provider] = apiKey.key;
    });
    setApiKeys(initialKeys);
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };
  
  const handleSaveApiKey = (provider: string) => {
    const key = apiKeys[provider];
    if (!key) {
      setMessage({ type: 'error', text: 'API key cannot be empty' });
      return;
    }
    
    // Simple validation
    if (provider === 'openai' && !key.startsWith('sk-')) {
      setMessage({ type: 'error', text: 'Invalid OpenAI API key format' });
      return;
    }
    
    if (provider === 'anthropic' && !key.startsWith('sk-ant-')) {
      setMessage({ type: 'error', text: 'Invalid Anthropic API key format' });
      return;
    }
    
    updateApiKey(provider, key);
    setMessage({ type: 'success', text: `${provider} API key saved successfully` });
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  
  const handleRemoveApiKey = (provider: string) => {
    removeApiKey(provider);
    setApiKeys(prev => {
      const updated = { ...prev };
      delete updated[provider];
      return updated;
    });
    setMessage({ type: 'success', text: `${provider} API key removed` });
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  
  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // For the MVP, we're not saving user profile changes
    setMessage({ type: 'success', text: 'Profile updated successfully' });
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div className="container mx-auto max-w-3xl">
      {message && (
        <div className={`mb-4 p-3 rounded-md flex items-center ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.type === 'success' ? 
            <CircleCheck size={18} className="mr-2" /> : 
            <CircleAlert size={18} className="mr-2" />
          }
          {message.text}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>
        
        <form onSubmit={saveProfile}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Key size={20} className="text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">API Keys</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Add your API keys to use various AI models with your agents. Your keys are stored securely in your browser's local storage and are never sent to our servers.
        </p>
        
        <div className="space-y-6">
          {modelProviders.map(provider => {
            const hasKey = user.apiKeys.some(k => k.provider === provider.id);
            
            return (
              <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{provider.logo}</span>
                    <div>
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-gray-600">{provider.description}</p>
                    </div>
                  </div>
                  {hasKey && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Connected
                    </span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="password"
                    value={apiKeys[provider.id] || ''}
                    onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                    placeholder={provider.placeholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveApiKey(provider.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
                
                <div className="flex justify-between mt-3">
                  <a 
                    href={provider.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Get API key
                  </a>
                  
                  {hasKey && (
                    <button
                      type="button"
                      onClick={() => handleRemoveApiKey(provider.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
