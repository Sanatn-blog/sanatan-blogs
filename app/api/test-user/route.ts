import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, username, email, password, role = 'user', status = 'approved' } = body;
    
    // Validate required fields
    if (!name || !username || !email || !password) {
      return NextResponse.json({
        status: 'error',
        message: 'Name, username, email, and password are required'
      }, { status: 400 });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    });
    
    if (existingUser) {
      return NextResponse.json({
        status: 'error',
        message: 'User with this email or username already exists',
        existingUser: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          username: existingUser.username
        }
      }, { status: 409 });
    }
    
    // Create test user
    const testUser = new User({
      name,
      username,
      email: email.toLowerCase(),
      password,
      role,
      status,
      emailVerified: true
    });
    
    await testUser.save();
    
    console.log('✅ Test user created:', {
      _id: testUser._id,
      name: testUser.name,
      email: testUser.email,
      username: testUser.username,
      role: testUser.role,
      status: testUser.status
    });
    
    return NextResponse.json({
      status: 'success',
      message: 'Test user created successfully',
      user: {
        _id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        username: testUser.username,
        role: testUser.role,
        status: testUser.status,
        createdAt: testUser.createdAt
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Test user creation error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    // Get all test users
    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(20);
    
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
    console.error('Get test users error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 