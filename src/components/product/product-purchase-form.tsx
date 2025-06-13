'use client';

import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types/app';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

interface ProductPurchaseFormProps {
  product: Product;
}

export function ProductPurchaseForm({ product }: ProductPurchaseFormProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: (
        <div className='flex items-center gap-2'>
          <CheckCircle2 className='h-5 w-5 text-green-500' />
          <span className='font-bold'>Added to Cart</span>
        </div>
      ),
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className='mt-auto pt-4'>
      <Button size='lg' className='w-full' onClick={handleAddToCart}>
        <ShoppingCart className='mr-2 h-5 w-5' /> Add to Cart
      </Button>
    </div>
  );
}
