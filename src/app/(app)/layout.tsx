'use client';

import type React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className='relative flex min-h-screen flex-col'>
        <Header />
        {/* main element now wraps PageLayout in individual pages for better semantic structure */}
        <main className='flex-1'>{children}</main>
        <Footer />
        <Toaster />
      </div>
    </CartProvider>
  );
}
