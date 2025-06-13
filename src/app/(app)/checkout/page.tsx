'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { PageLayout } from '@/components/common/page-layout';
import { PageHeader } from '@/components/common/page-header';
import { CheckoutForm, type CheckoutFormData } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { LoadingState } from '@/components/common/loading-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * This page handles the checkout process.
 *
 * Rendering Strategy: Client-Side Rendering (CSR).
 * - The entire checkout flow is interactive and depends on client-side state
 *   (cart context, form inputs).
 * - Data is submitted via a client-side API call. SEO is not a concern.
 * - The page shows a loading state while waiting for the cart to be hydrated
 *   from local storage.
 */
export default function CheckoutPage() {
  const { cartItems, isCartLoaded, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckoutSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const orderPayload = cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const newOrder = await apiClient.checkout(orderPayload);

      toast({
        title: (
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-green-500' />
            <span className='font-bold'>Order Placed Successfully!</span>
          </div>
        ),
        description: `Your order #${newOrder.id.substring(0, 8)} has been confirmed.`,
      });

      clearCart();
      router.push(`/orders?order_id=${newOrder.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: (
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5' />
            <span className='font-bold'>Order Failed</span>
          </div>
        ),
        description: (error as Error).message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartLoaded) {
    return <LoadingState message='Loading checkout...' fullPage />;
  }

  if (cartItems.length === 0) {
    return (
      <PageLayout className='text-center'>
        <ShoppingCart className='mx-auto h-16 w-16 text-muted-foreground mb-6' />
        <PageHeader title='Your Cart is Empty' description='Add some products to your cart to proceed to checkout.' />
        <Button asChild size='lg' className='mt-6'>
          <Link href='/'>Continue Shopping</Link>
        </Button>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader title='Checkout' />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12'>
        <CheckoutForm isSubmitting={isSubmitting} onSubmit={handleCheckoutSubmit} />
        <OrderSummary isSubmitting={isSubmitting} />
      </div>
    </PageLayout>
  );
}
