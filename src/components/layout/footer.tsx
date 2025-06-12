import Link from 'next/link';
import { Store, Twitter, Github, Facebook } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='border-t bg-background'>
      <div className='container py-8 md:py-12'>
        <div className='grid gap-8 md:grid-cols-4'>
          <div className='flex flex-col gap-2'>
            <Link href='/' className='flex items-center gap-2'>
              <Store className='h-6 w-6' />
              <span className='font-bold'>E-Store</span>
            </Link>
            <p className='text-sm text-muted-foreground'>Your one-stop shop for the best products online.</p>
          </div>
          <div className='grid gap-1'>
            <h3 className='font-semibold'>Shop</h3>
            <Link href='/products' className='text-sm text-muted-foreground hover:text-foreground'>
              All Products
            </Link>
            <Link href='/categories' className='text-sm text-muted-foreground hover:text-foreground'>
              Categories
            </Link>
          </div>
          <div className='grid gap-1'>
            <h3 className='font-semibold'>Company</h3>
            <Link href='#' className='text-sm text-muted-foreground hover:text-foreground'>
              About Us
            </Link>
            <Link href='#' className='text-sm text-muted-foreground hover:text-foreground'>
              Contact
            </Link>
          </div>
          <div className='grid gap-1'>
            <h3 className='font-semibold'>Support</h3>
            <Link href='#' className='text-sm text-muted-foreground hover:text-foreground'>
              FAQ
            </Link>
            <Link href='#' className='text-sm text-muted-foreground hover:text-foreground'>
              Shipping & Returns
            </Link>
          </div>
        </div>
        <div className='mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row'>
          <p className='text-sm text-muted-foreground'>&copy; {currentYear} E-Store Inc. All rights reserved.</p>
          <div className='flex items-center gap-4'>
            <Link href='#' aria-label='Twitter' className='text-muted-foreground hover:text-foreground'>
              <Twitter className='h-5 w-5' />
            </Link>
            <Link href='#' aria-label='GitHub' className='text-muted-foreground hover:text-foreground'>
              <Github className='h-5 w-5' />
            </Link>
            <Link href='#' aria-label='Facebook' className='text-muted-foreground hover:text-foreground'>
              <Facebook className='h-5 w-5' />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
