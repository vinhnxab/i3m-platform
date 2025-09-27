import { useState } from 'react';
import { 
  mockEcommerceStats, 
  mockProducts, 
  mockOrders, 
  mockPayments, 
  mockSalesChannels 
} from '../../../../mock-data/ecommerce';

export const useEcommerce = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ecommerceStats = mockEcommerceStats;
  const products = mockProducts;
  const orders = mockOrders;
  const payments = mockPayments;
  const salesChannels = mockSalesChannels;

  const handleAddProduct = () => {
    console.log('Add new product');
  };

  const handleViewAnalytics = () => {
    console.log('View analytics');
  };

  const handleViewProduct = (product: any) => {
    console.log('View product:', product.id);
  };

  const handleEditProduct = (product: any) => {
    console.log('Edit product:', product.id);
  };

  const handleDeleteProduct = (product: any) => {
    console.log('Delete product:', product.id);
  };

  const handleViewOrder = (order: any) => {
    console.log('View order:', order.id);
  };

  return {
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
  };
};
