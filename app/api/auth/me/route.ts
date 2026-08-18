import { NextResponse } from "next/server";
import { requireAuth, AuthenticatedRequest } from "@/middleware/auth";

// Force dynamic rendering and disable caching for fresh user data
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCurrentUserHandler(request: AuthenticatedRequest) {
  try {
    // requireAuth has already read this user from the database on this same
    // request, with exactly the fields returned below. Reading it a second time
    // here doubled the cost of the endpoint the whole site calls on every page
    // load, for data that cannot have changed in between.
    const user = request.user;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user without sensitive information
    const userResponse = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      bio: user.bio,
      socialLinks: user.socialLinks,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      user: userResponse,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Failed to get user information" },
      { status: 500 },
    );
  }
}

export const GET = requireAuth(getCurrentUserHandler);
