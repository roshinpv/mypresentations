'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Upload, Link as LinkIcon, AlertCircle, Loader2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createAgent } from '@/lib/api';

export default function CreateAgent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [urls, setUrls] = useState('');
  const [recursive, setRecursive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
      }
      const agent = await createAgent(formData);
      router.push(`/chat/${agent.id}`);
    } catch (error) {
      setError('Unable to create agent. Please ensure the backend server is running on port 8000.');
      console.error('Failed to create agent:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex items-center gap-2 mb-8">
        <Bot className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Create New Agent</h1>
      </div>

      {error && (
        <Card className="border-destructive mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter agent name"
                required
                className="border-primary/20 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this agent is for..."
                className="min-h-[100px] border-primary/20 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="system_prompt" className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                System Prompt
              </Label>
              <Textarea
                id="system_prompt"
                name="system_prompt"
                placeholder="Enter system instructions for the agent..."
                className="min-h-[150px] font-mono text-sm border-primary/20 focus-visible:ring-primary"
              />
              <p className="text-sm text-muted-foreground">
                Define the agent's behavior and capabilities. This prompt will guide how the agent responds to queries.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Upload Files</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="files"
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className="cursor-pointer border-primary/20 focus-visible:ring-primary"
                />
                <Upload className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urls">URLs (comma-separated)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="urls"
                  name="urls"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder="https://example.com, https://another.com"
                  className="border-primary/20 focus-visible:ring-primary"
                />
                <LinkIcon className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Switch
                id="url_recursive"
                name="url_recursive"
                checked={recursive}
                onCheckedChange={setRecursive}
              />
              <Label htmlFor="url_recursive">Process URLs recursively</Label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Agent...
                </>
              ) : (
                'Create Agent'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}