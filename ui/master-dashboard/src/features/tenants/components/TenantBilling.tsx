import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { TenantBilling as TenantBillingType } from '../types';

interface TenantBillingProps {
  billing: TenantBillingType;
  className?: string;
}

export function TenantBilling({ billing, className = "" }: TenantBillingProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Billing Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Overview</CardTitle>
          <CardDescription>Current plan and billing information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
              <p className="text-2xl font-bold">{billing.currentPlan}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">${billing.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${billing.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>Current platform usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Users</p>
              <p className="text-2xl font-bold">{billing.usage.users.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Storage</p>
              <p className="text-2xl font-bold">{billing.usage.storage.toLocaleString()} GB</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Calls</p>
              <p className="text-2xl font-bold">{billing.usage.apiCalls.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Billing and payment details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Payment Method</span>
              <span className="text-sm">{billing.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Next Billing</span>
              <span className="text-sm">{billing.nextBilling}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
