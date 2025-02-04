import { Bot, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AgentList from '@/components/AgentList';

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Bot className="w-10 h-10" />
          Agent Chat
        </h1>
        <Link href="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
        </Link>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to Agent Chat</CardTitle>
          <CardDescription>
            Create and chat with AI agents that can process files and URLs. Each agent maintains its own context and knowledge base.
          </CardDescription>
        </CardHeader>
      </Card>

      <AgentList />
    </div>
  );
}