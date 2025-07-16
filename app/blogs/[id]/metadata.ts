import { Metadata } from 'next';

interface BlogData {
  title: string;
  excerpt: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  author: {
    name: string;
  };
  publishedAt?: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featuredImage?: string;
}

interface BlogResponse {
  blog: BlogData;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Fetch blog data from API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blogs/${params.id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return {
        title: 'Blog Not Found - Sanatan Blogs',
        description: 'The requested blog post could not be found.',
      };
    }

    const data: BlogResponse = await response.json();
    const blog = data.blog;
    
    if (!blog) {
      return {
        title: 'Blog Not Found - Sanatan Blogs',
        description: 'The requested blog post could not be found.',
      };
    }

    const shareUrl = `${baseUrl}/blogs/${params.id}`;

    return {
      title: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.excerpt,
      keywords: blog.seo?.metaKeywords || blog.tags,
      authors: [{ name: blog.author.name }],
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        url: shareUrl,
        siteName: 'Sanatan Blogs',
        images: blog.featuredImage ? [
          {
            url: blog.featuredImage,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ] : [],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt,
        images: blog.featuredImage ? [blog.featuredImage] : [],
      },
      alternates: {
        canonical: shareUrl,
      },
      other: {
        'article:author': blog.author.name,
        'article:published_time': blog.publishedAt || blog.updatedAt,
        'article:modified_time': blog.updatedAt,
        'article:section': blog.category,
        ...(blog.tags && blog.tags.length > 0 ? blog.tags.reduce((acc, tag) => ({
          ...acc,
          [`article:tag`]: tag,
        }), {}) : {}),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog - Sanatan Blogs',
      description: 'A secure platform for authentic storytelling and meaningful conversations.',
    };
  }
} 