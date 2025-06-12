'use client';

import React from 'react';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, ShoppingCart, CreditCard, Home } from 'lucide-react';

// Helper function for formatting price
const formatPrice = (price: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export default function CheckoutPage() {
  const { cartItems, getCartSubtotal, getTotalItems, isCartLoaded } = useCart();

  const subtotal = getCartSubtotal();
  const totalItems = getTotalItems();

  // For UI purposes, let's assume fixed shipping and tax or placeholder values
  const shippingCost = totalItems > 0 ? 5.99 : 0;
  const taxRate = 0.07; // Example 7% tax rate
  const taxes = subtotal * taxRate;
  const grandTotal = subtotal + shippingCost + taxes;

  if (!isCartLoaded) {
    return (
      <div className='container py-8 md:py-12 flex justify-center items-center min-h-[calc(100vh-200px)]'>
        {/* Basic loading spinner or text */}
        <div className='flex flex-col items-center gap-2'>
          <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
          <p className='text-muted-foreground'>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && isCartLoaded) {
    return (
      <div className='container py-12 text-center'>
        <ShoppingCart className='mx-auto h-16 w-16 text-muted-foreground mb-6' />
        <h1 className='text-3xl font-semibold mb-4'>Your Cart is Empty</h1>
        <p className='text-muted-foreground mb-8'>
          You have no items in your cart to checkout. Add some products to get started!
        </p>
        <Button asChild size='lg'>
          <Link href='/products'>Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container py-8 md:py-12'>
      <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center md:text-left'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12'>
        {/* Left Column: Shipping and Payment Information */}
        <div className='lg:col-span-2 space-y-8'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl flex items-center gap-2'>
                <Home className='h-6 w-6 text-primary' />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='fullName'>Full Name</Label>
                  <Input id='fullName' placeholder='John Doe' />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input id='email' type='email' placeholder='john.doe@example.com' />
                </div>
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='address'>Street Address</Label>
                <Input id='address' placeholder='123 Main St' />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='apartment'>Apartment, suite, etc. (Optional)</Label>
                <Input id='apartment' placeholder='Apt 4B' />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='city'>City</Label>
                  <Input id='city' placeholder='Anytown' />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='state'>State / Province</Label>
                  <Input id='state' placeholder='CA' />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='zip'>ZIP / Postal Code</Label>
                  <Input id='zip' placeholder='90210' />
                </div>
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='country'>Country</Label>
                <Input id='country' placeholder='United States' />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='phone'>Phone Number (Optional)</Label>
                <Input id='phone' type='tel' placeholder='(555) 123-4567' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-2xl flex items-center gap-2'>
                <CreditCard className='h-6 w-6 text-primary' />
                Payment Details
              </CardTitle>
              <CardDescription>Please enter your payment information. All fields are required.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-1.5'>
                <Label htmlFor='cardNumber'>Card Number</Label>
                <Input id='cardNumber' placeholder='•••• •••• •••• ••••' />
              </div>
              <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='expiryDate'>Expiry Date</Label>
                  <Input id='expiryDate' placeholder='MM / YY' />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='cvc'>CVC</Label>
                  <Input id='cvc' placeholder='•••' />
                </div>
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='cardName'>Name on Card</Label>
                <Input id='cardName' placeholder='John M Doe' />
              </div>
              <div className='mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-700 flex items-start gap-2'>
                <AlertTriangle className='h-5 w-5 flex-shrink-0 mt-0.5' />
                <span>
                  This is a UI demonstration only. Actual payment processing is not implemented. Do not enter real card details.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
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
              <Button
                className='w-full'
                size='lg'
                // onClick will be added in the next step for actual submission logic
              >
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
