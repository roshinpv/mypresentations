// Types for the application

export interface Regulation {
  id: string;
  title: string;
  agency_id: string;
  agency?: {
    id: string;
    name: string;
  };
  impact_level: 'High' | 'Medium' | 'Low';
  last_updated: string;
  summary: string;
  category: 'Risk' | 'Capital' | 'Consumer Protection' | 'Fraud' | 'Other';
  compliance_steps: ComplianceStep[];
  affected_banks?: Bank[];
  updates?: RegulatoryUpdate[];
  alerts?: ComplianceAlert[];
}

export interface ComplianceStep {
  id: string;
  regulation_id: string;
  description: string;
  order: number;
}

export interface Agency {
  id: string;
  name: string;
  description: string;
  regulations?: Regulation[];
}

export interface Bank {
  id: string;
  name: string;
  affected_regulations?: Regulation[];
}

export interface ComplianceAlert {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'High' | 'Medium' | 'Low';
  regulation_id: string;
  regulation?: Regulation;
  created_at: string;
}

export interface RegulatoryUpdate {
  id: string;
  title: string;
  date: string;
  agency: string;
  description: string;
  regulation_id: string;
  regulation?: Regulation;
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
  user_id: string;
  citations?: {
    id?: string;
    regulation_id: string;
    text: string;
  }[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}