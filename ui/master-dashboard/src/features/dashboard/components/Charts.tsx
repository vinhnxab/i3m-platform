import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  change: number;
  color: string;
}

interface ChartsProps {
  revenueData?: ChartData[];
  userGrowthData?: ChartData[];
  className?: string;
}

const mockRevenueData: ChartData[] = [
  { name: 'Jan', value: 45000, change: 12, color: 'bg-chart-1' },
  { name: 'Feb', value: 52000, change: 15, color: 'bg-chart-2' },
  { name: 'Mar', value: 48000, change: -8, color: 'bg-chart-3' },
  { name: 'Apr', value: 61000, change: 27, color: 'bg-chart-4' },
  { name: 'May', value: 55000, change: -10, color: 'bg-chart-5' },
  { name: 'Jun', value: 67000, change: 22, color: 'bg-chart-6' },
];

const mockUserGrowthData: ChartData[] = [
  { name: 'Desktop', value: 65, change: 5, color: 'bg-chart-1' },
  { name: 'Mobile', value: 30, change: 12, color: 'bg-chart-2' },
  { name: 'Tablet', value: 5, change: -2, color: 'bg-chart-3' },
];

export function Charts({ 
  revenueData = mockRevenueData,
  userGrowthData = mockUserGrowthData,
  className = "" 
}: ChartsProps) {
  const maxRevenue = Math.max(...revenueData.map(d => d.value));
  
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 ${className}`}>
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Monthly Revenue</span>
          </CardTitle>
          <CardDescription>Revenue trends over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart Bars */}
            <div className="flex items-end justify-between h-48 space-x-2">
              {revenueData.map((item) => (
                <div key={item.name} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col items-center space-y-2">
                    <div 
                      className={`w-full ${item.color} rounded-t-lg transition-all duration-300 hover:opacity-80`}
                      style={{ 
                        height: `${(item.value / maxRevenue) * 100}%`,
                        minHeight: '20px'
                      }}
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs">${(item.value / 1000).toFixed(0)}K</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Lowest: ${Math.min(...revenueData.map(d => d.value)) / 1000}K</span>
              <span>Highest: ${maxRevenue / 1000}K</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-primary" />
            <span>User Distribution</span>
          </CardTitle>
          <CardDescription>User distribution by device type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Pie Chart Representation */}
            <div className="flex items-center justify-center h-48">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
                {userGrowthData.map((item, index) => {
                  const percentage = item.value;
                  const rotation = userGrowthData.slice(0, index).reduce((acc, curr) => acc + curr.value, 0) * 3.6;
                  return (
                    <div
                      key={item.name}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(from ${rotation}deg, var(--chart-${index + 1}) 0deg, var(--chart-${index + 1}) ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`
                      }}
                    />
                  );
                })}
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-2">
              {userGrowthData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{item.value}%</span>
                    <div className="flex items-center space-x-1">
                      {item.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-xs ${item.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
