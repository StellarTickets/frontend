import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const DESCRIPTION =
  'Issue, manage, verify, transfer, and resell blockchain-powered tickets on the Stellar network — for concerts, flights, sports, festivals, conferences, and more.';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'StellarTickets — Secure. Verifiable. Powered by Stellar.',
    template: '%s · StellarTickets',
  },
  description: DESCRIPTION,
  openGraph: {
    title: 'StellarTickets — Secure. Verifiable. Powered by Stellar.',
    description: DESCRIPTION,
    siteName: 'StellarTickets',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StellarTickets — Secure. Verifiable. Powered by Stellar.',
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
