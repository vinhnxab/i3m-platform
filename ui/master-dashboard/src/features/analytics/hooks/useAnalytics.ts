import { useState } from 'react';
import { 
  mockKPIStats, 
  mockCustomerMetrics, 
  mockPlatformMetrics, 
  mockRegionalData, 
  mockPerformanceMetrics, 
  mockConversionFunnel 
} from '../../../../mock-data/analytics';

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kpiStats = mockKPIStats;
  const customerMetrics = mockCustomerMetrics;
  const platformMetrics = mockPlatformMetrics;
  const regionalData = mockRegionalData;
  const performanceMetrics = mockPerformanceMetrics;
  const conversionFunnel = mockConversionFunnel;

  const handleFilter = () => {
    console.log('Filter analytics data');
  };

  const handleExport = () => {
    console.log('Export analytics data');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return {
    kpiStats,
    customerMetrics,
    platformMetrics,
    regionalData,
    performanceMetrics,
    conversionFunnel,
    isLoading,
    error,
    handleFilter,
    handleExport,
    handleRefresh
  };
};
