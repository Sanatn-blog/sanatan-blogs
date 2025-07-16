import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

interface LeanBlog {
  _id: string;
  category: string;
  publishedAt: Date;
  views: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: {
    name?: string;
    avatar?: string;
    bio?: string;
    socialLinks?: unknown;
  };
  status: string;
  isPublished: boolean;
  seo?: unknown;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Get single blog by ID (public endpoint or authenticated author)
async function getBlogHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    let isAuthenticated = false;
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const { verifyToken } = await import('@/lib/jwt');
        const decoded = verifyToken(token);
        if (decoded && decoded.userId) {
          isAuthenticated = true;
          userId = decoded.userId;
        }
      } catch (error) {
        console.log('Token verification failed:', error);
      }
    }

    // Build query based on authentication status
    let query: Record<string, unknown>;

    if (isAuthenticated) {
      // For authenticated users, allow access to their own blogs regardless of status
      // or published blogs from other authors
      query = {
        $or: [
          { _id: id, author: userId }, // User's own blog (any status)
          { slug: id, author: userId }, // User's own blog (any status)
          { _id: id, status: 'published', isPublished: true }, // Published blogs from others
          { slug: id, status: 'published', isPublished: true } // Published blogs from others
        ]
      };
    } else {
      // For public access, only show published blogs
      query = {
        $or: [
          { _id: id },
          { slug: id }
        ],
        status: 'published',
        isPublished: true
      };
    }

    // Find blog by ID or slug
    const blog = await Blog.findOne(query)
    .populate('author', 'name avatar bio socialLinks')
    .lean<LeanBlog>();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    const { _id, category } = blog;

    // Only increment view count and get related blogs for published blogs
    if (blog.status === 'published' && blog.isPublished) {
      // Increment view count
      await Blog.findByIdAndUpdate(_id, {
        $inc: { views: 1 }
      });

      // Get related blogs (same category, excluding current blog)
      const relatedBlogs = await Blog.find({
        category,
        _id: { $ne: _id },
        status: 'published',
        isPublished: true
      })
      .populate('author', 'name avatar')
      .select('title excerpt slug featuredImage category readingTime')
      .limit(3)
      .sort({ publishedAt: -1 })
      .lean();

      // Get next and previous blogs
      const nextBlog = await Blog.findOne({
        publishedAt: { $gt: blog.publishedAt },
        status: 'published',
        isPublished: true
      })
      .select('title slug')
      .sort({ publishedAt: 1 })
      .lean();

      const previousBlog = await Blog.findOne({
        publishedAt: { $lt: blog.publishedAt },
        status: 'published',
        isPublished: true
      })
      .select('title slug')
      .sort({ publishedAt: -1 })
      .lean();

      return NextResponse.json({
        blog: {
          ...blog,
          views: (blog.views || 0) + 1 // Return updated view count
        },
        relatedBlogs,
        navigation: {
          next: nextBlog,
          previous: previousBlog
        }
      });
    } else {
      // For drafts or non-published blogs, return just the blog data
      return NextResponse.json(blog);
    }

  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT - Update blog (authenticated author/admin only)
async function updateBlogHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    // Find existing blog
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Check if user is author or admin
    const isAuthor = existingBlog.author.toString() === request.user?._id;
    const isAdmin = ['admin', 'super_admin'].includes(request.user?.role || '');
    
    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only edit your own blogs' },
        { status: 403 }
      );
    }

    // Update fields
    const allowedFields = [
      'title', 'excerpt', 'content', 'category', 'tags', 
      'featuredImage', 'status', 'seo'
    ];

    const updateData: Record<string, unknown> = {};
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Update slug if title changed
    if (body.title && body.title !== existingBlog.title) {
      const baseSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);

      // Ensure slug is unique
      let slug = baseSlug;
      let counter = 1;
      while (await Blog.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    // If publishing for first time, set publication date
    if (body.status === 'published' && existingBlog.status !== 'published') {
      updateData.publishedAt = new Date();
      updateData.isPublished = true;
    }

    // If unpublishing, remove publication date
    if (body.status !== 'published') {
      updateData.isPublished = false;
    }

    updateData.updatedAt = new Date();

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar bio email');

    return NextResponse.json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });

  } catch (error) {
    console.error('Update blog error:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog (authenticated author/admin only)
async function deleteBlogHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    // Find existing blog
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Check if user is author or admin
    const isAuthor = existingBlog.author.toString() === request.user?._id;
    const isAdmin = ['admin', 'super_admin'].includes(request.user?.role || '');
    
    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only delete your own blogs' },
        { status: 403 }
      );
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}

// Export handlers with appropriate middleware
export const GET = getBlogHandler;
export const PUT = requireAuth(updateBlogHandler);
export const DELETE = requireAuth(deleteBlogHandler); 