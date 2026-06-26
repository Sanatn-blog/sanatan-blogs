import { Metadata } from "next";

interface BlogData {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  author: {
    _id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt?: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  readingTime?: number;
  views?: number;
  likes?: string[];
}

interface BlogResponse {
  blog: BlogData;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    // Fetch blog data from API
    const baseUrl = process.env.NEXTAUTH_URL || "https://www.sanatanblogs.com";
    const response = await fetch(`${baseUrl}/api/blogs/${params.id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return {
        title: "Blog Not Found | Sanatan Blogs",
        description: "The requested blog post could not be found.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const data: BlogResponse = await response.json();
    const blog = data.blog;

    if (!blog) {
      return {
        title: "Blog Not Found | Sanatan Blogs",
        description: "The requested blog post could not be found.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const shareUrl = `${baseUrl}/blogs/${params.id}`;
    const imageUrl = blog.featuredImage || `${baseUrl}/og-image.jpg`;

    // Truncate description to optimal length (150-160 characters for best SEO)
    const metaDescription = blog.seo?.metaDescription || blog.excerpt;
    const truncatedDescription =
      metaDescription.length > 155
        ? metaDescription.substring(0, 152) + "..."
        : metaDescription;

    // Generate focus keywords from title and tags
    const focusKeywords = [
      blog.title,
      ...blog.tags,
      blog.category,
      "Sanatan Dharma",
      "spiritual wisdom",
    ].slice(0, 10);

    return {
      title: blog.seo?.metaTitle || `${blog.title} | Sanatan Blogs`,
      description: truncatedDescription,
      keywords: blog.seo?.metaKeywords || focusKeywords,
      authors: [
        {
          name: blog.author.name,
          url: `${baseUrl}/authors/${blog.author._id}`,
        },
      ],
      creator: blog.author.name,
      publisher: "Sanatan Blogs",
      category: blog.category,
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
        title: blog.title,
        description: blog.excerpt,
        url: shareUrl,
        siteName: "Sanatan Blogs",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
            type: "image/jpeg",
          },
        ],
        locale: "en_US",
        type: "article",
        publishedTime: blog.publishedAt || blog.updatedAt,
        modifiedTime: blog.updatedAt,
        authors: [blog.author.name],
        section: blog.category,
        tags: blog.tags,
      },
      twitter: {
        card: "summary_large_image",
        site: "@sanatan_blogs",
        creator: "@sanatan_blogs",
        title: blog.title,
        description: truncatedDescription,
        images: [imageUrl],
      },
      alternates: {
        canonical: shareUrl,
        languages: {
          "en-US": shareUrl,
          "hi-IN": `/hi/blogs/${params.id}`,
        },
      },
      other: {
        "article:author": blog.author.name,
        "article:published_time": blog.publishedAt || blog.updatedAt,
        "article:modified_time": blog.updatedAt,
        "article:section": blog.category,
        "article:tag": blog.tags.join(", "),
        "og:see_also": `${baseUrl}/blogs?category=${encodeURIComponent(blog.category)}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog | Sanatan Blogs",
      description:
        "Discover spiritual wisdom and ancient knowledge on Sanatan Blogs.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}
