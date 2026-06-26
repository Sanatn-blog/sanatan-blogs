import { useEffect } from "react";

interface Author {
  _id: string;
  name: string;
  bio?: string;
  avatar?: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: Author;
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
}

interface BlogArticleStructuredDataProps {
  blog: Blog;
}

export default function BlogArticleStructuredData({
  blog,
}: BlogArticleStructuredDataProps) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXTAUTH_URL ||
        "https://sanatan-blogs.com";

  const articleUrl = `${baseUrl}/blogs/${blog._id}`;
  const imageUrl = blog.featuredImage || `${baseUrl}/og-image.jpg`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || blog.seo?.metaDescription || "",
    image: imageUrl,
    author: {
      "@type": "Person",
      name: blog.author.name,
      description: blog.author.bio || "",
      url: `${baseUrl}/authors/${blog.author._id}`,
      ...(blog.author.avatar && {
        image: {
          "@type": "ImageObject",
          url: blog.author.avatar,
        },
      }),
    },
    publisher: {
      "@type": "Organization",
      name: "Sanatan Blogs",
      description: "Platform for spiritual knowledge and ancient wisdom",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
        width: 300,
        height: 300,
      },
      url: baseUrl,
    },
    datePublished: blog.publishedAt || blog.updatedAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: blog.category,
    keywords: blog.tags.join(", "),
    wordCount: blog.content ? blog.content.split(/\s+/).length : 0,
    timeRequired: `PT${blog.readingTime}M`,
    inLanguage: "en-US",
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: blog.views || 0,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: (blog.likes || []).length,
      },
    ],
    potentialAction: {
      "@type": "ReadAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: articleUrl,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
          "http://schema.org/IOSPlatform",
          "http://schema.org/AndroidPlatform",
        ],
      },
    },
  };

  useEffect(() => {
    // Add structured data to the page
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    script.id = "blog-article-structured-data";

    // Remove existing script if present
    const existingScript = document.getElementById(
      "blog-article-structured-data",
    );
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(
        "blog-article-structured-data",
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [blog._id]); // Re-run when blog changes

  return null; // This component doesn't render anything visible
}
