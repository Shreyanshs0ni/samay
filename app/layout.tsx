import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Outfit, Montserrat } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidevbar';
import { Topbar } from '@/components/layout/Topbar';
import { QueryProvider } from '@/components/providers/QueryProvider';

const montserratHeading = Montserrat({ subsets: ['latin'], variable: '--font-heading' });

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserratHeading.variable} ${outfit.variable} dark`}>
      <body className="bg-background text-white">
        <ClerkProvider>
          <QueryProvider>
            <div className="flex h-screen">
              <aside className="w-64 border-r border-white/10 p-4">
                <Sidebar />
              </aside>

              <div className="flex flex-col flex-1">
                <header className="h-14 border-b border-white/10 flex items-center px-4">
                  <Topbar />
                </header>
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
              </div>
            </div>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
