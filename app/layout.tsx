import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/contexts/SidebarContext';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '600'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'crtv.space',
  description: 'crtv.space',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} dark`}>
      <body className="font-sans tracking-tight bg-[#121212] text-[#F3F4F6] antialiased overflow-hidden" suppressHydrationWarning>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
