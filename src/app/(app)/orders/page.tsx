'use client';

import { PageLayout } from '@/components/common/page-layout';
import { PageHeader } from '@/components/common/page-header';
import { OrderList } from '@/components/order/order-list';
import { History } from 'lucide-react';

/**
 * This page displays the user's order history.
 *
 * Rendering Strategy: Client-Side Rendering (CSR).
 * - Order data is user-specific and fetched on the client after the page loads.
 * - This is appropriate because the data is private and dynamic. SEO is not a concern.
 * - The page uses a client component (`OrderList`) to handle data fetching,
 *   loading, and error states.
 */
export default function OrdersPage() {
  return (
    <PageLayout>
      <div className='flex items-center gap-3 mb-8'>
        <History className='h-8 w-8 text-primary' />
        <PageHeader title='My Orders' />
      </div>
      <OrderList />
    </PageLayout>
  );
}
