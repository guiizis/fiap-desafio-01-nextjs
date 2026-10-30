import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppStoreProvider } from './dashboard/_state/store-provider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mcintosh Bank',
  description: 'Experimente mais liberdade no controle da sua vida financeira.',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppStoreProvider>
          {children}
          {modal}
        </AppStoreProvider>
      </body>
    </html>
  );
}
