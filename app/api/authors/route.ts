import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Blog from '@/models/Blog';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    
    // Build query
    const query: Record<string, unknown> = { role: { $in: ['author', 'admin'] } };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Fetch authors with pagination
    const skip = (page - 1) * limit;
    const authors = await User.find(query)
      .select('name bio avatar location role status createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalAuthors = await User.countDocuments(query);
    
    // Fetch statistics for each author
    const authorsWithStats = await Promise.all(
      authors.map(async (author) => {
        // Get author's published blogs count
        const totalBlogs = await Blog.countDocuments({ 
          author: author._id,
          status: 'published'
        });
        
        // Get total views
        const totalViewsResult = await Blog.aggregate([
          { $match: { author: author._id, status: 'published' } },
          { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);
        const totalViews = totalViewsResult[0]?.totalViews || 0;
        
        // Get total likes
        const totalLikesResult = await Blog.aggregate([
          { $match: { author: author._id, status: 'published' } },
          { $group: { _id: null, totalLikes: { $sum: { $size: '$likes' } } } }
        ]);
        const totalLikes = totalLikesResult[0]?.totalLikes || 0;
        
        return {
          _id: author._id,
          name: author.name,
          bio: author.bio,
          avatar: author.avatar,
          location: author.location,
          role: author.role,
          status: author.status,
          joinedAt: author.createdAt,
          totalBlogs,
          totalViews,
          totalLikes,
          followers: author.followers?.length || 0
        };
      })
    );
    
    // Filter out authors with no published blogs (optional - remove if you want to show all authors)
    const activeAuthors = authorsWithStats.filter(author => author.totalBlogs > 0);
    
    return NextResponse.json({
      authors: activeAuthors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalAuthors / limit),
        totalAuthors,
        hasNextPage: page * limit < totalAuthors,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 