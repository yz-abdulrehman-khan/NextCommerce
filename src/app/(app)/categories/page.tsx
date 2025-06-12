import { CategoryCard } from '@/components/category/category-card';
import type { Category } from '@/types/app';
import { PackageSearch } from 'lucide-react'; // Icon for empty state

async function getCategories(): Promise<Category[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch categories, status:', res.status);
      return [];
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !Array.isArray(jsonResponse.data)) {
      console.error('Failed to fetch categories, invalid response:', jsonResponse);
      return [];
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching categories from ${apiUrl}:`, error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>Product Categories</h1>
      </div>
      {!categories || categories.length === 0 ? (
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
