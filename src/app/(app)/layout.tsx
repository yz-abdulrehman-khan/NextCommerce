'use client'; // This layout now needs to be a client component to use context providers

import type React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartProvider } from '@/context/cart-context'; // Import CartProvider

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-grow container mx-auto px-4 py-8'>{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
