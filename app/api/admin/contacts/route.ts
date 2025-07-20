import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

interface ContactQuery {
  status?: string;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
    subject?: { $regex: string; $options: string };
  }>;
}

interface StatsMap {
  [key: string]: number;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build query
    const query: ContactQuery = {};
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .select('-ipAddress -userAgent')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Contact.countDocuments(query);

    // Get statistics
    const stats = await Contact.aggregate([
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

    // Get today's submissions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySubmissions = await Contact.countDocuments({
      createdAt: { $gte: today }
    });

    // Get this week's submissions
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSubmissions = await Contact.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        new: statsMap.new || 0,
        read: statsMap.read || 0,
        replied: statsMap.replied || 0,
        archived: statsMap.archived || 0,
        total: total,
        today: todaySubmissions,
        thisWeek: weekSubmissions
      }
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
} 