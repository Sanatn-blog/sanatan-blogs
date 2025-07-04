import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// One-time admin setup endpoint
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if any admin users already exist
    const existingAdmin = await User.findOne({ 
      role: { $in: ['admin', 'super_admin'] } 
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists!' },
        { status: 409 }
      );
    }

    // Get admin details from environment or request body
    const body = await request.json().catch(() => ({}));
    
    // Validate required fields
    const email = body.email || process.env.ADMIN_EMAIL;
    const password = body.password || process.env.DEFAULT_ADMIN_PASSWORD;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Admin email and password must be provided via request body or environment variables' },
        { status: 400 }
      );
    }
    
    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Admin password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    const adminData = {
      name: body.name || 'Super Admin',
      email: email,
      password: password,
      role: 'super_admin' as const,
      status: 'approved' as const,
      emailVerified: true
    };

    // Create admin user
    const adminUser = new User(adminData);
    await adminUser.save();

    console.log('✅ Super Admin created successfully!');

    return NextResponse.json({
      message: 'Super Admin created successfully!',
      admin: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        status: adminUser.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Setup admin error:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
} 