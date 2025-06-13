import type { Category, Product } from '@/types/app';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, PackageSearch } from 'lucide-react';

interface CategoryPageProps {
  params: {
    categoryId: string; // Changed from categorySlug to categoryId
  };
}

// Fetches category details by ID
async function getCategoryDetailsById(categoryId: string): Promise<Category | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}`;
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch category details for ID ${categoryId}, status:`, res.status);
      return null;
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !jsonResponse.data) {
      console.error(`Failed to fetch category details for ID ${categoryId}, invalid response:`, jsonResponse);
      return null;
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching category details for ID ${categoryId} from ${apiUrl}:`, error);
    return null;
  }
}

// Fetches products by category slug (since products are linked via slugs in the current model)
async function getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${categorySlug}`;
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch products for category slug ${categorySlug}, status:`, res.status);
      return [];
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !Array.isArray(jsonResponse.data)) {
      console.error(`Failed to fetch products for category slug ${categorySlug}, invalid response:`, jsonResponse);
      return [];
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching products for category slug ${categorySlug} from ${apiUrl}:`, error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Fetch category details using categoryId
  const category = await getCategoryDetailsById(params.categoryId);

  if (!category) {
    // Initial check if category itself couldn't be fetched
    // This case might be hit if the ID is invalid or API fails for category details
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

  // Fetch products using the slug from the fetched category details
  const products = await getProductsByCategorySlug(category.slug);

  return (
    <div className='container'>
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-2'>{category.name}</h1>
        {category.description && (
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0'>{category.description}</p>
        )}
      </div>

      {products.length > 0 ? (
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

// Optional: Add a loading.tsx file in the [categoryId] directory for better UX
// e.g., src/app/(app)/categories/[categoryId]/loading.tsx
/*
export default function Loading() {
  return (
    <div className="container py-10 text-center">
      <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-xl text-muted-foreground">Loading category products...</p>
    </div>
  );
}
*/
