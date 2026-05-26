import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/provider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: 'Vizag Vegetables — Fresh from Rythu Bazar',
  description: 'Order fresh vegetables online. Rythu Bazar prices updated daily. Delivered across Visakhapatnam.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${dmSans.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
