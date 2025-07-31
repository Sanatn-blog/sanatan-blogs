import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import User from '@/models/User';
import mongoose from 'mongoose';

interface BlogData {
  _id: string;
  slug: string;
  updatedAt: string;
  publishedAt?: string;
}

interface AuthorData {
  _id: string;
  name: string;
  updatedAt: string;
}

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://sanatan-blogs.com';

  try {
    // Connect to database
    await connectDB();

    // Fetch published blogs directly from database
    const blogsQuery = await Blog.find({ 
      status: 'published', 
      isPublished: true 
    })
    .select('_id slug updatedAt publishedAt')
    .sort({ publishedAt: -1 })
    .limit(1000)
    .lean();
    
    const blogs: BlogData[] = blogsQuery.map(blog => ({
      _id: (blog._id as mongoose.Types.ObjectId).toString(),
      slug: blog.slug as string,
      updatedAt: (blog.updatedAt as Date).toISOString(),
      publishedAt: blog.publishedAt ? (blog.publishedAt as Date).toISOString() : undefined
    }));

    // Fetch authors directly from database
    const authorsQuery = await User.find({ 
      role: { $in: ['author', 'admin'] },
      status: 'approved'
    })
    .select('_id name updatedAt')
    .sort({ createdAt: -1 })
    .limit(1000)
    .lean();
    
    const authors: AuthorData[] = authorsQuery.map(author => ({
      _id: (author._id as mongoose.Types.ObjectId).toString(),
      name: author.name as string,
      updatedAt: (author.updatedAt as Date).toISOString()
    }));

    // Static pages with their priorities and change frequencies
    const staticPages = [
      {
        url: '',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: '1.0'
      },
      {
        url: '/blogs',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: '0.9'
      },
      {
        url: '/authors',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: '0.8'
      },
      {
        url: '/about',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.7'
      },
      {
        url: '/contact',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.6'
      },
      {
        url: '/privacy',
        lastModified: new Date().toISOString(),
        changeFrequency: 'yearly',
        priority: '0.3'
      },
      {
        url: '/terms',
        lastModified: new Date().toISOString(),
        changeFrequency: 'yearly',
        priority: '0.3'
      },
      {
        url: '/donate',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.5'
      }
    ];

    // Dynamic blog pages
    const blogPages = blogs.map((blog) => ({
      url: `/blogs/${blog.slug || blog._id}`,
      lastModified: blog.updatedAt || blog.publishedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: '0.8'
    }));

    // Author pages
    const authorPages = authors.map((author) => ({
      url: `/authors/${author._id}`,
      lastModified: author.updatedAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: '0.6'
    }));

    // Combine all pages
    const allPages = [...staticPages, ...blogPages, ...authorPages];

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap with just static pages
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}