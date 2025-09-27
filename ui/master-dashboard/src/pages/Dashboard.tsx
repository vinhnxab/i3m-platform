import React from 'react';
import { DashboardOverview } from '@/features/dashboard';
import { PermissionTest } from '@/components/PermissionTest';
import { PermissionDashboard } from '@/components/PermissionDashboard';
import { AdvancedPermissionDashboard } from '@/components/AdvancedPermissionDashboard';
import { PermissionManagement } from '@/components/PermissionManagement';
import { PermissionAnalytics } from '@/components/PermissionAnalytics';
import { PermissionAuditLog } from '@/components/PermissionAuditLog';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardOverview />
      <PermissionDashboard />
      <AdvancedPermissionDashboard />
      <PermissionManagement />
      <PermissionAnalytics />
      <PermissionAuditLog />
      <PermissionTest />
    </div>
  );
};

export default Dashboard;
