'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatPrice = (price: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export function CartSheet() {
  const { cartItems, removeFromCart, updateQuantity, getCartSubtotal, getTotalItems, isCartLoaded } = useCart();

  const subtotal = getCartSubtotal();
  const totalItems = getTotalItems();

  const cartIconSize = 'h-6 w-6';

  const triggerButtonClasses = cn(
    'relative',
    'text-brand-secondary-foreground hover:bg-white/10', // Always use this style assuming dark header
  );

  if (!isCartLoaded) {
    return (
      <Button variant='ghost' size='icon' disabled className={triggerButtonClasses}>
        <ShoppingBag className={cartIconSize} />
        <span className='sr-only'>View Cart (Loading...)</span>
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className={triggerButtonClasses}>
          <ShoppingBag className={cartIconSize} />
          {totalItems > 0 && (
            <span className='absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
              {totalItems}
            </span>
          )}
          <span className='sr-only'>View Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className='flex h-full w-full flex-col p-0 sm:max-w-lg'>
        <SheetHeader className='border-b p-4 sm:p-6'>
          <SheetTitle className='text-lg font-medium'>
            Shopping Cart{' '}
            <span aria-live='polite' aria-atomic='true'>
              ({totalItems})
            </span>
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center'>
            <ShoppingBag className='h-20 w-20 text-muted-foreground' />
            <p className='text-xl font-medium text-muted-foreground'>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <ScrollArea className='flex-1 min-h-0'>
              <div className='flex flex-col gap-0 p-4 sm:p-6'>
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className='flex items-start gap-4 py-4'>
                      <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border'>
                        <Image
                          src={item.images[0] || '/placeholder.svg?width=80&height=80&query=cart+item'}
                          alt={item.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <Link
                          href={`/products/${item.id}`}
                          className='text-sm font-medium hover:underline hover:text-primary block truncate'
                        >
                          {item.name}
                        </Link>
                        <p className='text-xs text-muted-foreground'>{formatPrice(item.price.amount, item.price.currency)}</p>
                        <div className='mt-2 flex items-center gap-2'>
                          <Input
                            type='number'
                            min='1'
                            value={item.quantity}
                            onChange={e => updateQuantity(item.id, Number.parseInt(e.target.value, 10) || 1)}
                            className='h-8 w-16 text-center'
                            aria-label={`Quantity for ${item.name}`}
                          />
                        </div>
                      </div>
                      <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                        <p className='text-sm font-medium text-right min-w-0 break-words'>
                          {formatPrice(item.price.amount * item.quantity, item.price.currency)}
                        </p>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground hover:text-destructive'
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className='flex-col gap-4 border-t bg-background p-4 sm:p-6'>
              <div className='flex items-center justify-between gap-4'>
                <p className='text-sm text-muted-foreground flex-shrink-0'>Subtotal</p>
                <p className='text-lg font-semibold text-right flex-1 min-w-0 break-words'>
                  <span aria-live='polite' aria-atomic='true'>
                    {formatPrice(subtotal)}
                  </span>
                </p>
              </div>
              <SheetClose asChild>
                <Button asChild className='w-full'>
                  <Link href='/checkout'>Proceed to Checkout</Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
