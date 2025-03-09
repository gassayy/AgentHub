import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Sparkles, Upload } from 'lucide-react';
import { useAgentContext } from '../context/AgentContext';

const modelOptions = [
  { value: 'gpt-4', label: 'GPT-4 (OpenAI)' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (OpenAI)' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus (Anthropic)' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet (Anthropic)' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku (Anthropic)' },
];

const categoryOptions = [
  'Productivity',
  'Education',
  'Entertainment',
  'Research',
  'Customer Support',
  'Coding',
  'Creative',
  'Other',
];

export default function AgentCreator() {
  const navigate = useNavigate();
  const { createAgent, publishAgent } = useAgentContext();
  
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    model: 'gpt-4',
    category: 'Other',
    instructions: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formState.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formState.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const agentId = createAgent({
      ...formState,
      createdBy: 'Demo User',
      published: publish,
    });
    
    if (publish) {
      publishAgent(agentId);
    }
    
    // Navigate to the chat with the new agent
    navigate(`/chat/${agentId}`);
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create New Agent</h1>
          <div className="flex space-x-2">
            <button 
              onClick={(e) => handleSubmit(e, false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Draft
            </button>
            <button 
              onClick={(e) => handleSubmit(e, true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Upload size={18} className="mr-2" />
              Publish
            </button>
          </div>
        </div>
        
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent Name
              </label>
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter a name for your agent"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows={2}
                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="What does your agent do?"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Model
                </label>
                <select
                  name="model"
                  value={formState.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {modelOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formState.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <div className="bg-blue-50 p-3 rounded-md mb-2 flex items-start">
                <Sparkles size={18} className="text-blue-600 mr-2 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Provide clear instructions for your agent. Good instructions lead to better responses.
                </p>
              </div>
              <textarea
                name="instructions"
                value={formState.instructions}
                onChange={handleChange}
                rows={6}
                className={`w-full px-3 py-2 border ${errors.instructions ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Tell your agent how to behave, what to do, and what context it needs..."
              />
              {errors.instructions && <p className="mt-1 text-sm text-red-600">{errors.instructions}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
