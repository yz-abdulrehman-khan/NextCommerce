'use client';

import { useEffect } from 'react';
import { ErrorMessage } from '@/components/common/error-message';
import { PageLayout } from '@/components/common/page-layout';

/**
 * This is the global error boundary for the application.
 * It catches unhandled errors in child components (including pages) and displays
 * a user-friendly error message with an option to retry the action.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <PageLayout>
      <ErrorMessage
        title='Something went wrong!'
        message={error.message || 'An unexpected error occurred. Please try again.'}
        onRetry={reset}
        fullPage={false}
      />
    </PageLayout>
  );
}
