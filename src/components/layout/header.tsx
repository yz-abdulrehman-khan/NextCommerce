import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className='flex items-center justify-between p-4 border-b bg-background'>
      <nav>
        <ul className='flex items-center gap-6 text-sm font-medium'>
          <li>
            <Link href='/products' className='text-muted-foreground hover:text-foreground transition-colors'>
              Products
            </Link>
          </li>
          <li>
            <Link href='/categories' className='text-muted-foreground hover:text-foreground transition-colors'>
              Categories
            </Link>
          </li>
          <li>
            <Link href='/orders' className='text-muted-foreground hover:text-foreground transition-colors'>
              Orders
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <Button variant='ghost' size='icon' asChild>
          <Link href='/cart'>
            <ShoppingBag className='h-5 w-5' />
            <span className='sr-only'>View Cart</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
