'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Agent, Message } from '@/lib/types';
import { getAgent, sendMessage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const { id } = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const data = await getAgent(Number(id));
        setAgent(data);
        setError(null);
      } catch (error) {
        setError('Unable to connect to the server. Please ensure the backend is running on port 8000.');
        console.error('Failed to fetch agent:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [agent?.context]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !agent || loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await sendMessage(agent.id, input);
      setAgent({
        ...agent,
        context: response.context,
      });
      setInput('');
    } catch (error) {
      setError('Failed to send message. Please try again.');
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground loading-dots">Loading chat</p>
      </div>
    );
  }

  if (error && !agent) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Card className="border-destructive max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Agent not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b border-primary/10 p-4">
        <div className="container mx-auto flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold">{agent.name}</h1>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="container mx-auto space-y-4">
          {agent.context.map((message: Message, index: number) => (
            <Card
              key={index}
              className={`p-4 max-w-3xl ${
                message.role === 'user' 
                  ? 'ml-auto bg-primary text-primary-foreground' 
                  : 'mr-auto border-primary/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {message.role === 'user' ? (
                  <User className="w-5 h-5 mt-1" />
                ) : (
                  <Bot className="w-5 h-5 mt-1" />
                )}
                <div className="prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{message.message}</ReactMarkdown>
                </div>
              </div>
            </Card>
          ))}
          {loading && (
            <Card className="mr-auto p-4 border-primary/10">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5" />
                <div className="text-muted-foreground loading-dots">Thinking</div>
              </div>
            </Card>
          )}
          {error && (
            <Card className="mx-auto border-destructive p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </Card>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-primary/10 p-4">
        <div className="container mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="border-primary/20 focus-visible:ring-primary"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}