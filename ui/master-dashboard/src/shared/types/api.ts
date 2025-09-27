// API related types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface ApiClient {
  get<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<T>;
  post<T>(url: string, data?: any, config?: Partial<ApiRequestConfig>): Promise<T>;
  put<T>(url: string, data?: any, config?: Partial<ApiRequestConfig>): Promise<T>;
  delete<T>(url: string, config?: Partial<ApiRequestConfig>): Promise<T>;
  patch<T>(url: string, data?: any, config?: Partial<ApiRequestConfig>): Promise<T>;
}
