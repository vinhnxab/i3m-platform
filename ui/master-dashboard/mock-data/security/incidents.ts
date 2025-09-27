// Mock Security Incidents Data
export interface MockIncident {
  id: number;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  resolution?: string;
}

export const mockIncidents: MockIncident[] = [
  {
    id: 1,
    title: 'Unauthorized Access Attempt',
    severity: 'high',
    status: 'investigating',
    assignedTo: 'Security Team',
    createdAt: '2024-01-15 14:30:00',
    updatedAt: '2024-01-15 15:45:00',
    description: 'Suspicious login attempt detected from unknown location'
  },
  {
    id: 2,
    title: 'Data Breach Alert',
    severity: 'critical',
    status: 'open',
    assignedTo: 'Incident Response Team',
    createdAt: '2024-01-15 13:15:00',
    updatedAt: '2024-01-15 13:15:00',
    description: 'Potential data exposure detected in customer database'
  },
  {
    id: 3,
    title: 'Malware Detection',
    severity: 'medium',
    status: 'resolved',
    assignedTo: 'IT Security',
    createdAt: '2024-01-15 10:20:00',
    updatedAt: '2024-01-15 11:30:00',
    description: 'Malicious file detected and quarantined',
    resolution: 'File quarantined and system cleaned. No data compromised.'
  }
];
