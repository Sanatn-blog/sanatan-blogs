import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://sanatan-blogs.com';
  
  const robots = `# Robots.txt for Sanatan Blogs
# Welcome search engines to index our spiritual content

User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /verify-email
Disallow: /email-verified
Disallow: /write-blog
Disallow: /_next/
Disallow: /loading-demo/

# Allow access to important content
Allow: /blogs/
Allow: /authors/
Allow: /about
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /donate

# Special directives for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 1

# Block harmful bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Host directive (for some search engines)
Host: ${baseUrl.replace(/^https?:\/\//, '')}`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}