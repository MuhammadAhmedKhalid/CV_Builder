import { getToken } from "./cookies";

// API utility functions for authenticated requests

export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  return fetch(url, fetchOptions);
}

// Convenience methods for common HTTP operations
export const api = {
  get: (url: string, options?: RequestInit) => 
    authenticatedFetch(url, { method: 'GET', ...options }),
    
  post: (url: string, data?: any, options?: RequestInit) => 
    authenticatedFetch(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
    
  put: (url: string, data?: any, options?: RequestInit) => 
    authenticatedFetch(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
    
  delete: (url: string, options?: RequestInit) => 
    authenticatedFetch(url, { method: 'DELETE', ...options }),
    
  patch: (url: string, data?: any, options?: RequestInit) => 
    authenticatedFetch(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
};