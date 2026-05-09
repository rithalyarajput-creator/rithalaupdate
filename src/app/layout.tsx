import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rithala Update — Rajput Heritage, Temples, Festivals',
    template: '%s | Rithala Update',
  },
  description:
    'Rithala Update — Bhakti Reels, Rajput Culture & Temple Moments from Rithala Village, Delhi. Latest news, history, festivals, and gallery.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    siteName: 'Rithala Update',
    url: SITE_URL,
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.png' },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
