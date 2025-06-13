import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  fullPage?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  className,
  iconClassName = 'h-8 w-8',
  textClassName = 'text-muted-foreground',
  fullPage = false,
}: LoadingStateProps) {
  return (
    <div
      role='status'
      aria-live='polite'
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center animate-fadeInUp',
        fullPage ? 'min-h-[calc(100vh-200px)] py-10' : 'py-10',
        className,
      )}
    >
      <Loader2 className={cn('animate-spin text-primary', iconClassName)} />
      {message && <p className={cn(textClassName)}>{message}</p>}
    </div>
  );
}
