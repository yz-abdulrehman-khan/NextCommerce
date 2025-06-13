// src/lib/api-client.ts
import type { Product, Category, Order, CheckoutItem } from '@/types/app';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL && typeof window !== 'undefined') {
  // Throw error only on client-side if var is missing, server-side might be okay if using relative paths for internal API
  // Or if you expect it to always be set, throw unconditionally:
  // throw new Error("NEXT_PUBLIC_API_URL is not defined. Please set it in your environment variables.");
  console.warn("NEXT_PUBLIC_API_URL is not defined. API calls might fail if it's required.");
}

/**
 * A generic fetch function to handle API requests, parsing, and error handling.
 * It now returns T | null to gracefully handle "not found" scenarios.
 * @param endpoint - The API endpoint to fetch (e.g., '/api/products').
 * @param options - Optional fetch options (e.g., method, headers, body, cache tags).
 * @returns The data from the API response, or null if the item is not found or an error occurs.
 * @throws An error for non-404 client errors or server errors if not handled as "not found".
 */
async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const base = API_BASE_URL || ''; // Fallback to empty string if undefined
  const url = `${base}${endpoint}`;
  try {
    const res = await fetch(url, options);

    // If response is not OK, try to parse error, but handle 404-like specifically
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({})); // Try to get error message from body
      // If the API explicitly says "Item not found!" or it's a 404, treat as null
      if (res.status === 404 || errorBody.message === 'Item not found!') {
        console.warn(`Resource not found at ${endpoint} (status ${res.status}). Returning null.`);
        return null;
      }
      // For other errors, throw to be caught by error boundaries or try/catch
      const errorMessage = errorBody.message || `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    const jsonResponse = await res.json();

    // If API call was "successful" (e.g. 200 OK) but payload indicates failure
    if (!jsonResponse.success) {
      // If it's a "not found" message within a success=false payload
      if (jsonResponse.message === 'Item not found!') {
        console.warn(`API reported success:false but item not found at ${endpoint}. Returning null.`);
        return null;
      }
      // For other success:false cases, throw an error
      throw new Error(jsonResponse.message || 'API request was not successful according to payload.');
    }

    // If data is explicitly null in a success=true response, treat as not found
    if (jsonResponse.data === null && (endpoint.includes('/products/') || endpoint.includes('/categories/'))) {
      console.warn(`API reported success:true but data is null for ${endpoint}. Returning null.`);
      return null;
    }

    return jsonResponse.data as T;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    // For Server Components, throwing here will be caught by error.tsx
    // For Client Components, this needs to be handled by a try/catch
    if (options.method && options.method !== 'GET') {
      // For mutations, rethrow
      throw error;
    }
    return null; // For GET requests in client components, returning null might be preferred over crashing
  }
}

export const apiClient = {
  getProducts: (): Promise<Product[] | null> => {
    return fetcher<Product[]>('/api/products', { next: { revalidate: 3600, tags: ['products'] } });
  },
  getProductById: (productId: string): Promise<Product | null> => {
    return fetcher<Product | null>(`/api/products/${productId}`, {
      next: { revalidate: 600, tags: [`products:${productId}`] },
    });
  },
  getCategories: (): Promise<Category[] | null> => {
    return fetcher<Category[]>('/api/categories', { next: { revalidate: 86400, tags: ['categories'] } });
  },
  getCategoryById: (categoryId: string): Promise<Category | null> => {
    return fetcher<Category | null>(`/api/categories/${categoryId}`, {
      next: { revalidate: 86400, tags: [`categories:${categoryId}`] },
    });
  },
  getProductsByCategorySlug: (categorySlug: string): Promise<Product[] | null> => {
    return fetcher<Product[] | null>(`/api/products?category=${categorySlug}`, {
      next: { revalidate: 3600, tags: ['products', `categories:${categorySlug}:products`] },
    });
  },
  getOrders: (): Promise<Order[] | null> => {
    return fetcher<Order[]>('/api/orders', { cache: 'no-store' }); // Client-side, no caching
  },
  checkout: (items: CheckoutItem[]): Promise<Order> => {
    // For POST, we expect a non-null response or an error to be thrown by fetcher
    return fetcher<Order>('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: items }),
    }).then(order => {
      if (!order) throw new Error('Checkout failed: No order data returned.');
      return order;
    });
  },
};
