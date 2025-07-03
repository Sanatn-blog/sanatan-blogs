import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing API connection...');
    
    // Test database connection
    await connectDB();
    console.log('Database connected successfully');
    
    // Test environment variables
    const envCheck = {
      mongodb: !!process.env.MONGODB_URI,
      jwt: !!process.env.JWT_SECRET,
      cloudinary: {
        cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: !!process.env.CLOUDINARY_API_KEY,
        apiSecret: !!process.env.CLOUDINARY_API_SECRET
      }
    };
    
    console.log('Environment check:', envCheck);
    
    return NextResponse.json({
      message: 'API is working',
      database: 'Connected',
      environment: envCheck
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      error: 'API test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 