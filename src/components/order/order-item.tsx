'use client';

import { useState } from 'react';
import type { Order, LineItem } from '@/types/app';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate, formatPrice, formatShortId } from '~/src/lib/formatters';

interface OrderItemProps {
  order: Order;
}

const getStatusVariant = (status: Order['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'COMPLETED':
      return 'default';
    case 'PENDING':
      return 'secondary';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'outline';
  }
};

const statusStyles = {
  COMPLETED:
    'bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/50',
  PENDING:
    'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700 dark:hover:bg-yellow-900/50',
  CANCELLED:
    'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/50',
};

const ITEMS_PREVIEW_COUNT = 2;

export function OrderItem({ order }: OrderItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleIsExpanded = () => setIsExpanded(prev => !prev);

  const itemsToShow = isExpanded ? order.cart.items : order.cart.items.slice(0, ITEMS_PREVIEW_COUNT);

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='bg-muted/30 p-4 sm:px-6 sm:py-4 pb-2 sm:pb-2'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
          <div>
            <CardTitle className='text-lg sm:text-xl'>
              Order #<span className='font-mono'>{formatShortId(order.id)}</span>
            </CardTitle>
            <CardDescription>Placed on {formatDate(order.timestamp)}</CardDescription>
          </div>
          <Badge
            variant={getStatusVariant(order.status)}
            className={cn('px-3 py-1 text-xs sm:text-sm font-medium', statusStyles[order.status])}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='p-4 sm:px-6 sm:py-4 pt-2 sm:pt-3'>
        <div className='grid gap-3'>
          {itemsToShow.map((item: LineItem) => (
            <div key={item.id} className='flex items-center justify-between gap-4 py-1'>
              <div className='flex items-center gap-3 min-w-0'>
                <div className='w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground flex-shrink-0'>
                  <ShoppingBag size={20} />
                </div>
                <span className='text-sm text-muted-foreground truncate'>
                  Product ID: <span className='font-mono'>{formatShortId(item.referenceId)}</span> (x{item.quantity})
                </span>
              </div>
              <span className='text-sm font-medium'>
                {formatPrice(item.price.amount * (item.quantity || 1), item.price.currency)}
              </span>
            </div>
          ))}
          {order.cart.items.length > ITEMS_PREVIEW_COUNT && (
            <Button
              variant='link'
              size='sm'
              className='w-full mt-2 text-primary hover:text-primary/80 px-0'
              onClick={toggleIsExpanded}
            >
              {isExpanded ? (
                <>
                  Show fewer items <ChevronUp className='ml-2 h-4 w-4' />
                </>
              ) : (
                <>
                  Show {order.cart.items.length - ITEMS_PREVIEW_COUNT} more item(s) <ChevronDown className='ml-2 h-4 w-4' />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className='bg-muted/30 p-4 sm:px-6 sm:py-4 flex items-center justify-between gap-4'>
        <div className='text-base sm:text-lg font-semibold'>
          Order Total: {formatPrice(order.cart.total.amount, order.cart.total.currency)}
        </div>
      </CardFooter>
    </Card>
  );
}
