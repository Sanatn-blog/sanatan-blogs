/**
 * The canonical origin of the site, without a trailing slash.
 *
 * This used to be re-derived in about a dozen places with three different
 * fallbacks between them - "https://sanatan-blogs.com" (a domain that is not
 * ours), "https://www.sanatanblogs.com" and NEXT_PUBLIC_SITE_URL. Whenever the
 * environment variable was missing, robots.txt and the sitemap advertised one
 * domain while the page metadata claimed another, which is exactly the kind of
 * disagreement that keeps pages out of the index.
 *
 * NEXT_PUBLIC_SITE_URL is preferred because it says what it means; NEXTAUTH_URL
 * is accepted for continuity with the existing deployment, which sets only that.
 */
const FALLBACK_SITE_URL = "https://www.sanatanblogs.com";

function resolveSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL;

  if (!configured) return FALLBACK_SITE_URL;

  // A trailing slash here turns every canonical into a double-slashed URL.
  return configured.replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();

/** Absolute URL for a site-relative path such as "/blogs/my-post". */
export function absoluteUrl(path: string = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
