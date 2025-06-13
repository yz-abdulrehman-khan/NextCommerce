'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  fullPage?: boolean;
}

export function ErrorMessage({
  title = 'Something Went Wrong',
  message,
  onRetry,
  retryText = 'Try Again',
  className,
  fullPage = false,
}: ErrorMessageProps) {
  return (
    <div
      role='alert'
      aria-live='assertive'
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center',
        fullPage ? 'min-h-[calc(100vh-200px)] py-10' : 'py-10',
        className,
      )}
    >
      <AlertTriangle className='h-12 w-12 text-destructive' />
      <h2 className='text-2xl font-semibold text-destructive'>{title}</h2>
      <p className='max-w-md text-muted-foreground'>{message}</p>
      {onRetry && (
        <Button variant='destructive' onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  );
}
