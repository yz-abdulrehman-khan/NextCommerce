'use client';

import type React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
    }).format(price.amount);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation if button is inside a link wrapper
    addToCart(product);
    toast({
      title: (
        <div className='flex items-center gap-2'>
          <CheckCircle2 className='h-5 w-5 text-green-500' />
          <span className='font-bold'>Added to Cart</span>
        </div>
      ),
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  return (
    <Card className='flex flex-col overflow-hidden h-full group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2'>
      <CardHeader className='p-0 relative aspect-square overflow-hidden'>
        <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`} className='focus:outline-none'>
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
        <Link
          href={`/products/${product.id}`}
          className='hover:underline focus:outline-none focus:text-primary group-hover:text-primary transition-colors'
        >
          <CardTitle className='text-lg font-semibold leading-tight mb-1'>{product.name}</CardTitle>
        </Link>
        <p className='text-primary font-medium text-base'>{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button onClick={handleAddToCart} className='w-full' aria-live='polite'>
          <ShoppingCart className='mr-2 h-4 w-4' /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
