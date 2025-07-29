import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// DELETE - Delete a comment (only author or admin can delete)
async function deleteCommentHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string; commentId: string }> }) {
  try {
    await connectDB();

    const { id, commentId } = await params;

    // Check if the blog exists
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

    // Find the comment
    const comment = await Comment.findOne({
      _id: commentId,
      blog: blog._id
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if user can delete this comment (author or admin)
    if (!request.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    const canDelete = request.user.role === 'admin' || 
                     request.user.role === 'super_admin' || 
                     comment.author.toString() === request.user._id.toString();

    if (!canDelete) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this comment' },
        { status: 403 }
      );
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting comment:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

// PATCH - Update a comment (only author can update)
async function updateCommentHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string; commentId: string }> }) {
  try {
    await connectDB();

    const { id, commentId } = await params;
    const { content } = await request.json();

    // Validate content
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

    // Check if the blog exists
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

    // Find the comment
    const comment = await Comment.findOne({
      _id: commentId,
      blog: blog._id
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if user can update this comment (only author)
    if (!request.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    if (comment.author.toString() !== request.user._id.toString()) {
      return NextResponse.json(
        { error: 'You are not authorized to update this comment' },
        { status: 403 }
      );
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content: content.trim() },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    return NextResponse.json(updatedComment);

  } catch (error) {
    console.error('Error updating comment:', error);
    
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// Export handlers with appropriate middleware
export const DELETE = requireAuth(deleteCommentHandler);
export const PATCH = requireAuth(updateCommentHandler); 