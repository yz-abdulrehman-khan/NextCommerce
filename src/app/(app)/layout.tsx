import type React from 'react';
import { Header } from '@/components/layout/header';

// if any changes are needed fo app layout, they should be made here
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Added a wrapper div for flex column layout
    <div className='flex flex-col min-h-screen'>
      <Header /> {/* Added Header component */}
      <main className='flex-grow'>{children}</main> {/* Wrapped children in main and added flex-grow */}
    </div>
  );
}
