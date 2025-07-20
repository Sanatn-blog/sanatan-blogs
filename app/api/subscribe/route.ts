import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, source = 'footer' } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return NextResponse.json(
          { 
            message: 'You are already subscribed to our newsletter!',
            alreadySubscribed: true 
          },
          { status: 200 }
        );
      } else {
        // Reactivate unsubscribed email
        existingSubscription.status = 'active';
        existingSubscription.unsubscribedAt = undefined;
        existingSubscription.source = source;
        await existingSubscription.save();

        return NextResponse.json(
          { 
            message: 'Welcome back! You have been resubscribed to our newsletter.',
            resubscribed: true 
          },
          { status: 200 }
        );
      }
    }

    // Get client information
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create new subscription
    const subscription = new Subscription({
      email: email.toLowerCase(),
      source,
      ipAddress,
      userAgent
    });

    await subscription.save();

    return NextResponse.json(
      { 
        message: 'Thank you for subscribing to our newsletter!',
        success: true 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    
    // Handle duplicate key error (MongoDB unique constraint)
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { 
          message: 'You are already subscribed to our newsletter!',
          alreadySubscribed: true 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const subscriptions = await Subscription.find({ status: 'active' })
      .select('email subscribedAt source')
      .sort({ subscribedAt: -1 });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
} 