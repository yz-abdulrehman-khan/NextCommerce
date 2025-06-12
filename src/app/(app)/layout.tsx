'use client';

import type React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className='relative flex min-h-screen flex-col'>
        <Header />
        {/* The flex-1 class makes the main content area expand to fill available space */}
        <main className='flex-1 py-8 md:py-12'>{children}</main>
        <Footer />
        <Toaster /> {/* Add Toaster here */}
      </div>
    </CartProvider>
  );
}
