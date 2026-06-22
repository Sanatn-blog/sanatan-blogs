import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  _id: string;
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: "created" | "attempted" | "paid" | "failed";
  paymentMethod?: string;
  email?: string;
  name?: string;
  phone?: string;
  userId?: mongoose.Types.ObjectId;
  isMonthly: boolean;
  subscriptionId?: string;
  notes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["created", "attempted", "paid", "failed"],
      default: "created",
      index: true,
    },
    paymentMethod: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    isMonthly: {
      type: Boolean,
      default: false,
    },
    subscriptionId: {
      type: String,
      index: true,
    },
    notes: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ email: 1, createdAt: -1 });

// Simple model registration
const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
