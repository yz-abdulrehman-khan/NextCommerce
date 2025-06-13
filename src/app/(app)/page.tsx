import { apiClient } from '@/lib/api-client';
import { PageLayout } from '@/components/common/page-layout';
import { PageHeader } from '@/components/common/page-header';
import { ProductGrid } from '@/components/product/product-grid';

/**
 * This is the main products page, serving as the application's homepage.
 *
 * Rendering Strategy: Incremental Static Regeneration (ISR).
 * - The product list is fetched at build time and then re-fetched in the background
 *   at most once per hour. This provides a fast initial load (great for SEO and UX)
 *   while keeping the product data reasonably fresh.
 * - If the fetch fails, Next.js will serve the last successfully generated static page.
 *   Errors are caught and can be handled by the global `error.tsx` boundary.
 */
export default async function ProductsPage() {
  const products = await apiClient.getProducts() || []; // Default to an empty array if null

  return (
    <PageLayout>
      <PageHeader title='All Products' description='Browse our collection of high-quality products.' />
      <ProductGrid products={products} />
    </PageLayout>
  );
}
