import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

async function checkExistsHandler(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const phoneNumber = searchParams.get("phoneNumber");
    const username = searchParams.get("username");

    const results: {
      email?: boolean;
      phoneNumber?: boolean;
      username?: boolean;
    } = {};

    // Check email if provided
    if (email) {
      const existingUserByEmail = await User.findOne({
        email: email.toLowerCase(),
      });
      results.email = !!existingUserByEmail;
    }

    // Check phone number if provided
    if (phoneNumber) {
      const existingUserByPhone = await User.findOne({
        phoneNumber: phoneNumber.trim(),
      });
      results.phoneNumber = !!existingUserByPhone;
    }

    // Check username if provided
    if (username) {
      const existingUserByUsername = await User.findOne({
        username: username.toLowerCase(),
      });
      results.username = !!existingUserByUsername;
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Check exists error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("connection")
      ) {
        return NextResponse.json(
          { error: "Database connection failed. Please try again later." },
          { status: 503 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 },
    );
  }
}

export const GET = checkExistsHandler;
