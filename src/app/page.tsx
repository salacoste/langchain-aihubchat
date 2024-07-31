"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ApiKeys {
  openai: string;
  claude: string;
}

interface SelectedModels {
  openai: string;
  claude: string;
}

type Provider = 'openai' | 'claude';

interface ModelOption {
  value: string;
  label: string;
  description: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

const openAiModels: ModelOption[] = [
  { value: 'gpt-4o', label: 'GPT-4o', description: 'High-intelligence flagship model for complex, multi-step tasks' },
  { value: 'gpt-4o-mini', label: 'GPT-4o mini', description: 'Affordable and intelligent small model for fast, lightweight tasks' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'High-intelligence models with vision capabilities' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast, inexpensive model for simple tasks' },
  { value: 'dall-e-3', label: 'DALL·E 3', description: 'Generates and edits images given a natural language prompt' },
  { value: 'tts-1', label: 'TTS-1', description: 'Converts text to natural sounding spoken text' },
  { value: 'whisper-1', label: 'Whisper-1', description: 'Converts audio into text' },
];

const claudeModels: ModelOption[] = [
  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', description: 'Most intelligent model' },
  { value: 'claude-3-5-opus', label: 'Claude 3.5 Opus', description: 'Powerful model for highly complex tasks' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', description: 'Balance of intelligence and speed' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku', description: 'Fastest and most compact model for near-instant responsiveness' },
];

const HomePage = () => {
  const [provider, setProvider] = useState<Provider>("openai");
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ openai: "", claude: "" });
  const [question, setQuestion] = useState("");
  const [selectedModels, setSelectedModels] = useState<SelectedModels>({ openai: "", claude: "" });
  const [file, setFile] = useState<File | null>(null);
  const [showApiKey, setShowApiKey] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedProvider = localStorage.getItem("provider") as Provider | null;
    const savedApiKeys = localStorage.getItem("apiKeys");
    const savedSelectedModels = localStorage.getItem("selectedModels");

    if (savedProvider) setProvider(savedProvider);
    if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));
    if (savedSelectedModels) setSelectedModels(JSON.parse(savedSelectedModels));
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as Provider;
    setProvider(newProvider);
    localStorage.setItem("provider", newProvider);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKeys = { ...apiKeys, [provider]: e.target.value };
    setApiKeys(newApiKeys);
    localStorage.setItem("apiKeys", JSON.stringify(newApiKeys));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleSelectedModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setSelectedModels(prevModels => {
      const updatedModels = { ...prevModels, [provider]: newModel };
      localStorage.setItem("selectedModels", JSON.stringify(updatedModels));
      return updatedModels;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFile(file);
    } else {
      toast.error("File size exceeds 10MB limit");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: question }]);

    const formData = new FormData();
    formData.append("provider", provider);
    formData.append("apiKey", apiKeys[provider]);
    formData.append("question", question);
    formData.append("selectedModel", selectedModels[provider]);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("/api/langchain", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer, model: selectedModels[provider] }]);
      } else {
        toast.error(`Error: ${data.error} Details: ${data.details}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setQuestion("");
      setFile(null);
    }
  };

  const renderModelOptions = () => {
    const models = provider === "openai" ? openAiModels : claudeModels;
    return models.map((model) => (
      <option key={model.value} value={model.value}>
        {model.label} - {model.description}
      </option>
    ));
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const getModelLabel = (modelValue: string) => {
    const allModels = [...openAiModels, ...claudeModels];
    const model = allModels.find(m => m.value === modelValue);
    return model ? model.label : modelValue;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">AI Chat Assistant</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-4">
          <div className="settings-panel">
            <h2 className="settings-title">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="settings-label" htmlFor="provider">
                  AI Provider
                </label>
                <select
                  id="provider"
                  className="settings-input"
                  value={provider}
                  onChange={handleProviderChange}
                >
                  <option value="openai">OpenAI</option>
                  <option value="claude">Claude</option>
                </select>
              </div>
              <div>
                <label className="settings-label" htmlFor="apiKey">
                  API Key
                </label>
                <div className="relative">
                  <input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    className="settings-input pr-10"
                    value={apiKeys[provider]}
                    onChange={handleApiKeyChange}
                  />
                  <button
                    type="button"
                    onClick={toggleApiKeyVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {/* ... (eye icons remain the same) */}
                  </button>
                </div>
              </div>
              <div>
                <label className="settings-label" htmlFor="selectedModel">
                  Model
                </label>
                <select
                  id="selectedModel"
                  className="settings-input"
                  value={selectedModels[provider]}
                  onChange={handleSelectedModelChange}
                >
                  <option value="" disabled>Select a model</option>
                  {renderModelOptions()}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
  <div className="chat-container h-[500px] flex flex-col">
    <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-4">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-start max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 h-8 w-8 flex items-center justify-center text-white ${
              message.role === 'user' 
                ? 'user-avatar ml-2' 
                : 'rounded-full bg-gray-500 mr-2'
            }`}>
              {message.role === 'user' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              ) : 'AI'}
            </div>
            <div className={`chat-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}>
              <p className="text-sm">{message.content}</p>
              {message.model && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getModelLabel(message.model)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}
    </div>
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <textarea
        className="message-input flex-1 p-2 rounded-md focus:outline-none focus:ring-2"
        placeholder="Type your message..."
        rows={1}
        value={question}
        onChange={handleQuestionChange}
      />
      <button
        type="submit"
        className="send-button"
        disabled={isLoading}
      >
        Send
      </button>
    </form>
  </div>
  <div className="settings-panel">
    <label className="settings-label" htmlFor="file">
      Attach File (max 10MB)
    </label>
    <div className="flex items-center">
      <input
        id="file"
        type="file"
        className="hidden"
        accept=".txt,.pdf,.docx,.jpg,.png,.mp3,.mp4"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file"
        className="file-button cursor-pointer py-2 px-4"
      >
        Choose File
      </label>
      {file && <span className="ml-4 text-gray-700 dark:text-gray-300">{file.name}</span>}
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default HomePage;