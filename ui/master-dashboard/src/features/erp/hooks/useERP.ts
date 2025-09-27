import { useState } from 'react';
import { 
  mockEmployees, 
  mockProjects, 
  mockFinancialData, 
  mockInventoryStats, 
  mockHRStats 
} from '../../../../mock-data/erp';

export const useERP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const employees = mockEmployees;
  const projects = mockProjects;
  const financialData = mockFinancialData;
  const inventoryStats = mockInventoryStats;
  const hrStats = mockHRStats;

  const handleAddEmployee = () => {
    console.log('Add new employee');
  };

  const handleAddProject = () => {
    console.log('Add new project');
  };

  const handleSearch = () => {
    console.log('Search ERP data');
  };

  const handleFilter = () => {
    console.log('Filter ERP data');
  };

  const handleEditEmployee = (employee: any) => {
    console.log('Edit employee:', employee.id);
  };

  const handleDeleteEmployee = (employee: any) => {
    console.log('Delete employee:', employee.id);
  };

  const handleEditProject = (project: any) => {
    console.log('Edit project:', project.id);
  };

  const handleDeleteProject = (project: any) => {
    console.log('Delete project:', project.id);
  };

  return {
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
  };
};