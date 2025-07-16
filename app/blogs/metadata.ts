import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sanatan Blogs - Spiritual Knowledge and Life Philosophy',
  description: 'Read excellent articles on Sanatan Dharma, Yoga, Meditation, and spiritual knowledge. Study ancient Indian philosophy to improve your life.',
  keywords: ['Sanatan Dharma', 'Yoga', 'Meditation', 'Spirituality', 'Gita', 'Vedanta', 'Indian Philosophy'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sanatan Blogs - Spiritual Knowledge and Life Philosophy',
    description: 'Deep articles connecting ancient Indian knowledge with modern life',
    url: '/blogs',
    siteName: 'Sanatan Blogs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanatan Blogs - Spiritual Knowledge and Life Philosophy',
    description: 'Deep articles connecting ancient Indian knowledge with modern life',
  },
  alternates: {
    canonical: '/blogs',
  },
}; 