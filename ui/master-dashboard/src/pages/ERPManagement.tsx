import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { useERP } from '@/features/erp/hooks/useERP';
import {
  ERPHeader,
  ERPStats,
  EmployeesList,
  ProjectsList,
  FinancialOverview,
  InventoryStats,
  HRStats
} from '@/features/erp';

export function ERPManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    employees,
    projects,
    financialData,
    inventoryStats,
    hrStats,
    isLoading,
    error,
    handleAddEmployee,
    handleAddProject,
    handleSearch,
    handleFilter,
    handleEditEmployee,
    handleDeleteEmployee,
    handleEditProject,
    handleDeleteProject
  } = useERP();

  if (isLoading) {
    return (
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ERP data...</p>
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
      <ERPHeader
        onAddEmployee={handleAddEmployee}
        onAddProject={handleAddProject}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {/* Stats */}
      <ERPStats stats={hrStats} />

      {/* ERP Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialOverview data={financialData} />
            <InventoryStats stats={inventoryStats} />
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6">
          <EmployeesList
            employees={employees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
            onAdd={handleAddEmployee}
          />
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <ProjectsList
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onAdd={handleAddProject}
          />
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <FinancialOverview data={financialData} />
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <InventoryStats stats={inventoryStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
