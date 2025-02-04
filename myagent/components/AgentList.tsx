'use client';

import { useEffect, useState } from 'react';
import { Agent } from '@/lib/types';
import { getAgents } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
        setError(null);
      } catch (error) {
        setError('Unable to connect to the server. Please ensure the backend is running on port 8000.');
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground loading-dots">Loading agents</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (agents.length === 0) {
    return (
      <Card className="bg-muted">
        <CardContent className="pt-6 text-center">
          <p>No agents created yet. Create your first agent to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id} className="hover:shadow-lg transition-shadow border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{agent.name}</span>
            </CardTitle>
            <CardDescription>
              {agent.description || 'No description provided'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{agent.files.length} files</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LinkIcon className="w-4 h-4" />
                <span>{agent.urls.length} URLs</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Created {format(new Date(agent.created_at), 'PPP')}
              </div>
            </div>
            <Link href={`/chat/${agent.id}`}>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with Agent
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}