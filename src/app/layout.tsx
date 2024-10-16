import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import { ReactQueryProvider } from './react-query-provider';
import { LocationProvider } from '@/context/LocationProvider';
import AuthProvider from '@/context/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Deer Tracker',
  description:
    'Deer tracker that is powered by AI to detect deer on the road as you drive.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs13', 'next13', 'pwa', 'next-pwa'],
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/icon-128x128.png' },
    { rel: 'icon', url: 'icons/icon-128x128.png' },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LocationProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
