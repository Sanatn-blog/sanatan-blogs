import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Get all users (without passwords)
    const users = await User.find({}).select('-password').limit(10);
    
    return NextResponse.json({
      status: 'success',
      message: 'Test users retrieved',
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      })),
      totalUsers: users.length
    });
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { emailOrUsername, password } = body;
    
    console.log('🔍 Test login attempt for:', emailOrUsername);
    
    // Find user with password field included
    let user = null;
    
    // Check if it's a valid ObjectId (user ID)
    if (emailOrUsername.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('🔍 Searching by user ID:', emailOrUsername);
      user = await User.findById(emailOrUsername).select('+password');
    }
    
    // If not found by ID, try email only
    if (!user) {
      console.log('🔍 Searching by email:', emailOrUsername);
      user = await User.findOne({
        email: emailOrUsername.toLowerCase()
      }).select('+password');
    }
    
    if (!user) {
      return NextResponse.json({
        status: 'error',
        message: 'User not found',
        searchedFor: emailOrUsername
      }, { status: 404 });
    }
    
    console.log('✅ User found:', {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      status: user.status,
      hasPassword: !!user.password
    });
    
    // Test password comparison
    const isPasswordValid = await user.comparePassword(password);
    
    return NextResponse.json({
      status: 'success',
      message: 'Login test completed',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status
      },
      passwordValid: isPasswordValid,
      searchedFor: emailOrUsername
    });
    
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 