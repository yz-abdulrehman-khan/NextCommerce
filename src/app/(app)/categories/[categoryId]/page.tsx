import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { PageLayout } from '@/components/common/page-layout';
import { PageHeader } from '@/components/common/page-header';
import { ProductGrid } from '@/components/product/product-grid';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

/**
 * This page displays products within a specific category.
 *
 * Rendering Strategy: Incremental Static Regeneration (ISR).
 * - Category details are fetched with a long revalidation period (1 day).
 * - The list of products within the category is fetched with a shorter revalidation
 *   period (1 hour), as product availability or details might change more often.
 * - If the category ID is not found, it triggers the `not-found.tsx` page.
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  // Fetch category details and products in parallel for efficiency.
  const category = await apiClient.getCategoryById(params.categoryId);

  // If the category doesn't exist, render the 404 page.
  if (!category) {
    notFound();
  }

  const products = (await apiClient.getProductsByCategorySlug(category.slug)) || [];

  return (
    <PageLayout>
      <PageHeader title={category.name} description={category.description} />
      <ProductGrid products={products} />
    </PageLayout>
  );
}
