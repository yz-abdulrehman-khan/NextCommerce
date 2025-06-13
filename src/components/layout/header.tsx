'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { Menu, Store, LayoutGrid, Shapes, HistoryIcon } from 'lucide-react'; // Added icons
import { CartSheet } from '@/components/cart/cart-sheet';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils'; // Import cn utility

// Updated navLinks to include icons
const navLinks = [
  { href: '/', label: 'Products', icon: LayoutGrid },
  { href: '/categories', label: 'Categories', icon: Shapes },
  { href: '/orders', label: 'Orders', icon: HistoryIcon },
];

export function Header() {
  const pathname = usePathname(); // Get current pathname

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between px-4 md:px-6'>
        {/* === Left Group: Logo & Desktop Navigation === */}
        <div className='hidden items-center gap-6 md:flex'>
          <Link href='/' className='flex items-center gap-2'>
            <Store className='h-6 w-6' />
            <span className='font-bold'>E-Store</span>
          </Link>
          <nav className='flex items-center gap-4 text-sm'>
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-foreground hover:bg-muted/50',
                    isActive ? 'font-semibold text-foreground bg-muted/50' : 'text-muted-foreground',
                  )}
                >
                  <link.icon className={cn('h-4 w-4', isActive ? 'text-primary' : '')} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* === Mobile Menu Trigger (replaces the left group on mobile) === */}
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[300px] p-0'>
              <div className='flex h-full flex-col'>
                <div className='border-b p-4'>
                  <Link href='/' className='flex items-center gap-2'>
                    <Store className='h-6 w-6' />
                    <span className='text-lg font-bold'>E-Store</span>
                  </Link>
                </div>
                <nav className='flex flex-1 flex-col gap-1 p-4'>
                  {navLinks.map(link => {
                    const isActive = pathname === link.href;
                    return (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2.5 text-base transition-colors hover:text-foreground hover:bg-muted',
                            isActive ? 'font-semibold text-foreground bg-muted' : 'text-muted-foreground',
                          )}
                        >
                          <link.icon className={cn('h-5 w-5', isActive ? 'text-primary' : '')} />
                          {link.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* === Right Group: Cart Icon === */}
        <div className='flex items-center'>
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
