import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import User from '@/models/User';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// GET - List all published blogs with pagination and filtering (public endpoint)
async function getBlogsHandler(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const author = searchParams.get('author');
    const tag = searchParams.get('tag');
    const status = searchParams.get('status'); // New parameter for admin panel

    // Build query - allow all statuses if status parameter is provided (for admin)
    const query: Record<string, unknown> = {};
    
    if (!status) {
      // Public endpoint - only show published blogs
      query.status = 'published';
      query.isPublished = true;
    } else if (status !== 'all') {
      // Filter by specific status
      query.status = status;
    }

    if (category) query.category = category;
    if (author) query.author = author;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get blogs with author information
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar bio')
      .select('-content') // Exclude full content for list view
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    // Get categories for filtering
    const categories = await Blog.distinct('category', query);

    // Get popular tags
    const tagStats = await Blog.aggregate([
      { $match: query },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      categories,
      popularTags: tagStats.map((tag) => ({
        name: tag._id,
        count: tag.count
      }))
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST - Create new blog (authenticated users only)
async function createBlogHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      status = 'draft',
      seo
    } = body;

    // Basic validation
    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Title, excerpt, content, and category are required' },
        { status: 400 }
      );
    }

    // Verify user exists and is approved
    const user = await User.findById(request.user?._id);
    if (!user || user.status !== 'approved') {
      return NextResponse.json(
        { error: 'User not found or not approved' },
        { status: 403 }
      );
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);

    // Ensure slug is unique
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create new blog
    const newBlog = new Blog({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: request.user?._id,
      category,
      tags: Array.isArray(tags) ? tags.map((tag: string) => tag.trim().toLowerCase()) : [],
      featuredImage,
      status,
      seo: seo || {}
    });

    // If status is published, set publication date
    if (status === 'published') {
      newBlog.publishedAt = new Date();
      newBlog.isPublished = true;
    }

    await newBlog.save();

    // Populate author information for response
    await newBlog.populate('author', 'name avatar bio email');

    return NextResponse.json({
      message: 'Blog created successfully',
      blog: newBlog
    }, { status: 201 });

  } catch (error) {
    console.error('Create blog error:', error);

    // Handle mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

// Export handlers with appropriate middleware
export const GET = getBlogsHandler;
export const POST = requireAuth(createBlogHandler); 