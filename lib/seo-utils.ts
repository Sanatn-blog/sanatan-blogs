import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image = "/og-image.jpg",
  url = "/",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.sanatanblogs.com";
  const fullUrl = `${baseUrl}${url}`;
  const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Sanatan Blogs",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: "@sanatan_blogs",
    },
    alternates: {
      canonical: fullUrl,
    },
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
  };

  // Add article-specific metadata
  if (type === "article" && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    };
  }

  return metadata;
}

// Generate JSON-LD for blog posts
export function generateBlogPostSchema(post: {
  title: string;
  description: string;
  content: string;
  author: { name: string; image?: string };
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  url: string;
  tags?: string[];
}) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.sanatanblogs.com";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image
      ? post.image.startsWith("http")
        ? post.image
        : `${baseUrl}${post.image}`
      : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      image: post.author.image,
    },
    publisher: {
      "@type": "Organization",
      name: "Sanatan Blogs",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${post.url}`,
    },
    keywords: post.tags?.join(", "),
    articleBody: post.content,
    inLanguage: "en-US",
  };
}

// Generate JSON-LD for breadcrumbs
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.sanatanblogs.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

// Generate JSON-LD for FAQ
export function generateFAQSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Truncate text for meta descriptions
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + "...";
}

// Extract plain text from HTML
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
