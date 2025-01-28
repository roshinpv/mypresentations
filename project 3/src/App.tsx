import React, { useState } from 'react';
import { AgentSelector } from './components/AgentSelector';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import type { Agent, Message } from './types';

const SAMPLE_AGENTS: Agent[] = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'A general-purpose AI assistant',
    icon: 'bot'
  },
  {
    id: 'code',
    name: 'Code Assistant',
    description: 'Specialized in programming help',
    icon: 'code'
  },
  {
    id: 'writing',
    name: 'Writing Assistant',
    description: 'Helps with writing and editing',
    icon: 'pen'
  }
];

function App() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (content: string) => {
    if (!selectedAgent) return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: selectedAgent.id,
          message: content
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto py-4">
          <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto py-8 px-4">
        <AgentSelector
          agents={SAMPLE_AGENTS}
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
        />

        <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-[600px] overflow-y-auto">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={!selectedAgent}
          />
        </div>
      </main>
    </div>
  );
}

export default App;