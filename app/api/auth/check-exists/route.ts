import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

async function checkExistsHandler(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phoneNumber = searchParams.get('phoneNumber');

    const results: { email?: boolean; phoneNumber?: boolean } = {};

    // Check email if provided
    if (email) {
      const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
      results.email = !!existingUserByEmail;
    }

    // Check phone number if provided
    if (phoneNumber) {
      const existingUserByPhone = await User.findOne({ phoneNumber: phoneNumber.trim() });
      results.phoneNumber = !!existingUserByPhone;
    }

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('Check exists error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = checkExistsHandler; 