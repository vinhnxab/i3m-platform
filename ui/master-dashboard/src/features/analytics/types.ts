export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
}

export interface AnalyticsReport {
  id: string;
  title: string;
  description: string;
  type: 'dashboard' | 'custom' | 'scheduled';
  createdAt: Date;
  lastRun?: Date;
  isActive: boolean;
}
