import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get request data
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Get client information
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (subject.length < 5 || subject.length > 200) {
      return NextResponse.json(
        { error: 'Subject must be between 5 and 200 characters' },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // Check for spam (basic rate limiting)
    const recentSubmissions = await Contact.find({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    if (recentSubmissions.length >= 5) {
      return NextResponse.json(
        { error: 'Too many submissions from this email. Please try again later.' },
        { status: 429 }
      );
    }

    // Create new contact submission
    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: ipAddress.split(',')[0].trim(), // Get first IP if multiple
      userAgent: userAgent
    });

    // Save to database
    await contact.save();

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message. We will get back to you soon!',
        id: contact._id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve contact submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    interface QueryFilter {
      status?: string;
    }
    
    const query: QueryFilter = {};
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      query.status = status;
    }

    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-ipAddress -userAgent');

    // Get total count
    const total = await Contact.countDocuments(query);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
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