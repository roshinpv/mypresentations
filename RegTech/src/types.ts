// Types for the application

export interface Regulation {
  id: string;
  title: string;
  agency: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  summary: string;
  affectedEntities: string[];
  complianceSteps: string[];
  category: 'Risk' | 'Capital' | 'Consumer Protection' | 'Fraud' | 'Other';
}

export interface Agency {
  id: string;
  name: string;
  description: string;
  regulations: string[];
}

export interface Bank {
  id: string;
  name: string;
  affectedRegulations: string[];
}

export interface ComplianceAlert {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  regulationId: string;
}

export interface RegulatoryUpdate {
  id: string;
  title: string;
  date: string;
  agency: string;
  description: string;
  regulationId: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'regulation' | 'agency' | 'bank';
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  citations?: {
    regulationId: string;
    text: string;
  }[];
}