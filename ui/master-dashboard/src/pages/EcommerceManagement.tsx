import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { useEcommerce } from '@/features/ecommerce/hooks/useEcommerce';
import {
  EcommerceHeader,
  EcommerceStats,
  ProductsList,
  OrdersList,
  PaymentsList,
  SalesChannels
} from '@/features/ecommerce';

export function EcommerceManagement() {
  const [activeTab, setActiveTab] = useState('products');
  const {
    ecommerceStats,
    products,
    orders,
    payments,
    salesChannels,
    isLoading,
    error,
    handleAddProduct,
    handleViewAnalytics,
    handleViewProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleViewOrder
  } = useEcommerce();

  if (isLoading) {
    return (
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ecommerce data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-6">
      {/* Header */}
      <EcommerceHeader
        onAddProduct={handleAddProduct}
        onViewAnalytics={handleViewAnalytics}
      />

      {/* Stats */}
      <EcommerceStats stats={ecommerceStats} />

      {/* Ecommerce Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <ProductsList
            products={products}
            onView={handleViewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onAdd={handleAddProduct}
          />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <OrdersList
            orders={orders}
            onView={handleViewOrder}
          />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <PaymentsList payments={payments} />
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <SalesChannels channels={salesChannels} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
