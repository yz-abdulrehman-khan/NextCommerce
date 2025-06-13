'use client';

import React from 'react';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface OrderSummaryProps {
  isSubmitting: boolean;
}

export function OrderSummary({ isSubmitting }: OrderSummaryProps) {
  const { cartItems, getCartSubtotal, getTotalItems } = useCart();

  const subtotal = getCartSubtotal();
  const totalItems = getTotalItems();
  const shippingCost = totalItems > 0 ? 5.99 : 0;
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;
  const grandTotal = subtotal + shippingCost + taxes;

  return (
    <div className='lg:col-span-1'>
      <Card className='sticky top-24'>
        <CardHeader>
          <CardTitle className='text-2xl'>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <ScrollArea className='h-[250px] pr-3 -mr-3'>
            {cartItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className='flex items-center gap-4 py-3'>
                  <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border'>
                    <Image
                      src={item.images[0] || '/placeholder.svg?width=64&height=64&query=cart+item'}
                      alt={item.name}
                      fill
                      sizes='(max-width: 768px) 10vw, 5vw'
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{item.name}</p>
                    <p className='text-xs text-muted-foreground'>Qty: {item.quantity}</p>
                  </div>
                  <p className='text-sm font-medium shrink-0'>
                    {formatPrice(item.price.amount * item.quantity, item.price.currency)}
                  </p>
                </div>
                {index < cartItems.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </ScrollArea>
          <Separator />
          <div className='space-y-1.5 text-sm'>
            <div className='flex justify-between'>
              <p className='text-muted-foreground'>
                Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </p>
              <p className='font-medium'>{formatPrice(subtotal)}</p>
            </div>
            <div className='flex justify-between'>
              <p className='text-muted-foreground'>Shipping</p>
              <p className='font-medium'>{shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}</p>
            </div>
            <div className='flex justify-between'>
              <p className='text-muted-foreground'>Taxes (Est.)</p>
              <p className='font-medium'>{formatPrice(taxes)}</p>
            </div>
          </div>
          <Separator />
          <div className='flex justify-between text-lg font-semibold'>
            <p>Order Total</p>
            <p>{formatPrice(grandTotal)}</p>
          </div>
        </CardContent>
        <CardFooter>
          {/* This button is part of the CheckoutForm, but placed here for layout purposes on desktop */}
          <Button
            type='submit'
            form='checkout-form' // Associate with the form
            className='w-full hidden lg:inline-flex'
            size='lg'
            disabled={isSubmitting || cartItems.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Placing Order...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
