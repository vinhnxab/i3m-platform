import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { LoadingState, ErrorState } from '@/shared/components/dashboard';
import { 
  CustomerHeader, 
  CustomerStats, 
  CustomersList
} from '@/features/customers';
import { useCustomers } from '@/features/customers';

export function CustomerManagement() {
  const [activeTab, setActiveTab] = useState('customers');
  const { customers, stats, isLoading, error } = useCustomers();

  if (isLoading) {
    return <LoadingState message="Loading customer data..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const handleNewCustomer = () => {
    console.log('Creating new customer...');
  };

  const handleImportCustomers = () => {
    console.log('Importing customers...');
  };

  const handleViewCustomer = (customer: any) => {
    console.log('Viewing customer:', customer.id);
  };

  const handleEditCustomer = (customer: any) => {
    console.log('Editing customer:', customer.id);
  };

  const handleMoreCustomer = (customer: any) => {
    console.log('More options for customer:', customer.id);
  };

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <CustomerHeader 
        onNewCustomer={handleNewCustomer}
        onImportCustomers={handleImportCustomers}
      />

      {/* Customer Stats */}
      <CustomerStats stats={stats} />

      {/* Customer Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <CustomersList 
            customers={customers}
            onViewCustomer={handleViewCustomer}
            onEditCustomer={handleEditCustomer}
            onMoreCustomer={handleMoreCustomer}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Customer Analytics</h3>
            <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
          </div>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Customer Segments</h3>
            <p className="text-muted-foreground">Customer segmentation coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}