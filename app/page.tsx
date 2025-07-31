import type { Metadata } from 'next';
import HomePage from './HomePage';

// Enhanced metadata for the homepage
export const metadata: Metadata = {
  title: 'Sanatan Blogs - Ancient Wisdom for Modern Life | Spiritual Knowledge Platform',
  description: 'Discover profound articles on Sanatan Dharma, Yoga, Meditation, and spiritual wisdom. Join our community of seekers exploring ancient Indian philosophy and applying timeless teachings to modern life.',
  keywords: [
    'Sanatan Dharma',
    'Hindu philosophy',
    'spiritual blogs',
    'ancient wisdom',
    'yoga philosophy',
    'meditation techniques',
    'Bhagavad Gita',
    'Vedanta',
    'spiritual growth',
    'Indian spirituality',
    'dharma',
    'karma',
    'moksha',
    'spiritual community',
    'consciousness',
    'mindfulness',
    'spiritual practice'
  ],
  openGraph: {
    title: 'Sanatan Blogs - Ancient Wisdom for Modern Life',
    description: 'Join thousands of spiritual seekers exploring profound teachings from Sanatan Dharma tradition. Share your wisdom, read inspiring articles, and connect with like-minded souls.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Sanatan Blogs - Ancient Wisdom for Modern Life',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanatan Blogs - Ancient Wisdom for Modern Life',
    description: 'Discover spiritual wisdom through authentic stories and meaningful conversations.',
    images: ['/og-home.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return <HomePage />;
}