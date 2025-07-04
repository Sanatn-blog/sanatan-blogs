// TEMPORARILY DISABLED: OTP Authentication
// This endpoint is commented out for maintenance/development purposes

import { NextResponse } from 'next/server';

export async function POST() {
  // OTP authentication temporarily disabled
  return NextResponse.json(
    { message: 'OTP authentication is temporarily disabled' },
    { status: 501 }
  );

  /* ORIGINAL CODE - COMMENTED OUT
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Temporary simplified response for debugging
    return NextResponse.json(
      { message: 'OTP endpoint working', phoneNumber },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
  */
} 