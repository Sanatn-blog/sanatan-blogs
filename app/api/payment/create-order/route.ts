import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { razorpayInstance } from "@/lib/razorpay";
import { validateAmount, rupeesToPaise } from "@/lib/currency";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      amount,
      currency = "INR",
      isMonthly = false,
      email,
      name,
      phone,
      notes,
    } = body;

    // Validate amount
    const validation = validateAmount(amount);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Generate unique order ID
    const orderId = `order_${crypto.randomBytes(12).toString("hex")}`;

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: rupeesToPaise(amount), // Convert to paise
      currency,
      receipt: orderId,
      notes: {
        ...notes,
        isMonthly: isMonthly.toString(),
        email: email || "",
        name: name || "",
      },
    });

    // Save payment record in database
    const payment = await Payment.create({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency,
      status: "created",
      email,
      name,
      phone,
      isMonthly,
      notes,
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 },
    );
  }
}
