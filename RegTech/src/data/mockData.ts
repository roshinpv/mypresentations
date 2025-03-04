import { Regulation, Agency, Bank, ComplianceAlert, RegulatoryUpdate, GraphData, ChatMessage } from '../types';

// Mock Regulations
export const regulations: Regulation[] = [
  {
    id: 'reg-001',
    title: 'Basel III',
    agency: 'FDIC',
    impactLevel: 'High',
    lastUpdated: '2024-02-15',
    summary: 'Basel III is a global, voluntary regulatory framework on bank capital adequacy, stress testing, and market liquidity risk.',
    affectedEntities: ['JP Morgan Chase', 'Bank of America', 'Wells Fargo', 'Citigroup'],
    complianceSteps: [
      'Maintain minimum CET1 ratio of 4.5%',
      'Implement liquidity coverage ratio (LCR)',
      'Conduct stress tests quarterly',
      'Report capital adequacy to regulators'
    ],
    category: 'Capital'
  },
  {
    id: 'reg-002',
    title: 'Dodd-Frank Act',
    agency: 'OCC',
    impactLevel: 'Medium',
    lastUpdated: '2023-11-10',
    summary: 'The Dodd-Frank Wall Street Reform and Consumer Protection Act is a federal law that regulates the financial industry.',
    affectedEntities: ['All major banks', 'Investment firms', 'Credit unions'],
    complianceSteps: [
      'Establish risk committee',
      'Implement whistleblower programs',
      'Conduct annual stress tests',
      'Report to Financial Stability Oversight Council'
    ],
    category: 'Risk'
  },
  {
    id: 'reg-003',
    title: 'Volcker Rule',
    agency: 'SEC',
    impactLevel: 'High',
    lastUpdated: '2024-01-20',
    summary: 'The Volcker Rule restricts banks from making certain speculative investments that do not benefit their customers.',
    affectedEntities: ['Goldman Sachs', 'Morgan Stanley', 'JP Morgan Chase'],
    complianceSteps: [
      'Cease proprietary trading activities',
      'Divest from covered funds',
      'Implement compliance program',
      'Report trading activities quarterly'
    ],
    category: 'Risk'
  },
  {
    id: 'reg-004',
    title: 'Fair Lending Practices',
    agency: 'OCC',
    impactLevel: 'Medium',
    lastUpdated: '2023-12-05',
    summary: 'Regulations ensuring fair and equal access to credit for all Americans, prohibiting discrimination in lending.',
    affectedEntities: ['All retail banks', 'Mortgage lenders', 'Credit unions'],
    complianceSteps: [
      'Train staff on fair lending requirements',
      'Implement non-discriminatory lending policies',
      'Conduct regular audits of lending practices',
      'Report lending data to regulators'
    ],
    category: 'Consumer Protection'
  },
  {
    id: 'reg-005',
    title: 'Anti-Money Laundering (AML)',
    agency: 'FinCEN',
    impactLevel: 'High',
    lastUpdated: '2024-03-01',
    summary: 'Regulations requiring financial institutions to detect and prevent money laundering and terrorist financing.',
    affectedEntities: ['All banks', 'Payment processors', 'Cryptocurrency exchanges'],
    complianceSteps: [
      'Implement Know Your Customer (KYC) procedures',
      'Monitor transactions for suspicious activity',
      'File Suspicious Activity Reports (SARs)',
      'Conduct regular AML risk assessments'
    ],
    category: 'Fraud'
  }
];

// Mock Agencies
export const agencies: Agency[] = [
  {
    id: 'agency-001',
    name: 'FDIC',
    description: 'Federal Deposit Insurance Corporation - Insures deposits and examines/supervises financial institutions.',
    regulations: ['reg-001']
  },
  {
    id: 'agency-002',
    name: 'OCC',
    description: 'Office of the Comptroller of the Currency - Charters, regulates, and supervises national banks.',
    regulations: ['reg-002', 'reg-004']
  },
  {
    id: 'agency-003',
    name: 'SEC',
    description: 'Securities and Exchange Commission - Regulates securities markets and protects investors.',
    regulations: ['reg-003']
  },
  {
    id: 'agency-004',
    name: 'FinCEN',
    description: 'Financial Crimes Enforcement Network - Safeguards the financial system from illicit use.',
    regulations: ['reg-005']
  },
  {
    id: 'agency-005',
    name: 'FRB',
    description: 'Federal Reserve Board - Conducts monetary policy and supervises banking institutions.',
    regulations: []
  }
];

// Mock Banks
export const banks: Bank[] = [
  {
    id: 'bank-001',
    name: 'JP Morgan Chase',
    affectedRegulations: ['reg-001', 'reg-003']
  },
  {
    id: 'bank-002',
    name: 'Bank of America',
    affectedRegulations: ['reg-001', 'reg-002']
  },
  {
    id: 'bank-003',
    name: 'Wells Fargo',
    affectedRegulations: ['reg-001', 'reg-004']
  },
  {
    id: 'bank-004',
    name: 'Citigroup',
    affectedRegulations: ['reg-001', 'reg-005']
  },
  {
    id: 'bank-005',
    name: 'Goldman Sachs',
    affectedRegulations: ['reg-003', 'reg-005']
  }
];

// Mock Compliance Alerts
export const complianceAlerts: ComplianceAlert[] = [
  {
    id: 'alert-001',
    title: 'Basel III Capital Ratio Reporting Due',
    description: 'Quarterly capital adequacy report must be submitted to FDIC.',
    dueDate: '2024-06-30',
    priority: 'High',
    regulationId: 'reg-001'
  },
  {
    id: 'alert-002',
    title: 'Annual Stress Test Required',
    description: 'Dodd-Frank mandated annual stress test submission deadline approaching.',
    dueDate: '2024-07-15',
    priority: 'Medium',
    regulationId: 'reg-002'
  },
  {
    id: 'alert-003',
    title: 'Volcker Rule Compliance Audit',
    description: 'Internal audit of Volcker Rule compliance program required.',
    dueDate: '2024-06-10',
    priority: 'High',
    regulationId: 'reg-003'
  },
  {
    id: 'alert-004',
    title: 'Fair Lending Training Update',
    description: 'Staff training on updated fair lending requirements needed.',
    dueDate: '2024-08-01',
    priority: 'Medium',
    regulationId: 'reg-004'
  },
  {
    id: 'alert-005',
    title: 'AML Risk Assessment Due',
    description: 'Quarterly AML risk assessment and report submission required.',
    dueDate: '2024-06-30',
    priority: 'High',
    regulationId: 'reg-005'
  }
];

// Mock Regulatory Updates
export const regulatoryUpdates: RegulatoryUpdate[] = [
  {
    id: 'update-001',
    title: 'Basel III Liquidity Requirements Updated',
    date: '2024-05-15',
    agency: 'FDIC',
    description: 'FDIC has issued updated guidance on liquidity coverage ratio calculations.',
    regulationId: 'reg-001'
  },
  {
    id: 'update-002',
    title: 'Dodd-Frank Stress Test Scenarios Released',
    date: '2024-05-10',
    agency: 'FRB',
    description: 'Federal Reserve has released scenarios for 2024 stress tests.',
    regulationId: 'reg-002'
  },
  {
    id: 'update-003',
    title: 'Volcker Rule Compliance Deadline Extended',
    date: '2024-05-05',
    agency: 'SEC',
    description: 'SEC extends compliance deadline for certain Volcker Rule provisions by 6 months.',
    regulationId: 'reg-003'
  },
  {
    id: 'update-004',
    title: 'New Fair Lending Examination Procedures',
    date: '2024-04-28',
    agency: 'OCC',
    description: 'OCC releases updated examination procedures for fair lending compliance.',
    regulationId: 'reg-004'
  },
  {
    id: 'update-005',
    title: 'FinCEN Issues New AML Guidance',
    date: '2024-04-20',
    agency: 'FinCEN',
    description: 'New guidance on suspicious activity monitoring and reporting for digital assets.',
    regulationId: 'reg-005'
  }
];

// Mock Graph Data
export const graphData: GraphData = {
  nodes: [
    // Regulation nodes
    { id: 'reg-001', label: 'Basel III', type: 'regulation' },
    { id: 'reg-002', label: 'Dodd-Frank Act', type: 'regulation' },
    { id: 'reg-003', label: 'Volcker Rule', type: 'regulation' },
    { id: 'reg-004', label: 'Fair Lending', type: 'regulation' },
    { id: 'reg-005', label: 'AML', type: 'regulation' },
    
    // Agency nodes
    { id: 'agency-001', label: 'FDIC', type: 'agency' },
    { id: 'agency-002', label: 'OCC', type: 'agency' },
    { id: 'agency-003', label: 'SEC', type: 'agency' },
    { id: 'agency-004', label: 'FinCEN', type: 'agency' },
    { id: 'agency-005', label: 'FRB', type: 'agency' },
    
    // Bank nodes
    { id: 'bank-001', label: 'JP Morgan Chase', type: 'bank' },
    { id: 'bank-002', label: 'Bank of America', type: 'bank' },
    { id: 'bank-003', label: 'Wells Fargo', type: 'bank' },
    { id: 'bank-004', label: 'Citigroup', type: 'bank' },
    { id: 'bank-005', label: 'Goldman Sachs', type: 'bank' }
  ],
  links: [
    // Agency to Regulation links
    { source: 'agency-001', target: 'reg-001', label: 'Issues' },
    { source: 'agency-002', target: 'reg-002', label: 'Issues' },
    { source: 'agency-002', target: 'reg-004', label: 'Enforces' },
    { source: 'agency-003', target: 'reg-003', label: 'Issues' },
    { source: 'agency-004', target: 'reg-005', label: 'Issues' },
    { source: 'agency-005', target: 'reg-002', label: 'Enforces' },
    
    // Regulation to Bank links
    { source: 'reg-001', target: 'bank-001', label: 'Affects' },
    { source: 'reg-001', target: 'bank-002', label: 'Affects' },
    { source: 'reg-001', target: 'bank-003', label: 'Affects' },
    { source: 'reg-001', target: 'bank-004', label: 'Affects' },
    { source: 'reg-002', target: 'bank-002', label: 'Affects' },
    { source: 'reg-003', target: 'bank-001', label: 'Affects' },
    { source: 'reg-003', target: 'bank-005', label: 'Affects' },
    { source: 'reg-004', target: 'bank-003', label: 'Affects' },
    { source: 'reg-005', target: 'bank-004', label: 'Affects' },
    { source: 'reg-005', target: 'bank-005', label: 'Affects' }
  ]
};

// Mock Chat Messages
export const chatMessages: ChatMessage[] = [
  {
    id: 'msg-001',
    content: "What are the FDIC liquidity rules?",
    sender: 'user',
    timestamp: '2024-05-20T10:30:00Z'
  },
  {
    id: 'msg-002',
    content: "The FDIC liquidity rules are primarily defined in Basel III regulations. They require banks to maintain a Liquidity Coverage Ratio (LCR) of high-quality liquid assets that can be converted into cash to meet liquidity needs for a 30-day stress scenario. Banks must also implement a Net Stable Funding Ratio (NSFR) to promote more medium and long-term funding.",
    sender: 'bot',
    timestamp: '2024-05-20T10:30:05Z',
    citations: [
      {
        regulationId: 'reg-001',
        text: 'Basel III requires implementation of liquidity coverage ratio (LCR)'
      }
    ]
  },
  {
    id: 'msg-003',
    content: "How does this affect Wells Fargo specifically?",
    sender: 'user',
    timestamp: '2024-05-20T10:31:00Z'
  },
  {
    id: 'msg-004',
    content: "As a Global Systemically Important Bank (G-SIB), Wells Fargo is subject to the full LCR requirement of 100%. This means Wells Fargo must maintain high-quality liquid assets equal to or greater than its projected total net cash outflows over a 30-day stress period. Additionally, Wells Fargo must report its liquidity position to the FDIC quarterly and conduct internal liquidity stress tests. The bank must also maintain a liquidity risk management framework overseen by its board of directors.",
    sender: 'bot',
    timestamp: '2024-05-20T10:31:05Z',
    citations: [
      {
        regulationId: 'reg-001',
        text: 'Basel III affects Wells Fargo'
      }
    ]
  }
];