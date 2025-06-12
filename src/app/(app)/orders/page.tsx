'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Order, LineItem } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertCircle, ShoppingBag, History, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formatPrice = (price: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

const formatDate = (dateString?: Date | string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatShortId = (id: string): string => {
  if (!id || typeof id !== 'string') return id;
  const parts = id.split('-');
  return parts[parts.length - 1].toUpperCase();
};

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
  COMPLETED: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
};

const ITEMS_PREVIEW_COUNT = 2;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [expandedOrderItems, setExpandedOrderItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/orders');
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to fetch orders.');
        }
        const sortedOrders = result.data.sort(
          (a: Order, b: Order) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime(),
        );
        setOrders(sortedOrders);
      } catch (err) {
        const errorMessage = (err as Error).message || 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Error Fetching Orders',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const toggleShowAllItems = (orderId: string) => {
    setExpandedOrderItems(prev => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const renderOrderItems = (items: LineItem[], orderId: string) => {
    const isExpanded = expandedOrderItems[orderId];
    const itemsToShow = isExpanded ? items : items.slice(0, ITEMS_PREVIEW_COUNT);

    return (
      <>
        {itemsToShow.map(item => (
          <div key={item.id} className='flex items-center justify-between gap-4 py-1'>
            {' '}
            {/* Reduced py-1 from py-2 */}
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
        {items.length > ITEMS_PREVIEW_COUNT && (
          <Button
            variant='link'
            size='sm'
            className='w-full mt-2 text-primary hover:text-primary/80 px-0' // Added px-0 to align with items
            onClick={() => toggleShowAllItems(orderId)}
          >
            {isExpanded ? (
              <>
                Show fewer items <ChevronUp className='ml-2 h-4 w-4' />
              </>
            ) : (
              <>
                Show {items.length - ITEMS_PREVIEW_COUNT} more item(s) <ChevronDown className='ml-2 h-4 w-4' />
              </>
            )}
          </Button>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className='container py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]'>
        <Loader2 className='w-12 h-12 text-primary animate-spin mb-4' />
        <p className='text-lg text-muted-foreground'>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container py-8 md:py-12 text-center'>
        <AlertCircle className='mx-auto h-16 w-16 text-destructive mb-6' />
        <h1 className='text-3xl font-semibold mb-4'>Failed to Load Orders</h1>
        <p className='text-muted-foreground mb-8'>{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className='container py-12 text-center'>
        <ShoppingBag className='mx-auto h-16 w-16 text-muted-foreground mb-6' />
        <h1 className='text-3xl font-semibold mb-4'>No Orders Yet</h1>
        <p className='text-muted-foreground mb-8'>You haven't placed any orders. Start shopping to see them here!</p>
        <Button asChild size='lg'>
          <Link href='/products'>Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container py-8 md:py-12'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3'>
          <History className='h-8 w-8 text-primary' />
          My Orders
        </h1>
      </div>

      <div className='space-y-6'>
        {orders.map(order => (
          <Card key={order.id} className='overflow-hidden'>
            <CardHeader className='bg-muted/30 p-4 sm:px-6 sm:py-4 pb-2 sm:pb-2'>
              {' '}
              {/* Reduced bottom padding */}
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                <div>
                  <CardTitle className='text-lg sm:text-xl'>
                    Order #<span className='font-mono'>{formatShortId(order.id)}</span>
                  </CardTitle>
                  <CardDescription>Placed on {formatDate(order.timestamp)}</CardDescription>
                </div>
                <Badge
                  variant={getStatusVariant(order.status)}
                  className={cn('px-3 py-1 text-xs sm:text-sm', statusStyles[order.status])}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='p-4 sm:px-6 sm:py-4 pt-2 sm:pt-3'>
              {' '}
              {/* Reduced top padding */}
              <div className='grid gap-3'>
                {' '}
                {/* Increased gap from gap-2 to gap-3 for more space between items */}
                {renderOrderItems(order.cart.items, order.id)}
              </div>
            </CardContent>
            <Separator />
            <CardFooter className='bg-muted/30 p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='text-base sm:text-lg font-semibold'>
                Order Total: {formatPrice(order.cart.total.amount, order.cart.total.currency)}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
