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
    console.log('Creating blog...');
    await connectDB();
    console.log('Database connected');

    const body = await request.json();
    console.log('Request body:', body);
    
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
    console.log('User ID:', request.user?._id);
    const user = await User.findById(request.user?._id);
    console.log('User found:', user ? 'Yes' : 'No', 'Status:', user?.status);
    
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

    // Transform SEO data to match model structure
    const transformedSeo = seo ? {
      metaTitle: seo.title,
      metaDescription: seo.description,
      metaKeywords: seo.keywords ? seo.keywords.split(',').map((k: string) => k.trim().toLowerCase()) : []
    } : {};

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
      seo: transformedSeo
    });

    // If status is published, set publication date
    if (status === 'published') {
      newBlog.publishedAt = new Date();
      newBlog.isPublished = true;
    }

    console.log('Saving blog...');
    await newBlog.save();
    console.log('Blog saved successfully');

    // Populate author information for response
    await newBlog.populate('author', 'name avatar bio email');

    const response = {
      message: 'Blog created successfully',
      blog: newBlog
    };
    
    console.log('Sending response:', response);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Create blog error:', error);

    // Handle mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const errorResponse = { error: 'Validation failed', details: error.message };
      console.log('Sending validation error response:', errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Handle duplicate key errors
    if (error instanceof Error && error.name === 'MongoServerError' && (error as { code?: number }).code === 11000) {
      const errorResponse = { error: 'Blog with this title already exists' };
      console.log('Sending duplicate key error response:', errorResponse);
      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Handle database connection errors
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      const errorResponse = { error: 'Database connection failed' };
      console.log('Sending database connection error response:', errorResponse);
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const errorResponse = { 
      error: 'Failed to create blog', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
    };
    console.log('Sending error response:', errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Export handlers with appropriate middleware
export const GET = getBlogsHandler;
export const POST = requireAuth(createBlogHandler); 