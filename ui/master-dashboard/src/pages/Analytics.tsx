import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { 
  AnalyticsHeader,
  KPICards,
  CustomerMetrics,
  PlatformMetrics,
  RegionalData,
  PerformanceMetrics,
  ConversionFunnel
} from '@/features/analytics';
import { useState } from 'react';

export function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const {
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
  } = useAnalytics();

  if (isLoading) {
  return (
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics data...</p>
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
      <AnalyticsHeader
        onFilter={handleFilter}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* KPI Overview */}
      <KPICards stats={kpiStats} />

      {/* Analytics Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerMetrics metrics={customerMetrics} />
            <PlatformMetrics metrics={platformMetrics} />
          </div>
          <RegionalData data={regionalData} />
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <CustomerMetrics metrics={customerMetrics} />
        </TabsContent>

        {/* Platform Tab */}
        <TabsContent value="platform" className="space-y-6">
          <PlatformMetrics metrics={platformMetrics} />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <PerformanceMetrics metrics={performanceMetrics} />
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <ConversionFunnel funnel={conversionFunnel} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
