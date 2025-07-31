'use client';

interface BlogStructuredDataProps {
  blog: {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    author: {
      _id: string;
      name: string;
      bio?: string;
      avatar?: string;
      socialLinks?: {
        twitter?: string;
        linkedin?: string;
        website?: string;
        instagram?: string;
        youtube?: string;
        facebook?: string;
      };
    };
    category: string;
    tags: string[];
    publishedAt?: string;
    updatedAt: string;
    readingTime: number;
    views: number;
    likes: string[];
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string[];
    };
  };
  slug: string;
}

interface AuthorStructuredDataProps {
  author: {
    _id: string;
    name: string;
    bio?: string;
    avatar?: string;
    followers?: number;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
      instagram?: string;
      youtube?: string;
      facebook?: string;
    };
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export function BlogStructuredData({ blog, slug }: BlogStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sanatan-blogs.com';
  
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage ? [blog.featuredImage] : [],
    author: {
      '@type': 'Person',
      name: blog.author.name,
      description: blog.author.bio,
      image: blog.author.avatar,
      url: `${baseUrl}/authors/${blog.author._id}`,
      sameAs: blog.author.socialLinks ? Object.values(blog.author.socialLinks).filter(Boolean) : [],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sanatan Blogs',
      description: 'Platform for sharing spiritual knowledge and ancient wisdom',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 300,
        height: 300,
      },
      url: baseUrl,
    },
    datePublished: blog.publishedAt || blog.updatedAt,
    dateModified: blog.updatedAt,
    url: `${baseUrl}/blogs/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blogs/${slug}`,
    },
    articleSection: blog.category,
    keywords: blog.tags.join(', '),
    wordCount: Math.ceil(blog.content.length / 5), // Rough word count estimation
    timeRequired: `PT${blog.readingTime}M`, // ISO 8601 duration format
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ViewAction',
        userInteractionCount: blog.views,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: blog.likes.length,
      },
    ],
    about: {
      '@type': 'Thing',
      name: blog.category,
      description: `Articles about ${blog.category} and spiritual topics`,
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
    />
  );
}

export function AuthorStructuredData({ author }: AuthorStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sanatan-blogs.com';
  
  const authorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio || `Author at Sanatan Blogs sharing spiritual knowledge and wisdom`,
    image: author.avatar,
    url: `${baseUrl}/authors/${author._id}`,
    sameAs: author.socialLinks ? Object.values(author.socialLinks).filter(Boolean) : [],
    worksFor: {
      '@type': 'Organization',
      name: 'Sanatan Blogs',
      url: baseUrl,
    },
    knowsAbout: [
      'Sanatan Dharma',
      'Spirituality',
      'Yoga',
      'Meditation',
      'Indian Philosophy',
      'Ancient Wisdom',
    ],
    ...(author.followers && {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/FollowAction',
        userInteractionCount: author.followers,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sanatan-blogs.com';
  
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
  );
}

export function BlogListingStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sanatan-blogs.com';
  
  const blogListingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Sanatan Blogs',
    description: 'Collection of articles on Sanatan Dharma, Yoga, Meditation, and spiritual wisdom',
    url: `${baseUrl}/blogs`,
    publisher: {
      '@type': 'Organization',
      name: 'Sanatan Blogs',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Latest Blog Posts',
      description: 'Recent articles on spiritual topics',
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Sanatan Dharma',
        description: 'Ancient Indian spiritual tradition',
      },
      {
        '@type': 'Thing',
        name: 'Yoga',
        description: 'Physical, mental, and spiritual practices',
      },
      {
        '@type': 'Thing',
        name: 'Meditation',
        description: 'Mindfulness and spiritual practice',
      },
    ],
    inLanguage: 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListingJsonLd) }}
    />
  );
}