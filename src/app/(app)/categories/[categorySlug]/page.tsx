import type { Category, Product } from '@/types/app';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, PackageSearch } from 'lucide-react';

interface CategorySlugPageProps {
  params: {
    categorySlug: string; // Changed from categoryId
  };
}

// Fetches ALL categories and then filters by slug
async function getCategoryDetailsBySlug(slug: string): Promise<Category | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`; // Fetch all categories
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch all categories, status:`, res.status);
      return null;
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !Array.isArray(jsonResponse.data)) {
      console.error(`Failed to fetch all categories, invalid response:`, jsonResponse);
      return null;
    }
    const allCategories: Category[] = jsonResponse.data;
    const foundCategory = allCategories.find(cat => cat.slug === slug);
    return foundCategory || null;
  } catch (error) {
    console.error(`Error fetching categories from ${apiUrl}:`, error);
    return null;
  }
}

async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${categorySlug}`;
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch products for category ${categorySlug}, status:`, res.status);
      return [];
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !Array.isArray(jsonResponse.data)) {
      console.error(`Failed to fetch products for category ${categorySlug}, invalid response:`, jsonResponse);
      return [];
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug} from ${apiUrl}:`, error);
    return [];
  }
}

// Renamed component for clarity, e.g., CategoryBySlugPage or similar
export default async function CategorySlugPage({ params }: CategorySlugPageProps) {
  const category = await getCategoryDetailsBySlug(params.categorySlug);

  if (!category) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <AlertTriangle className='mx-auto h-12 w-12 text-destructive mb-4' />
        <h1 className='text-2xl font-semibold mb-4'>Category Not Found</h1>
        <p className='text-muted-foreground mb-6'>Sorry, we couldn't find the category for slug: "{params.categorySlug}".</p>
        <Button asChild>
          <Link href='/categories'>Back to Categories</Link>
        </Button>
      </div>
    );
  }

  const products = await getProductsByCategory(category.slug); // category.slug will be params.categorySlug

  return (
    <div className='container mx-auto px-4 py-8'>
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
