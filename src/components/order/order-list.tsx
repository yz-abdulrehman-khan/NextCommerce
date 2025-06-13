'use client';

import { useEffect, useState } from 'react';
import type { Order } from '@/types/app';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorMessage } from '@/components/common/error-message';
import { OrderItem } from '@/components/order/order-item';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedOrders = await apiClient.getOrders();
      if (fetchedOrders === null) {
        setOrders([]);
      } else {
        const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());
        setOrders(sortedOrders);
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'An unexpected error occurred while fetching orders.';
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

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    // Use LoadingState instead of skeletons
    return <LoadingState message='Loading your orders...' fullPage={false} />;
  }

  if (error) {
    return <ErrorMessage title='Failed to Load Orders' message={error} onRetry={fetchOrders} fullPage={false} />;
  }

  if (orders.length === 0) {
    return (
      <div className='text-center py-10'>
        <ShoppingBag className='mx-auto h-16 w-16 text-muted-foreground mb-6' />
        <h2 className='text-2xl font-semibold mb-2'>No Orders Yet</h2>
        <p className='text-muted-foreground mb-6'>You haven't placed any orders. Start shopping to see them here!</p>
        <Button asChild size='lg'>
          <Link href='/'>Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {orders.map(order => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
}
