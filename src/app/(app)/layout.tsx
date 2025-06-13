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
        <main className='flex-1 py-8 md:py-12'>{children}</main>
        <Footer />
        <Toaster />
      </div>
    </CartProvider>
  );
}
