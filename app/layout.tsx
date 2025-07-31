import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import GoogleAnalytics from '@/components/GoogleAnalytics';

// Font configurations
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
});

// Global metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://sanatan-blogs.com'),
  title: {
    default: 'Sanatan Blogs - Spiritual Knowledge & Ancient Wisdom',
    template: '%s | Sanatan Blogs'
  },
  description: 'Discover profound articles on Sanatan Dharma, Yoga, Meditation, and spiritual wisdom. Explore ancient Indian philosophy and apply timeless teachings to modern life.',
  keywords: [
    'Sanatan Dharma', 
    'Hinduism', 
    'Yoga', 
    'Meditation', 
    'Spirituality', 
    'Bhagavad Gita', 
    'Vedanta', 
    'Indian Philosophy', 
    'Ancient Wisdom', 
    'Dharma', 
    'Karma', 
    'Moksha',
    'Vedas',
    'Upanishads',
    'Sanskrit',
    'Hindu Festivals',
    'Indian Culture',
    'Spiritual Growth',
    'Mindfulness',
    'Eastern Philosophy'
  ],
  authors: [{ name: 'Sanatan Blogs Team' }],
  creator: 'Sanatan Blogs',
  publisher: 'Sanatan Blogs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Spirituality',
  classification: 'Educational',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['hi_IN'],
    url: '/',
    siteName: 'Sanatan Blogs',
    title: 'Sanatan Blogs - Spiritual Knowledge & Ancient Wisdom',
    description: 'Discover profound articles on Sanatan Dharma, Yoga, Meditation, and spiritual wisdom. Connect ancient teachings with modern life.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sanatan Blogs - Ancient Wisdom for Modern Life',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sanatan_blogs',
    creator: '@sanatan_blogs',
    title: 'Sanatan Blogs - Spiritual Knowledge & Ancient Wisdom',
    description: 'Discover profound articles on Sanatan Dharma, Yoga, Meditation, and spiritual wisdom.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'hi-IN': '/hi',
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_VERIFICATION || '',
    },
  },
  other: {
    'theme-color': '#ea580c',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Sanatan Blogs',
    'mobile-web-app-capable': 'yes',
    'application-name': 'Sanatan Blogs',
    'msapplication-TileColor': '#ea580c',
    'msapplication-config': '/browserconfig.xml',
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ea580c' },
    { media: '(prefers-color-scheme: dark)', color: '#ea580c' },
  ],
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sanatan Blogs',
  description: 'A platform for sharing spiritual knowledge, ancient wisdom, and philosophical insights from Sanatan Dharma tradition.',
  url: process.env.NEXTAUTH_URL || 'https://sanatan-blogs.com',
  publisher: {
    '@type': 'Organization',
    name: 'Sanatan Blogs',
    description: 'Platform dedicated to sharing authentic spiritual knowledge and ancient wisdom',
    url: process.env.NEXTAUTH_URL || 'https://sanatan-blogs.com',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXTAUTH_URL || 'https://sanatan-blogs.com'}/logo.png`,
      width: 300,
      height: 300,
    },
    sameAs: [
      'https://twitter.com/sanatan_blogs',
      'https://facebook.com/sanatan_blogs',
      'https://instagram.com/sanatan_blogs',
      'https://youtube.com/@sanatan_blogs',
    ],
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXTAUTH_URL || 'https://sanatan-blogs.com'}/blogs?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  mainEntity: {
    '@type': 'Blog',
    name: 'Sanatan Blogs',
    description: 'Articles on Sanatan Dharma, Yoga, Meditation, and spiritual philosophy',
    url: `${process.env.NEXTAUTH_URL || 'https://sanatan-blogs.com'}/blogs`,
    author: {
      '@type': 'Organization',
      name: 'Sanatan Blogs Community',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sanatan Blogs',
    },
  },
  inLanguage: ['en-US', 'hi-IN'],
  audience: {
    '@type': 'Audience',
    audienceType: 'Spiritual seekers, yoga practitioners, philosophy students',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${notoSansDevanagari.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional SEO meta tags */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sanatan Blogs" />
        <meta name="application-name" content="Sanatan Blogs" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="theme-color" content="#ea580c" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900 font-inter">
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        
        <ClientLayout>
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </ClientLayout>
        
        {/* Google Analytics */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}