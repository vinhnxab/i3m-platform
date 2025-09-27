import { ApiResponse, PaginatedResponse, ApiError } from '@/shared/types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.code || 'API_ERROR',
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.details
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Network request failed'
      );
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Specific API services
export const dashboardApi = {
  getStats: () => apiClient.get<ApiResponse<any>>('/dashboard/stats'),
  getSystemStatus: () => apiClient.get<ApiResponse<any>>('/dashboard/system-status'),
  getRecentActivity: () => apiClient.get<ApiResponse<any>>('/dashboard/recent-activity'),
};

export const erpApi = {
  getData: () => apiClient.get<ApiResponse<any>>('/erp/data'),
  getProjects: () => apiClient.get<PaginatedResponse<any>>('/erp/projects'),
  getInvoices: () => apiClient.get<PaginatedResponse<any>>('/erp/invoices'),
  createProject: (data: any) => apiClient.post<ApiResponse<any>>('/erp/projects', data),
  updateProject: (id: string, data: any) => apiClient.put<ApiResponse<any>>(`/erp/projects/${id}`, data),
  deleteProject: (id: string) => apiClient.delete<ApiResponse<any>>(`/erp/projects/${id}`),
};

export const cmsApi = {
  getContent: () => apiClient.get<PaginatedResponse<any>>('/cms/content'),
  createContent: (data: any) => apiClient.post<ApiResponse<any>>('/cms/content', data),
  updateContent: (id: string, data: any) => apiClient.put<ApiResponse<any>>(`/cms/content/${id}`, data),
  deleteContent: (id: string) => apiClient.delete<ApiResponse<any>>(`/cms/content/${id}`),
};

export const ecommerceApi = {
  getProducts: () => apiClient.get<PaginatedResponse<any>>('/ecommerce/products'),
  getOrders: () => apiClient.get<PaginatedResponse<any>>('/ecommerce/orders'),
  createProduct: (data: any) => apiClient.post<ApiResponse<any>>('/ecommerce/products', data),
  updateProduct: (id: string, data: any) => apiClient.put<ApiResponse<any>>(`/ecommerce/products/${id}`, data),
  deleteProduct: (id: string) => apiClient.delete<ApiResponse<any>>(`/ecommerce/products/${id}`),
};
