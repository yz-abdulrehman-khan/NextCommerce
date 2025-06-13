import type { Category } from '@/types/app';
import { CategoryCard } from '@/components/category/category-card';
import { PackageSearch } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className='text-center py-10'>
        <PackageSearch className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
        <p className='text-xl text-muted-foreground'>No categories found.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
