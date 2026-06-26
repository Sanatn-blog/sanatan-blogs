import Head from "next/head";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
}

/**
 * SEO Head component for adding additional meta tags to pages
 * This complements Next.js metadata but provides runtime flexibility
 */
export default function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
  noindex = false,
}: SEOHeadProps) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXTAUTH_URL ||
        "https://sanatan-blogs.com";

  const fullCanonical = canonical ? `${baseUrl}${canonical}` : undefined;
  const fullOgImage = ogImage || `${baseUrl}/og-image.jpg`;

  return (
    <Head>
      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Robots meta */}
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Article specific meta tags */}
      {ogType === "article" && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {tags &&
            tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Additional meta tags for better indexing */}
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="English" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />

      {/* Geo tags for location-based SEO */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Additional structured hints */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="hi_IN" />
    </Head>
  );
}
