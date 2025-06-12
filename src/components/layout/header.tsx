'use client';

import Link from 'next/link';
import { Menu, Store } from 'lucide-react'; // Using Store icon for a logo-like element
import { CartSheet } from '@/components/cart/cart-sheet';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/orders', label: 'Orders' },
];

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between px-4 md:px-6'>
        {/* === Left Group: Logo & Desktop Navigation === */}
        <div className='hidden items-center gap-6 md:flex'>
          <Link href='/' className='flex items-center gap-2'>
            <Store className='h-6 w-6' />
            <span className='font-bold'>E-Store</span>
          </Link>
          <nav className='flex items-center gap-4 text-sm font-medium'>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className='text-muted-foreground transition-colors hover:text-foreground'>
                {link.label}
              </Link>
            ))}
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
            <SheetContent side='left' className='w-[300px]'>
              <div className='flex flex-col p-4'>
                <Link href='/' className='mb-6 flex items-center gap-2'>
                  <Store className='h-6 w-6' />
                  <span className='font-bold'>E-Store</span>
                </Link>
                <nav className='flex flex-col gap-4'>
                  {navLinks.map(link => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className='py-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground'
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
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
