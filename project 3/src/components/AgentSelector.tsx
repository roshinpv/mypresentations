import React from 'react';
import { Bot } from 'lucide-react';
import type { Agent } from '../types';

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
}

export function AgentSelector({ agents, selectedAgent, onSelectAgent }: AgentSelectorProps) {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto bg-white rounded-lg shadow-sm">
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onSelectAgent(agent)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            selectedAgent?.id === agent.id
              ? 'bg-blue-100 text-blue-700'
              : 'hover:bg-gray-100'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span className="font-medium">{agent.name}</span>
        </button>
      ))}
    </div>
  );
}