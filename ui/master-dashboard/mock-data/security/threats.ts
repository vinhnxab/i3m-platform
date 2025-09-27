// Mock Security Threats Data
export interface MockThreat {
  id: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  status: 'blocked' | 'mitigated' | 'investigating' | 'resolved';
  timestamp: string;
  description: string;
  actions: string[];
}

export const mockThreats: MockThreat[] = [
  {
    id: 1,
    type: 'SQL Injection Attempt',
    severity: 'high',
    source: '192.168.1.100',
    target: 'Customer Database',
    status: 'blocked',
    timestamp: '2024-01-15 14:35:22',
    description: 'Malicious SQL injection attempt detected on login endpoint',
    actions: ['IP Blocked', 'Alert Sent', 'Log Created']
  },
  {
    id: 2,
    type: 'Brute Force Attack',
    severity: 'medium',
    source: '203.45.67.89',
    target: 'Admin Panel',
    status: 'mitigated',
    timestamp: '2024-01-15 13:20:15',
    description: 'Multiple failed login attempts from suspicious IP',
    actions: ['Rate Limited', 'CAPTCHA Enabled', 'Monitoring']
  },
  {
    id: 3,
    type: 'DDoS Attack',
    severity: 'critical',
    source: 'Multiple IPs',
    target: 'Web Server',
    status: 'investigating',
    timestamp: '2024-01-15 12:45:30',
    description: 'Distributed denial of service attack targeting main website',
    actions: ['Traffic Filtered', 'CDN Activated', 'Emergency Response']
  }
];
