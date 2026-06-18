import type { Metadata } from 'next';
import { Poppins, Instrument_Serif, Noto_Sans_Telugu } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/provider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  weight: ['400', '500', '600'],
  variable: '--font-telugu',
});

export const metadata: Metadata = {
  title: 'YZAG Fresh — Local. Fresh. Connected.',
  description: 'Order fresh vegetables online. Rythu Bazar prices updated daily. Delivered across Visakhapatnam.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${poppins.variable} ${instrumentSerif.variable} ${notoSansTelugu.variable}`}>
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
