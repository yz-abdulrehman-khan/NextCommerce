import Image from 'next/image';
import type { Product } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

async function getProduct(productId: string): Promise<Product | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`;
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
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
    return null;
  }
}

const formatPrice = (price: { amount: number; currency: string }) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
  }).format(price.amount);
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.productId);

  if (!product) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <h1 className='text-2xl font-semibold mb-4'>Product Not Found</h1>
        <p className='text-muted-foreground mb-6'>Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild>
          <Link href='/products'>Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-2 gap-8 lg:gap-12'>
        {/* Image Gallery Section */}
        <div>
          <div className='aspect-square relative overflow-hidden rounded-lg border mb-4'>
            <Image
              src={product.images[0] || '/placeholder.svg?width=600&height=600&query=product+image'}
              alt={product.name}
              fill
              className='object-cover'
              priority // Prioritize the main product image
            />
          </div>
          {product.images.length > 1 && (
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2'>
              {product.images.slice(0, 4).map(
                (
                  img,
                  index, // Show up to 4 thumbnails
                ) => (
                  <div key={index} className='aspect-square relative overflow-hidden rounded-md border'>
                    <Image
                      src={img || '/placeholder.svg?width=150&height=150&query=thumbnail'}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className='object-cover hover:scale-105 transition-transform'
                    />
                    {/* TODO: Add click handler to change main image */}
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className='flex flex-col'>
          <h1 className='text-3xl lg:text-4xl font-bold tracking-tight mb-3'>{product.name}</h1>
          <p className='text-2xl font-semibold text-primary mb-4'>{formatPrice(product.price)}</p>

          <Separator className='my-4' />

          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-2'>Description</h2>
            <p className='text-muted-foreground leading-relaxed'>{product.description || 'No description available.'}</p>
          </div>

          {product.categories && product.categories.length > 0 && (
            <div className='mb-6'>
              <h2 className='text-xl font-semibold mb-2'>Categories</h2>
              <div className='flex flex-wrap gap-2'>
                {product.categories.map(categorySlug => (
                  <Button key={categorySlug} variant='outline' size='sm' asChild>
                    {/* Assuming category slugs match category names for now, or link to /categories/[slug] */}
                    <Link href={`/categories/${categorySlug.replace('category-', '')}`}>
                      {categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className='mt-auto'>
            {' '}
            {/* Pushes button to the bottom */}
            <Button size='lg' className='w-full'>
              <ShoppingCart className='mr-2 h-5 w-5' /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Optional: Generate static paths if you know all product IDs at build time
// export async function generateStaticParams() {
//   const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
//   const res = await fetch(apiUrl);
//   const productsData = await res.json();
//   if (productsData.success && Array.isArray(productsData.data)) {
//     return productsData.data.map((product: Product) => ({
//       productId: product.id,
//     }));
//   }
//   return [];
// }
