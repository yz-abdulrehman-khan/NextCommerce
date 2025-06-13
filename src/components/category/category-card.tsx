import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types/app';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    // Link using category.id now
    <Link href={`/categories/${category.id}`} className='block group'>
      <Card className='overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1'>
        <CardHeader className='p-0 relative aspect-video'>
          <Image
            src={category.image || '/placeholder.svg?width=400&height=225&query=category+image'}
            alt={category.name}
            width={400}
            height={225}
            className='object-cover w-full h-full'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </CardHeader>
        <div className='p-4'>
          <CardTitle className='text-lg font-semibold text-center group-hover:text-primary transition-colors'>
            {category.name}
          </CardTitle>
        </div>
      </Card>
    </Link>
  );
}
