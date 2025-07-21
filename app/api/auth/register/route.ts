import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { rateLimit } from '@/middleware/auth';
import { generateSecureAccessToken, generateRefreshToken } from '@/lib/jwt';

async function registerHandler(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, username, email, password, phoneNumber, bio, socialLinks } = body;

    // Basic validation
    if (!name || !username || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: 'Name, username, email, phone number, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Additional password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (username.length < 3 || username.length > 30 || !usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Phone number validation (required)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Check if user already exists with email
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if user already exists with username
    const existingUserByUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if user already exists with phone number (if provided)
    if (phoneNumber) {
      const existingUserByPhone = await User.findOne({ phoneNumber: phoneNumber.trim() });
      if (existingUserByPhone) {
        return NextResponse.json(
          { error: 'User with this phone number already exists' },
          { status: 409 }
        );
      }
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      phoneNumber: phoneNumber?.trim(),
      bio: bio?.trim(),
      socialLinks: socialLinks || {},
      status: process.env.NODE_ENV === 'development' ? 'approved' : 'pending', // Auto-approve in development
      authProvider: phoneNumber ? 'phone' : 'email'
    });

    await newUser.save();

    // Generate JWT tokens with password hash for additional security
    const accessToken = generateSecureAccessToken(newUser._id.toString(), newUser.password);
    const refreshToken = generateRefreshToken(newUser._id.toString());

    // Remove sensitive information before sending response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      status: newUser.status,
      bio: newUser.bio,
      socialLinks: newUser.socialLinks,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({
      message: 'User registered successfully. Please wait for admin approval.',
      user: userResponse,
      accessToken,
      refreshToken
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Registration error:', error);

    // Handle mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
      const mongooseError = error as { errors: Record<string, { message: string }> };
      const errors = Object.values(mongooseError.errors).map((err: { message: string }) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      const duplicateError = error as { keyPattern?: Record<string, number> };
      if (duplicateError.keyPattern?.username) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }
      if (duplicateError.keyPattern?.email) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      if (duplicateError.keyPattern?.phoneNumber) {
        return NextResponse.json(
          { error: 'User with this phone number already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply rate limiting (5 registration attempts per 15 minutes)
export const POST = rateLimit(5, 15 * 60 * 1000)(registerHandler); 