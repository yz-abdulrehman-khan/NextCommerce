// src/app/(app)/products/[productId]/page.tsx
// This page displays details for a single product.
// Strategy: Incremental Static Regeneration (ISR).
// Product details (like price, description, images) might change.
// ISR allows serving a fast, statically generated page while ensuring the data
// is revalidated and updated periodically (e.g., every 10 minutes / 600 seconds).
// This is good for SEO and performance.
// The actual rendering of interactive elements is delegated to a Client Component.

import type { Product } from '@/types/app';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { ErrorMessage } from '@/components/common/error-message';
import { ProductDetailClientShell } from '@/components/product/product-detail-client-shell'; // Import the client component

interface ProductPageProps {
  params: {
    productId: string;
  };
}

async function getProduct(productId: string): Promise<Product | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`;
  try {
    // ISR: Revalidate product details every 10 minutes
    const res = await fetch(apiUrl, { next: { revalidate: 600 } });
    if (!res.ok) {
      if (res.status === 404) return null; // Explicitly handle 404 as "not found"
      throw new Error(`Failed to fetch product ${productId}. Status: ${res.status}`);
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !jsonResponse.data) {
      // If success is true but data is null, it's a valid "not found" from API
      if (jsonResponse.success && jsonResponse.data === null) return null;
      throw new Error(`Failed to fetch product ${productId}: Invalid API response.`);
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching product ${productId} from ${apiUrl}:`, error);
    throw error;
  }
}

// This is now a Server Component
export default async function ProductPage({ params }: ProductPageProps) {
  let product: Product | null = null;
  let fetchError: Error | null = null;

  try {
    product = await getProduct(params.productId);
  } catch (error) {
    fetchError = error instanceof Error ? error : new Error('An unknown error occurred');
  }

  if (fetchError) {
    return (
      <div className='container'>
        <ErrorMessage title='Error Loading Product' message={fetchError.message} fullPage={false} />
      </div>
    );
  }

  if (!product && !fetchError) {
    return (
      <div className='container py-10 text-center'>
        <AlertTriangle className='mx-auto h-12 w-12 text-destructive mb-4' />
        <h1 className='text-2xl font-semibold mb-4'>Product Not Found</h1>
        <p className='text-muted-foreground mb-6'>Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild>
          <Link href='/'>Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container'>
      <ProductDetailClientShell product={product} />
    </div>
  );
}
