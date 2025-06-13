import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/common/page-layout';
import { AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';

/**
 * This is the not-found page for the application.
 * It is automatically rendered by Next.js when a user navigates to a route
 * that does not exist.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/not-found
 */
export default function NotFound() {
  return (
    <PageLayout>
      <div className='text-center'>
        <AlertTriangle className='mx-auto h-16 w-16 text-primary mb-6' />
        <PageHeader title='404 - Page Not Found' description='Sorry, the page you are looking for does not exist.' />
        <Button asChild className='mt-6'>
          <Link href='/'>Go Back Home</Link>
        </Button>
      </div>
    </PageLayout>
  );
}
