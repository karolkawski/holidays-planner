import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { NextUIProvider } from '@nextui-org/react';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <NextUIProvider>
          <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-white text-lg font-bold">Holiday scraper</div>
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Scraper
                </Link>
                <Link href="/history" className="text-gray-300 hover:text-white transition">
                  History
                </Link>
              </div>
            </div>
          </nav>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
