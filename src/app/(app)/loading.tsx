import { LoadingState } from '@/components/common/loading-state';

/**
 * This is the global loading UI for the application, powered by Next.js Suspense.
 * It automatically wraps pages and layouts, showing this component during route
 * transitions and while server components are fetching data.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
 */
export default function Loading() {
  return <LoadingState message='Loading page...' fullPage />;
}
