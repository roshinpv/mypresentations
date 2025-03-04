import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText } from 'lucide-react';
import { chatMessages as initialMessages } from '../../data/mockData';
import { ChatMessage } from '../../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${messages.length + 1}`,
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `msg-${messages.length + 2}`,
        content: generateBotResponse(input),
        sender: 'bot',
        timestamp: new Date().toISOString(),
        citations: [
          {
            regulationId: 'reg-001',
            text: 'Basel III requires implementation of liquidity coverage ratio (LCR)'
          }
        ]
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  const generateBotResponse = (userInput: string): string => {
    // This is a simple mock response generator
    // In a real application, this would call an LLM API
    
    const input = userInput.toLowerCase();
    
    if (input.includes('basel') || input.includes('capital')) {
      return "Basel III establishes minimum capital requirements for banks. The key components include Common Equity Tier 1 (CET1) ratio of 4.5%, Tier 1 capital ratio of 6%, and total capital ratio of 8%. Additionally, banks must maintain a capital conservation buffer of 2.5% and potentially a countercyclical buffer of up to 2.5%.";
    }
    
    if (input.includes('liquidity') || input.includes('lcr')) {
      return "The Liquidity Coverage Ratio (LCR) requires banks to maintain sufficient high-quality liquid assets to cover their total net cash outflows over a 30-day stress period. The Net Stable Funding Ratio (NSFR) requires banks to maintain a stable funding profile in relation to their on and off-balance sheet activities.";
    }
    
    if (input.includes('volcker')) {
      return "The Volcker Rule prohibits banks from engaging in proprietary trading and limits their investments in hedge funds and private equity funds. Banks must establish compliance programs to ensure they are not engaging in prohibited activities.";
    }
    
    if (input.includes('aml') || input.includes('money laundering')) {
      return "Anti-Money Laundering (AML) regulations require financial institutions to implement Know Your Customer (KYC) procedures, monitor transactions for suspicious activity, and report suspicious transactions to the appropriate authorities.";
    }
    
    return "I'm your AI Compliance Assistant. I can help answer questions about banking regulations, compliance requirements, and regulatory impacts. Please ask a specific question about a regulation or compliance topic.";
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">AI Compliance Assistant</h2>
        <button className="btn btn-outline text-sm">Clear Chat</button>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`chat-message ${
                message.sender === 'user' ? 'chat-message-user' : 'chat-message-bot'
              }`}
            >
              <div className="text-sm">
                {message.content}
              </div>
              
              {message.citations && message.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-neutral-lighter/50">
                  <div className="flex items-center text-xs text-neutral-light">
                    <FileText size={12} className="mr-1" />
                    <span>Citations:</span>
                  </div>
                  <ul className="mt-1 space-y-1">
                    {message.citations.map((citation, index) => (
                      <li key={index} className="text-xs text-primary">
                        <button className="underline">
                          {citation.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="text-right mt-1">
                <span className="text-xs text-neutral-light">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="mt-auto">
        <div className="flex items-center border border-neutral-lighter rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Ask about regulations or compliance..."
            className="flex-1 px-4 py-3 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-primary text-white p-3 hover:bg-primary-dark"
            disabled={!input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-neutral-light mt-2">
          Powered by Llama 3.2 6B fine-tuned on regulatory data
        </p>
      </form>
    </div>
  );
};

export default ChatInterface;