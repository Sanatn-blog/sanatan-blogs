import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find and update subscription
    const subscription = await Subscription.findOne({ 
      email: email.toLowerCase() 
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Email not found in our subscription list' },
        { status: 404 }
      );
    }

    if (subscription.status === 'unsubscribed') {
      return NextResponse.json(
        { message: 'You are already unsubscribed from our newsletter' },
        { status: 200 }
      );
    }

    // Unsubscribe the user
    subscription.status = 'unsubscribed';
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    return NextResponse.json(
      { 
        message: 'You have been successfully unsubscribed from our newsletter.',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again later.' },
      { status: 500 }
    );
  }
} 