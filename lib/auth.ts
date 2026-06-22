import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";
import connectDB from "./mongodb";
import User from "@/models/User";

export interface AuthResult {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    status: string;
  } | null;
  error?: string;
}

/**
 * Verify authentication from request
 * Checks for Authorization header or access_token cookie
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("access_token")?.value;

    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      return {
        isAuthenticated: false,
        error: "No authentication token provided",
      };
    }

    // Verify JWT token
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return {
        isAuthenticated: false,
        error: "Invalid or expired token",
      };
    }

    // Get user from database
    await connectDB();
    const user = await User.findById(decoded.userId)
      .select("email role status")
      .lean();

    if (!user) {
      return {
        isAuthenticated: false,
        error: "User not found",
      };
    }

    // Type assertion for the lean document
    const userData = user as any;

    return {
      isAuthenticated: true,
      user: {
        id: decoded.userId,
        email: userData.email,
        role: userData.role,
        status: userData.status,
      },
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return {
      isAuthenticated: false,
      error: "Authentication failed",
    };
  }
}

/**
 * Verify if user is admin
 */
export async function verifyAdmin(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request);

  if (!authResult.isAuthenticated) {
    return authResult;
  }

  if (authResult.user?.role !== "admin") {
    return {
      isAuthenticated: false,
      error: "Admin access required",
    };
  }

  return authResult;
}
