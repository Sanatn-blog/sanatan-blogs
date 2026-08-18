import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateSecureAccessToken, generateRefreshToken } from "@/lib/jwt";
import { rateLimit } from "@/middleware/auth";

async function loginHandler(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { emailOrUsername, password } = body;

    // Basic validation
    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: "Email or user ID and password are required" },
        { status: 400 },
      );
    }

    // Find the user by id, username or email. These used to be three separate
    // awaited queries tried in order, so an email login - the common case -
    // always paid for a username lookup that missed first. One $or does the
    // same job in a single round trip.
    const identifier = emailOrUsername.toLowerCase();
    const branches: Record<string, string>[] = [
      { username: identifier },
      { email: identifier },
    ];

    if (/^[0-9a-fA-F]{24}$/.test(emailOrUsername)) {
      branches.unshift({ _id: emailOrUsername });
    }

    const user = await User.findOne({ $or: branches }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User not found. Please check your email, username, or user ID.",
        },
        { status: 401 },
      );
    }

    // Check if user is approved and verified
    if (user.status === "rejected") {
      return NextResponse.json(
        { error: "Your account has been rejected. Please contact admin." },
        { status: 403 },
      );
    } else if (user.status === "suspended") {
      return NextResponse.json(
        { error: "Your account has been suspended. Please contact admin." },
        { status: 403 },
      );
    } else if (user.status === "pending" && !user.emailVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email address before logging in.",
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 },
      );
    } else if (user.status === "pending") {
      // For testing purposes, we'll allow pending users to log in
      // In production, you should remove this and require approval
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Invalid password. Please check your password and try again.",
        },
        { status: 401 },
      );
    }

    // Update last login without triggering validation
    try {
      await User.findByIdAndUpdate(
        user._id,
        { lastLogin: new Date() },
        { new: true },
      );
    } catch (updateError) {
      console.log(
        "[WARN] Failed to update lastLogin, but continuing with login:",
        updateError,
      );
      // Continue with login even if lastLogin update fails
    }

    // Generate tokens with password hash for additional security
    const accessToken = generateSecureAccessToken(
      user._id.toString(),
      user.password,
    );
    const refreshToken = generateRefreshToken(user._id.toString());

    // Prepare user response (without sensitive data)
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

    // Set secure HTTP-only cookies for tokens
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userResponse,
        accessToken,
      },
      { status: 200 },
    );

    // Set refresh token as HTTP-only cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[ERROR] Login error:", error);

    // Handle specific validation errors
    if (
      error instanceof Error &&
      error.message.includes("User validation failed")
    ) {
      return NextResponse.json(
        { error: "Account validation error. Please contact support." },
        { status: 400 },
      );
    }

    // Handle other specific errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Login failed. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}

// Apply rate limiting (10 login attempts per 15 minutes per IP)
export const POST = rateLimit(10, 15 * 60 * 1000)(loginHandler);
