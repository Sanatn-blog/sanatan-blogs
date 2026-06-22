import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    // Handle different event types
    switch (eventType) {
      case "payment.authorized":
      case "payment.captured":
        await handlePaymentSuccess(payload.payment.entity);
        break;

      case "payment.failed":
        await handlePaymentFailed(payload.payment.entity);
        break;

      case "order.paid":
        await handleOrderPaid(payload.order.entity);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handlePaymentSuccess(paymentEntity: any) {
  try {
    const payment = await Payment.findOne({
      razorpayOrderId: paymentEntity.order_id,
    });

    if (payment) {
      payment.razorpayPaymentId = paymentEntity.id;
      payment.status = "paid";
      payment.paymentMethod = paymentEntity.method;
      await payment.save();
      console.log(`Payment ${paymentEntity.id} marked as paid`);
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentFailed(paymentEntity: any) {
  try {
    const payment = await Payment.findOne({
      razorpayOrderId: paymentEntity.order_id,
    });

    if (payment) {
      payment.razorpayPaymentId = paymentEntity.id;
      payment.status = "failed";
      await payment.save();
      console.log(`Payment ${paymentEntity.id} marked as failed`);
    }
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

async function handleOrderPaid(orderEntity: any) {
  try {
    const payment = await Payment.findOne({
      razorpayOrderId: orderEntity.id,
    });

    if (payment && payment.status !== "paid") {
      payment.status = "paid";
      await payment.save();
      console.log(`Order ${orderEntity.id} marked as paid`);
    }
  } catch (error) {
    console.error("Error handling order paid:", error);
  }
}
