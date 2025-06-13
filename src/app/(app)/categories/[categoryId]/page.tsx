// src/app/(app)/categories/[categoryId]/page.tsx
// This page displays products within a specific category.
// Strategy: Incremental Static Regeneration (ISR).
// - Category details: Fetched with a long revalidation period (1 day), as they change infrequently.
// - Products within the category: Fetched with a shorter revalidation period (1 hour),
//   similar to the main products page, as product availability or details might change more often.
// This provides a good balance of performance, SEO, and data freshness.

import type { Category, Product } from '@/types/app';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, PackageSearch } from 'lucide-react'; // Added ServerCrash for generic errors
import { ErrorMessage } from '@/components/common/error-message';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

// Fetches category details by ID
async function getCategoryDetailsById(categoryId: string): Promise<Category | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 86400 } }); // ISR: Revalidate category details every 1 day
    if (!res.ok) {
      if (res.status === 404) return null; // Explicitly handle 404 as "not found"
      throw new Error(`Failed to fetch category details for ID ${categoryId}. Status: ${res.status}`);
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !jsonResponse.data) {
      // If success is true but data is null, it's a valid "not found" from API
      if (jsonResponse.success && jsonResponse.data === null) return null;
      throw new Error(`Failed to fetch category details for ID ${categoryId}: Invalid API response.`);
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching category details for ID ${categoryId} from ${apiUrl}:`, error);
    throw error;
  }
}

// Fetches products by category slug
async function getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${categorySlug}`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } }); // ISR: Revalidate products in category every 1 hour
    if (!res.ok) {
      throw new Error(`Failed to fetch products for category slug ${categorySlug}. Status: ${res.status}`);
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !Array.isArray(jsonResponse.data)) {
      throw new Error(`Failed to fetch products for category slug ${categorySlug}: Invalid API response.`);
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching products for category slug ${categorySlug} from ${apiUrl}:`, error);
    throw error;
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let category: Category | null = null;
  let products: Product[] = [];
  let categoryError: Error | null = null;
  let productsError: Error | null = null;

  try {
    category = await getCategoryDetailsById(params.categoryId);
    if (category) {
      try {
        products = await getProductsByCategorySlug(category.slug);
      } catch (err) {
        productsError = err instanceof Error ? err : new Error('Failed to load products for this category.');
      }
    }
  } catch (err) {
    categoryError = err instanceof Error ? err : new Error('Failed to load category details.');
  }

  if (categoryError) {
    return <ErrorMessage title='Error Loading Category' message={categoryError.message} fullPage={false} />;
  }

  // If category fetch was successful but returned null (404)
  if (!category && !categoryError) {
    return (
      <div className='container py-10 text-center'>
        <AlertTriangle className='mx-auto h-12 w-12 text-destructive mb-4' />
        <h1 className='text-2xl font-semibold mb-4'>Category Not Found</h1>
        <p className='text-muted-foreground mb-6'>Sorry, we couldn't find the category with ID: "{params.categoryId}".</p>
        <Button asChild>
          <Link href='/categories'>Back to Categories</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-2'>{category.name}</h1>
        {category.description && (
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0'>{category.description}</p>
        )}
      </div>

      {productsError ? (
        <ErrorMessage title='Could Not Load Products' message={productsError.message} fullPage={false} />
      ) : products.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className='text-center py-10'>
          <PackageSearch className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-xl text-muted-foreground'>No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
