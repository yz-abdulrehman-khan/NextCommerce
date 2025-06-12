import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
    }).format(price.amount);
  };

  return (
    <Card className='flex flex-col overflow-hidden h-full group'>
      <CardHeader className='p-0 relative aspect-square overflow-hidden'>
        <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
          <Image
            src={product.images[0] || '/placeholder.svg?width=400&height=400&query=product+image'}
            alt={product.name}
            width={400}
            height={400}
            className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out'
          />
        </Link>
      </CardHeader>
      <CardContent className='p-4 flex-grow'>
        <Link href={`/products/${product.id}`} className='hover:underline'>
          <CardTitle className='text-lg font-semibold leading-tight mb-1 group-hover:text-primary transition-colors'>
            {product.name}
          </CardTitle>
        </Link>
        <p className='text-primary font-medium text-base'>{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className='p-4 pt-0 flex flex-col sm:flex-row gap-2'>
        <Button asChild variant='outline' className='w-full sm:w-auto flex-grow'>
          <Link href={`/products/${product.id}`}>
            <Eye className='mr-2 h-4 w-4' /> View Details
          </Link>
        </Button>
        <Button className='w-full sm:w-auto flex-grow'>
          <ShoppingCart className='mr-2 h-4 w-4' /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
