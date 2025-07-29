import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// GET - Get comments for a blog
async function getCommentsHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // First check if the blog exists and is published
    const blog = await Blog.findOne({
      $or: [{ _id: id }, { slug: id }],
      status: 'published',
      isPublished: true
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Get comments for this blog
    const comments = await Comment.find({
      blog: blog._id,
      isApproved: true,
      parentComment: null // Only top-level comments
    })
    .populate('author', 'name avatar')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'name avatar'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    // Get total count
    const total = await Comment.countDocuments({
      blog: blog._id,
      isApproved: true,
      parentComment: null
    });

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST - Create a new comment
async function createCommentHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;
    const { content, parentCommentId } = await request.json();

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 1000 characters' },
        { status: 400 }
      );
    }

    // Check if the blog exists and is published
    const blog = await Blog.findOne({
      $or: [{ _id: id }, { slug: id }],
      status: 'published',
      isPublished: true
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // If this is a reply, check if parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findOne({
        _id: parentCommentId,
        blog: blog._id,
        isApproved: true
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Create new comment
    if (!request.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    const comment = new Comment({
      content: content.trim(),
      author: request.user._id,
      blog: blog._id,
      parentComment: parentCommentId || null
    });

    await comment.save();

    // If this is a reply, add it to parent comment's replies
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    // Populate author info for response
    await comment.populate('author', 'name avatar');

    return NextResponse.json(comment, { status: 201 });

  } catch (error) {
    console.error('Error creating comment:', error);
    
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// Export handlers with appropriate middleware
export const GET = getCommentsHandler;
export const POST = requireAuth(createCommentHandler); 