import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Get all users with basic info (no sensitive data)
    const users = await User.find({}).select('_id name username email status role createdAt');
    
    console.log('📋 Found users:', users.length);
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - Status: ${user.status}`);
    });
    
    return NextResponse.json({
      status: 'success',
      count: users.length,
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Test users error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 