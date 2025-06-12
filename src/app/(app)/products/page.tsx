import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types/app';

async function getProducts(): Promise<Product[]> {
  // Use the absolute URL for server-side fetching
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

  try {
    // Use { cache: 'no-store' } to ensure fresh data on every request during development.
    // This prevents the server from caching a failed response.
    const res = await fetch(apiUrl, { cache: 'no-store' });

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

  if (!products || products.length === 0) {
    return (
      <div className='text-center py-10'>
        <h1 className='text-3xl font-bold tracking-tight mb-4'>All Products</h1>
        <p className='text-xl text-muted-foreground'>No products could be loaded at this time.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-3xl font-bold tracking-tight mb-8'>All Products</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
