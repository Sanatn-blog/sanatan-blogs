import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id: authorId } = await params;
    
    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    // Convert string ID to ObjectId
    const authorObjectId = new mongoose.Types.ObjectId(authorId);

    // Fetch author data
    const author = await User.findById(authorObjectId).select('-password');
    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Fetch authors published blogs
    const blogs = await Blog.find({ 
      author: authorObjectId,
      status: 'published'
    })
    .select('title slug excerpt featuredImage category readingTime views likes publishedAt status')
    .sort({ publishedAt: -1 })
    .limit(12);

    // Calculate statistics
    const totalBlogs = await Blog.countDocuments({ 
      author: authorObjectId,
      status: 'published'
    });

    const totalViews = await Blog.aggregate([
      { $match: { author: authorObjectId, status: 'published' } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const totalLikes = await Blog.aggregate([
      { $match: { author: authorObjectId, status: 'published' } },
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, totalLikes: { $sum: '$likesCount' } } }
    ]);

    const averageReadingTime = await Blog.aggregate([
      { $match: { author: authorObjectId, status: 'published' } },
      { $group: { _id: null, avgReadingTime: { $avg: '$readingTime' } } }
    ]);

    const mostPopularCategory = await Blog.aggregate([
      { $match: { author: authorObjectId, status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    // Prepare author data with calculated stats
    const authorData = {
      _id: author._id,
      name: author.name,
      email: author.email,
      bio: author.bio,
      avatar: author.avatar,
      role: author.role,
      status: author.status,
      socialLinks: author.socialLinks,
      location: author.location,
      joinedAt: author.createdAt,
      totalBlogs: totalBlogs,
      totalViews: totalViews[0]?.totalViews || 0,
      totalLikes: totalLikes[0]?.totalLikes || 0,
      followers: author.followers?.length || 0,
      following: author.following?.length || 0,
      expertise: author.expertise || [],
      achievements: author.achievements || []
    };

    // Prepare stats data
    const statsData = {
      totalBlogs: totalBlogs,
      totalViews: totalViews[0]?.totalViews || 0,
      totalLikes: totalLikes[0]?.totalLikes || 0,
      averageReadingTime: Math.round(averageReadingTime[0]?.avgReadingTime || 0),
      mostPopularCategory: mostPopularCategory[0]?._id || 'N/A'
    };

    return NextResponse.json({
      author: authorData,
      blogs: blogs,
      stats: statsData
    });

  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 