import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/shared/components/ui';
import { Globe, ShoppingCart, TrendingUp } from 'lucide-react';

interface SalesChannel {
  id: number;
  name: string;
  type: 'website' | 'marketplace' | 'social' | 'mobile';
  revenue: string;
  orders: number;
  growth: string;
  status: 'active' | 'inactive';
}

interface SalesChannelsProps {
  channels: SalesChannel[];
}

export const SalesChannels: React.FC<SalesChannelsProps> = ({ channels }) => {
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe className="w-4 h-4" />;
      case 'marketplace': return <ShoppingCart className="w-4 h-4" />;
      case 'social': return <TrendingUp className="w-4 h-4" />;
      case 'mobile': return <ShoppingCart className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-chart-2';
      case 'inactive': return 'bg-chart-4';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Channels</CardTitle>
        <CardDescription>Performance across different sales channels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {channels.map((channel) => (
            <div key={channel.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(channel.status)}`} />
                <div className="flex items-center space-x-2">
                  {getChannelIcon(channel.type)}
                  <div>
                    <p className="font-medium">{channel.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{channel.type}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">{channel.revenue}</p>
                  <p className="text-sm text-muted-foreground">{channel.orders} orders</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-chart-2">{channel.growth}</span> growth
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">{channel.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
