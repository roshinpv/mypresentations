import React from 'react';
import { ChatMessage } from './components/ChatMessage';
import type { ChatMessage as ChatMessageType } from './types/ChatMessage';

function App() {
  // Example messages demonstrating different markdown formats
  const messages: ChatMessageType[] = [
    {
      id: '1',
      content: 'Hello! This is a regular text message.',
      timestamp: new Date(),
      sender: {
        id: '1',
        name: 'John Doe'
      },
      type: 'text'
    },
    {
      id: '2',
      content: 'const greeting = "Hello World!";\nconsole.log(greeting);',
      timestamp: new Date(),
      sender: {
        id: '2',
        name: 'Jane Smith'
      },
      type: 'code',
      metadata: {
        language: 'javascript'
      }
    },
    {
      id: '3',
      content: 'Name|Age|City\nJohn|25|New York\nJane|24|London',
      timestamp: new Date(),
      sender: {
        id: '1',
        name: 'John Doe'
      },
      type: 'table',
      metadata: {
        tableHeaders: ['Name', 'Age', 'City']
      }
    },
    {
      id: '4',
      content: 'This is a blockquote example showing how quotes are rendered.',
      timestamp: new Date(),
      sender: {
        id: '2',
        name: 'Jane Smith'
      },
      type: 'quote'
    },
    {
      id: '5',
      content: 'Buy groceries\nFinish project\nCall mom',
      timestamp: new Date(),
      sender: {
        id: '1',
        name: 'John Doe'
      },
      type: 'list',
      metadata: {
        listType: 'unordered'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;