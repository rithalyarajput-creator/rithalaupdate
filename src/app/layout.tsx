import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getAllSettings } from '@/lib/db';
import PWAInstall from '@/components/PWAInstall';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f63a3a',
};

export async function generateMetadata(): Promise<Metadata> {
  let settings: Record<string, string> = {};
  try {
    settings = (await getAllSettings()) as Record<string, string>;
  } catch {}

  const siteTitle = settings.seo_default_title || settings.site_title || 'Rithala Update — Rajput Heritage, Temples, Festivals';
  const siteDesc = settings.seo_default_description || settings.site_description || 'Rithala Update — Bhakti Reels, Rajput Culture & Temple Moments from Rithala Village, Delhi.';
  const ogImage = settings.seo_default_og_image || undefined;
  const verification = settings.seo_google_verification;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${settings.site_title || 'Rithala Update'}`,
    },
    description: siteDesc,
    applicationName: settings.site_title || 'Rithala Update',
    keywords: ['Rithala', 'Rithala Village', 'Rajput', 'रिठाला गाँव', 'Delhi', 'Kawad Yatra', 'Bhakti Reels', 'Temple', 'Heritage'],
    authors: [{ name: 'Sandeep Rajput' }],
    creator: 'Sandeep Rajput',
    publisher: 'Rithala Update',
    alternates: {
      canonical: '/',
      types: { 'application/rss+xml': '/rss.xml' },
    },
    openGraph: {
      type: 'website',
      locale: 'hi_IN',
      siteName: settings.site_title || 'Rithala Update',
      url: SITE_URL,
      title: siteTitle,
      description: siteDesc,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDesc,
      images: ogImage ? [ogImage] : undefined,
    },
    icons: {
      icon: settings.site_favicon_url || '/favicon.png',
      apple: settings.site_logo_url || '/logo.png',
    },
    manifest: '/manifest.json',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    verification: verification ? { google: verification } : undefined,
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let gaId = '';
  let settings: Record<string, string> = {};
  try {
    settings = (await getAllSettings()) as Record<string, string>;
    gaId = settings.seo_ga_id || '';
  } catch {}

  // JSON-LD structured data for organization (rich snippets)
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.site_title || 'Rithala Update',
    url: SITE_URL,
    logo: settings.site_logo_url ? `${SITE_URL}${settings.site_logo_url.startsWith('http') ? '' : ''}${settings.site_logo_url}` : `${SITE_URL}/logo.png`,
    description: settings.seo_default_description || 'Rajput Heritage, Temples, Festivals from Rithala Village, Delhi',
    address: settings.contact_address ? {
      '@type': 'PostalAddress',
      streetAddress: settings.contact_address,
      addressLocality: 'Delhi',
      addressCountry: 'IN',
    } : undefined,
    contactPoint: settings.contact_email ? {
      '@type': 'ContactPoint',
      email: settings.contact_email,
      telephone: settings.contact_phone || undefined,
      contactType: 'customer support',
    } : undefined,
    sameAs: [
      settings.social_instagram,
      settings.social_youtube,
      settings.social_facebook,
      settings.social_pinterest,
    ].filter(Boolean),
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.site_title || 'Rithala Update',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="hi">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rithala" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        {children}
        <PWAInstall />
      </body>
    </html>
  );
}
