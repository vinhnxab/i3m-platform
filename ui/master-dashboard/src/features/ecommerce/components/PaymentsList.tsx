import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/shared/components/ui';
import { CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Payment {
  id: number;
  orderId: number;
  amount: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  customer: string;
}

interface PaymentsListProps {
  payments: Payment[];
}

export const PaymentsList: React.FC<PaymentsListProps> = ({ payments }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-chart-2';
      case 'pending': return 'bg-chart-3';
      case 'failed': return 'bg-chart-4';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Transactions</CardTitle>
        <CardDescription>Monitor payment processing and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(payment.status)}`} />
                <div>
                  <p className="font-medium">Payment #{payment.id}</p>
                  <p className="text-sm text-muted-foreground">{payment.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    Order #{payment.orderId} • {payment.method} • {payment.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">{payment.amount}</p>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(payment.status)}
                    <span className="text-sm capitalize">{payment.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
