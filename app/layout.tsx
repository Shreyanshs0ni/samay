import Navbar from '@/components/layout/Navbar';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Outfit, Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';

const montserratHeading = Montserrat({ subsets: ['latin'], variable: '--font-heading' });

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
