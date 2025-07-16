import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV
    };

    console.log('Environment check:', envCheck);

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        status: 'error',
        message: 'MONGODB_URI environment variable is not set',
        envCheck
      }, { status: 500 });
    }

    // Test database connection
    console.log('Testing database connection...');
    await connectDB();
    console.log('Database connected successfully');

    // Test basic database operations
    const blogCount = await Blog.countDocuments();
    const categories = await Blog.distinct('category');

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      data: {
        blogCount,
        categories,
        timestamp: new Date().toISOString()
      },
      envCheck
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 