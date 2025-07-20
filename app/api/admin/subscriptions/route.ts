import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';

// Define proper types
interface QueryFilter {
  status?: string;
  email?: { $regex: string; $options: string };
}

interface StatsMap {
  [key: string]: number;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build query
    const query: QueryFilter = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    // Get subscriptions with pagination
    const subscriptions = await Subscription.find(query)
      .select('-ipAddress -userAgent')
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Subscription.countDocuments(query);

    // Get statistics
    const stats = await Subscription.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statsMap = stats.reduce((acc: StatsMap, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        active: statsMap.active || 0,
        unsubscribed: statsMap.unsubscribed || 0,
        total: total
      }
    });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await Subscription.deleteOne({ email: email.toLowerCase() });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Subscription deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
} 