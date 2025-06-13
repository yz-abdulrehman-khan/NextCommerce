import type { Product } from '@/types/app';
import { ProductCard } from '@/components/product/product-card';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className='text-center py-10'>
        <PackageSearch className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
        <p className='text-xl text-muted-foreground'>No products found.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
