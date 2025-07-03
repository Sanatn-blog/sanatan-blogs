import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'सनातन ब्लॉग्स - आध्यात्मिक ज्ञान और जीवन दर्शन',
  description: 'सनातन धर्म, योग, मेडिटेशन, और आध्यात्मिक ज्ञान पर बेहतरीन लेख पढ़ें। जीवन को बेहतर बनाने के लिए प्राचीन भारतीय दर्शन का अध्ययन करें।',
  keywords: 'सनातन धर्म, योग, मेडिटेशन, आध्यात्म, गीता, वेदांत, भारतीय दर्शन, हिंदू धर्म, आध्यात्मिक ज्ञान',
  authors: [{ name: 'सनातन ब्लॉग्स टीम' }],
  creator: 'सनातन ब्लॉग्स',
  publisher: 'सनातन ब्लॉग्स',
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
    locale: 'hi_IN',
    url: 'https://sanatan-blogs.com/blogs',
    siteName: 'सनातन ब्लॉग्स',
    title: 'सनातन ब्लॉग्स - आध्यात्मिक ज्ञान और जीवन दर्शन',
    description: 'प्राचीन भारतीय ज्ञान और आधुनिक जीवन को जोड़ने वाले गहरे लेख पढ़ें',
    images: [
      {
        url: '/og-blogs.jpg',
        width: 1200,
        height: 630,
        alt: 'सनातन ब्लॉग्स',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'सनातन ब्लॉग्स - आध्यात्मिक ज्ञान और जीवन दर्शन',
    description: 'प्राचीन भारतीय ज्ञान और आधुनिक जीवन को जोड़ने वाले गहरे लेख पढ़ें',
    images: ['/og-blogs.jpg'],
    creator: '@sanatanblogs',
  },
  alternates: {
    canonical: 'https://sanatan-blogs.com/blogs',
    languages: {
      'hi-IN': 'https://sanatan-blogs.com/blogs',
      'en-US': 'https://sanatan-blogs.com/en/blogs',
    },
  },
  category: 'spirituality',
}; 