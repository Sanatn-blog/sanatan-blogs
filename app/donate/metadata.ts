import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate - Contribute to Our Work | Sanatan Blogs',
  description: 'Support our mission to spread the wisdom of सनातन धर्म. Your contribution helps us create quality spiritual content and build a platform that connects millions to their roots.',
  keywords: [
    'donate',
    'contribution',
    'sanatan dharma',
    'spiritual support',
    'help',
    'funding',
    'dharmic values',
    'hindu philosophy',
    'spiritual platform',
    'support',
    'दान',
    'योगदान',
    'सनातन धर्म'
  ],
  authors: [{ name: 'Sanatan Blogs Team' }],
  creator: 'Sanatan Blogs',
  publisher: 'Sanatan Blogs',
  alternates: {
    canonical: '/donate'
  },
  openGraph: {
    title: 'Donate - Contribute to Our Work | Sanatan Blogs',
    description: 'Support our mission to spread the wisdom of सनातन धर्म. Your contribution helps us create quality spiritual content and build a platform that connects millions to their roots.',
    url: '/donate',
    siteName: 'Sanatan Blogs',
    images: [
      {
        url: '/og-donate.jpg',
        width: 1200,
        height: 630,
        alt: 'Donate to Sanatan Blogs - Contribute to Our Work'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donate - Contribute to Our Work | Sanatan Blogs',
    description: 'Support our mission to spread the wisdom of सनातन धर्म. Your contribution helps us create quality spiritual content.',
    images: ['/twitter-donate.jpg'],
    creator: '@sanatanblogs'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code'
  }
}; 