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
import { ProductDetailClientShell } from '@/components/product/product-detail-client-shell';

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
      // This will be caught by the error boundary or return null
      console.error(`Failed to fetch product ${productId}, status:`, res.status);
      return null;
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !jsonResponse.data) {
      console.error(`Failed to fetch product ${productId}, invalid response:`, jsonResponse);
      return null;
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching product ${productId} from ${apiUrl}:`, error);
    return null; // Let the page handle the null product case
  }
}

// This is now a Server Component
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.productId);

  if (!product) {
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
