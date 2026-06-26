import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spiritual Blog Articles | Sanatan Dharma, Yoga & Meditation",
  description:
    "Explore in-depth articles on Sanatan Dharma, Yoga, Meditation, Hindu philosophy, and spiritual wisdom. Ancient knowledge for modern living.",
  keywords: [
    "Sanatan Dharma blogs",
    "Hindu philosophy articles",
    "Yoga guides",
    "Meditation techniques",
    "Spirituality",
    "Bhagavad Gita teachings",
    "Vedanta philosophy",
    "Indian culture",
    "Ancient wisdom",
    "Spiritual growth",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Spiritual Blog Articles | Sanatan Dharma & Ancient Wisdom",
    description:
      "Discover profound articles connecting ancient Indian knowledge with modern life. Read about spirituality, yoga, meditation, and philosophy.",
    url: "/blogs",
    siteName: "Sanatan Blogs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sanatan Blogs - Spiritual Knowledge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sanatan_blogs",
    creator: "@sanatan_blogs",
    title: "Spiritual Blog Articles | Ancient Wisdom",
    description:
      "Explore articles on Sanatan Dharma, Yoga, Meditation, and spiritual philosophy",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/blogs",
    languages: {
      "en-US": "/blogs",
      "hi-IN": "/hi/blogs",
    },
  },
};
