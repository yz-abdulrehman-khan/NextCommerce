import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { formatPrice } from '@/lib/formatters';
import { PageLayout } from '@/components/common/page-layout';
import { ProductImageGallery } from '@/components/product/product-image-gallery';
import { ProductPurchaseForm } from '@/components/product/product-purchase-form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

/**
 * This page displays the details for a single product.
 *
 * Rendering Strategy: Incremental Static Regeneration (ISR).
 * - Product details are fetched at build time and revalidated periodically (e.g., every 10 minutes).
 * - This ensures the page is fast and SEO-friendly, while keeping data like price and
 *   description relatively up-to-date.
 * - Interactive elements (image gallery, add to cart button) are client components.
 * - If the product ID is not found, it triggers the `not-found.tsx` page.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await apiClient.getProductById(params.productId);

  if (!product) {
    notFound();
  }

  return (
    <PageLayout>
      <div className='grid md:grid-cols-2 gap-8 lg:gap-12'>
        {/* Key the ProductImageGallery by product.id */}
        <ProductImageGallery key={product.id} product={product} />

        <div className='flex flex-col'>
          <h1 className='text-3xl lg:text-4xl font-bold tracking-tight mb-3'>{product.name}</h1>
          <p className='text-2xl font-semibold text-primary mb-4'>{formatPrice(product.price.amount)}</p>

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
                  <Badge key={categorySlug} variant='secondary' className='text-sm'>
                    {categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <ProductPurchaseForm product={product} />
        </div>
      </div>
    </PageLayout>
  );
}
