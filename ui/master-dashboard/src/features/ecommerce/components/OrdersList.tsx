import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { ShoppingCart, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Order {
  id: number;
  customer: string;
  items: number;
  total: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  paymentMethod: string;
}

interface OrdersListProps {
  orders: Order[];
  onView?: (order: Order) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  onView
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-chart-2';
      case 'shipped': return 'bg-chart-1';
      case 'processing': return 'bg-chart-3';
      case 'pending': return 'bg-chart-4';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <ShoppingCart className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Track and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`} />
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.items} items • {order.paymentMethod} • {order.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">{order.total}</p>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span className="text-sm capitalize">{order.status}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onView?.(order)}>
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
