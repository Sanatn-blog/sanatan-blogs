import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/lib/mongodb";
import { requireAuth, AuthenticatedRequest } from "@/middleware/auth";
// Import all models to ensure they are registered before use
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Get current user's blogs
async function getMyBlogsHandler(request: AuthenticatedRequest) {
  try {
    // Check for required environment variables
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 },
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    if (!request.user?._id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Aggregation pipelines are not cast by Mongoose the way queries are, so a
    // string here silently matches nothing - which is why the comment total on
    // the dashboard always read zero.
    const authorId = new Types.ObjectId(request.user._id);

    // Build query for user's blogs
    const query: Record<string, unknown> = {
      author: authorId,
    };

    if (status && status !== "all") {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // One page of blogs, the page count and the author's lifetime stats are
    // independent of each other, so they go together. The stats used to be
    // computed by pulling every blog the author has ever written - full article
    // bodies and all - into this route just to sum a few numbers; the database
    // can total them without sending the documents.
    const [blogs, totalBlogs, statsByStatus, commentTotal] = await Promise.all([
      Blog.find(query)
        .select(
          "title excerpt slug featuredImage author category tags status isPublished publishedAt views likes readingTime createdAt updatedAt",
        )
        .populate("author", "name avatar bio")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<Array<Record<string, unknown> & { _id: Types.ObjectId }>>(),
      Blog.countDocuments(query),
      Blog.aggregate([
        { $match: { author: authorId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            views: { $sum: { $ifNull: ["$views", 0] } },
            likes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          },
        },
      ]),
      Blog.aggregate([
        { $match: { author: authorId } },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blog",
            as: "commentDetails",
          },
        },
        { $project: { commentCount: { $size: "$commentDetails" } } },
        { $group: { _id: null, totalComments: { $sum: "$commentCount" } } },
      ]),
    ]);

    // Comment counts for this page, in one grouped query rather than one
    // aggregation per blog on the page.
    const commentCounts = await Comment.aggregate<{
      _id: Types.ObjectId;
      count: number;
    }>([
      { $match: { blog: { $in: blogs.map((blog) => blog._id) } } },
      { $group: { _id: "$blog", count: { $sum: 1 } } },
    ]);

    const countByBlog = new Map(
      commentCounts.map((entry) => [entry._id.toString(), entry.count]),
    );

    const blogsWithCommentCounts = blogs.map((blog) => ({
      ...blog,
      commentCount: countByBlog.get(blog._id.toString()) || 0,
    }));

    const totalPages = Math.ceil(totalBlogs / limit);

    const statTotals = statsByStatus.reduce(
      (totals, group) => ({
        totalBlogs: totals.totalBlogs + group.count,
        totalViews: totals.totalViews + group.views,
        totalLikes: totals.totalLikes + group.likes,
        publishedBlogs:
          totals.publishedBlogs + (group._id === "published" ? group.count : 0),
        draftBlogs:
          totals.draftBlogs + (group._id === "draft" ? group.count : 0),
      }),
      {
        totalBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
      },
    );

    const response = {
      blogs: blogsWithCommentCounts,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats: {
        ...statTotals,
        totalComments: commentTotal[0]?.totalComments || 0,
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Get my blogs error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return NextResponse.json(
          { error: "Database connection failed. Please try again later." },
          { status: 503 },
        );
      }

      if (error.message.includes("MONGODB_URI")) {
        return NextResponse.json(
          { error: "Database configuration error" },
          { status: 500 },
        );
      }

      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Request timeout. Please try again." },
          { status: 408 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch your blogs. Please try again later." },
      { status: 500 },
    );
  }
}

export const GET = requireAuth(getMyBlogsHandler);
