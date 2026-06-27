import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

// Force dynamic rendering and disable caching for fresh notification data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const type = searchParams.get("type");

    const query: any = {
      recipient: decoded.userId,
      // Exclude self-notifications (e.g., commenting on own blog)
      $or: [
        { sender: { $exists: false } }, // System notifications without sender
        { sender: { $ne: decoded.userId } }, // Notifications where sender is not the user
      ],
    };

    if (unreadOnly) {
      query.read = false;
    }

    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .populate("sender", "name avatar username")
        .populate({
          path: "blog",
          select: "title status isPublished _id slug",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipient: decoded.userId, read: false }),
    ]);

    // Filter and enhance notifications
    const enhancedNotifications = notifications.map((notification: any) => {
      // Check if blog exists and is published
      if (notification.blog) {
        const blogAvailable =
          notification.blog.status === "published" &&
          notification.blog.isPublished;

        return {
          ...notification,
          blogAvailable,
        };
      }
      return notification;
    });

    return NextResponse.json({
      success: true,
      notifications: enhancedNotifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications", details: error.message },
      { status: 500 },
    );
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds, markAll } = body;

    if (markAll) {
      // Mark all notifications as read
      await Notification.updateMany(
        { recipient: decoded.userId, read: false },
        { read: true },
      );
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await Notification.updateMany(
        {
          _id: { $in: notificationIds },
          recipient: decoded.userId,
        },
        { read: true },
      );
    } else {
      return NextResponse.json(
        { error: "Invalid request. Provide notificationIds or markAll flag" },
        { status: 400 },
      );
    }

    // Get updated unread count
    const unreadCount = await Notification.countDocuments({
      recipient: decoded.userId,
      read: false,
    });

    return NextResponse.json({
      success: true,
      message: "Notifications marked as read",
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to update notifications", details: error.message },
      { status: 500 },
    );
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 },
      );
    }

    await Notification.deleteOne({
      _id: notificationId,
      recipient: decoded.userId,
    });

    return NextResponse.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification", details: error.message },
      { status: 500 },
    );
  }
}
