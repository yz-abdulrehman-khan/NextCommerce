// This page displays all products.
// Strategy: Incremental Static Regeneration (ISR).
// Products can be numerous and might update (price, new additions).
// ISR allows serving a statically generated page for speed and SEO,
// while revalidating and updating the page in the background periodically.
// A revalidate time of 1 hour (3600 seconds) is chosen as a balance.
// For a real e-commerce site, this might be shorter (e.g., 5-15 minutes)
// or triggered by on-demand revalidation when products are updated in a CMS.

import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types/app';
import { PackageSearch } from 'lucide-react';

async function getProducts(): Promise<Product[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } }); // ISR: Revalidate every 1 hour
    if (!res.ok) {
      console.error('Failed to fetch products, status:', res.status);
      return [];
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !Array.isArray(jsonResponse.data)) {
      console.error('Failed to fetch products, invalid response:', jsonResponse);
      return [];
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching products from ${apiUrl}:`, error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    // This container div now centers the content based on our tailwind.config.ts
    <div className='container'>
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>All Products</h1>
      </div>

      {!products || products.length === 0 ? (
        <div className='text-center py-10'>
          <PackageSearch className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-xl text-muted-foreground'>No products could be loaded at this time.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
