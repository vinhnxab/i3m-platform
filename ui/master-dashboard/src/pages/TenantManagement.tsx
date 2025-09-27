import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { LoadingState, ErrorState } from '@/shared/components/dashboard';
import { 
  TenantHeader, 
  TenantStats, 
  TenantsList,
  TenantBilling,
  TenantSettings
} from '@/features/tenants';
import { useTenants } from '@/features/tenants';

export function TenantManagement() {
  const [activeTab, setActiveTab] = useState('tenants');
  const { tenants, stats, billing, isLoading, error } = useTenants();

  if (isLoading) {
    return <LoadingState message="Loading tenant data..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const handleNewTenant = () => {
    console.log('Creating new tenant...');
  };

  const handleViewTenant = (tenant: any) => {
    console.log('Viewing tenant:', tenant.id);
  };

  const handleEditTenant = (tenant: any) => {
    console.log('Editing tenant:', tenant.id);
  };

  const handleSuspendTenant = (tenant: any) => {
    console.log('Suspending tenant:', tenant.id);
  };

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <TenantHeader 
        onNewTenant={handleNewTenant}
      />

      {/* Tenant Stats */}
      <TenantStats stats={stats} />

      {/* Tenant Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Tenants Tab */}
        <TabsContent value="tenants" className="space-y-6">
          <TenantsList 
            tenants={tenants}
            onViewTenant={handleViewTenant}
            onEditTenant={handleEditTenant}
            onSuspendTenant={handleSuspendTenant}
          />
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <TenantBilling billing={billing} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <TenantSettings />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Tenant Analytics</h3>
            <p className="text-muted-foreground">Tenant analytics dashboard coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
