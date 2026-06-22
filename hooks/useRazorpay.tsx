"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface PaymentDetails {
  amount: number;
  currency?: string;
  isMonthly?: boolean;
  email?: string;
  name?: string;
  phone?: string;
  notes?: Record<string, any>;
}

interface UseRazorpayReturn {
  initiatePayment: (details: PaymentDetails) => Promise<void>;
  isLoading: boolean;
}

export const useRazorpay = (): UseRazorpayReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast.error("Failed to load payment gateway");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = async (details: PaymentDetails) => {
    if (!isScriptLoaded) {
      toast.error("Payment gateway is loading. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || "Failed to create order");
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sanatan Blogs",
        description: details.isMonthly
          ? "Monthly Donation"
          : "One-time Donation",
        image: "/logo.png",
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          await handlePaymentSuccess(response);
        },
        prefill: {
          name: details.name,
          email: details.email,
          contact: details.phone,
        },
        notes: details.notes,
        theme: {
          color: "#ea580c",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast("Payment cancelled", { icon: "ℹ️" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        toast.error("Payment failed. Please try again.");
        setIsLoading(false);
      });
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast.error(error.message || "Failed to initiate payment");
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    try {
      // Verify payment
      const verifyResponse = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.error || "Payment verification failed");
      }

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        toast.success("Payment successful! Thank you for your support! 🙏");
        // Optionally redirect or update UI
        setTimeout(() => {
          window.location.href = "/donate/success";
        }, 2000);
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      toast.error(error.message || "Payment verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
  };
};
