import { apiClient } from '@/lib/api-client';
import { PageLayout } from '@/components/common/page-layout';
import { PageHeader } from '@/components/common/page-header';
import { CategoryGrid } from '@/components/category/category-grid';

/**
 * This page displays a list of all product categories.
 *
 * Rendering Strategy: Incremental Static Regeneration (ISR).
 * - Categories change infrequently, so we use a long revalidation period (1 day).
 * - This makes the page very fast, serving from cache, while still allowing for
 *   occasional updates without needing a full site rebuild.
 */
export default async function CategoriesPage() {
  const categories = await apiClient.getCategories();

  return (
    <PageLayout>
      <PageHeader title='Product Categories' description='Explore products by browsing our categories.' />
      <CategoryGrid categories={categories || []} />
    </PageLayout>
  );
}
