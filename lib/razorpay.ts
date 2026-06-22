import Razorpay from "razorpay";

// Lazy initialization of Razorpay instance
let razorpayInstanceCache: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay credentials are not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.",
    );
  }

  if (!razorpayInstanceCache) {
    razorpayInstanceCache = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstanceCache;
}

// For backward compatibility - uses Proxy for lazy initialization
export const razorpayInstance = new Proxy({} as Razorpay, {
  get: (target, prop) => {
    const instance = getRazorpayInstance();
    return (instance as any)[prop];
  },
});

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  get key_id() {
    return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  },
  currency: "INR",
  name: "Sanatan Blogs",
  description: "Support our mission to preserve ancient wisdom",
  image: "/logo.png", // Update with your actual logo path
  theme: {
    color: "#ea580c", // Orange-600
  },
};
