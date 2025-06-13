// src/app/(app)/categories/page.tsx
// This page displays a list of all product categories.
// Strategy: Incremental Static Regeneration (ISR) with a long revalidation period.
// Categories typically change infrequently.
// Using ISR with a long revalidation (e.g., 1 day / 86400 seconds) ensures the page is
// fast (served from cache) and SEO-friendly, while still allowing for updates
// if categories are added/modified.
// If categories were guaranteed to only change at build time, pure SSG (default fetch cache) would be fine.

import { CategoryCard } from '@/components/category/category-card';
import type { Category } from '@/types/app';
import { PackageSearch } from 'lucide-react';
import { ErrorMessage } from '@/components/common/error-message';

async function getCategories(): Promise<Category[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 86400 } }); // ISR: Revalidate every 1 day
    if (!res.ok) {
      throw new Error(`Failed to fetch categories. Status: ${res.status}`);
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !Array.isArray(jsonResponse.data)) {
      throw new Error('Failed to fetch categories: Invalid API response.');
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching categories from ${apiUrl}:`, error);
    throw error;
  }
}

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let fetchError: Error | null = null;

  try {
    categories = await getCategories();
  } catch (error) {
    fetchError = error instanceof Error ? error : new Error('An unknown error occurred');
  }

  return (
    <div className='container'>
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>Product Categories</h1>
      </div>
      {fetchError ? (
        <ErrorMessage
          title='Could Not Load Categories'
          message={fetchError.message || 'An unexpected error occurred. Please try refreshing the page.'}
          fullPage={false}
        />
      ) : !categories || categories.length === 0 ? (
        <div className='text-center py-10'>
          <PackageSearch className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-xl text-muted-foreground'>No categories could be loaded at this time.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
