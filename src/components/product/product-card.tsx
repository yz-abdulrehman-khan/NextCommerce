'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
    }).format(price.amount);
  };

  const handleAddToCart = () => {
    addToCart(product);
    console.log(`${product.name} added to cart`);
  };

  return (
    <Card className='flex flex-col overflow-hidden h-full group transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1'>
      <CardHeader className='p-0 relative aspect-square overflow-hidden'>
        {/* Product image is a link to the product detail page */}
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
        {/* Product title is also a link to the product detail page */}
        <Link href={`/products/${product.id}`} className='hover:underline'>
          <CardTitle className='text-lg font-semibold leading-tight mb-1 group-hover:text-primary transition-colors'>
            {product.name}
          </CardTitle>
        </Link>
        <p className='text-primary font-medium text-base'>{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button onClick={handleAddToCart} className='w-full'>
          <ShoppingCart className='mr-2 h-4 w-4' /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
