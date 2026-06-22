"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRazorpay } from "@/hooks/useRazorpay";
import {
  Heart,
  Users,
  Target,
  CheckCircle,
  CreditCard,
  Smartphone,
  QrCode,
  Copy,
  ArrowRight,
  Book,
  Shield,
  Globe,
} from "lucide-react";

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [copied, setCopied] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);
  const [donorDetails, setDonorDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const { initiatePayment, isLoading } = useRazorpay();

  const predefinedAmounts = [100, 250, 500, 1000, 2500, 5000];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 1) {
      alert("Please select or enter a valid amount");
      return;
    }

    await initiatePayment({
      amount: finalAmount,
      currency: "INR",
      isMonthly,
      name: donorDetails.name,
      email: donorDetails.email,
      phone: donorDetails.phone,
      notes: {
        paymentMethod,
        source: "donate_page",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <Heart className="h-8 w-8 text-white" fill="currentColor" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Support Our Mission
            </h1>

            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-orange-50">
              Help us preserve and share the timeless wisdom of Sanatan Dharma
              with seekers around the world
            </p>

            <div className="flex flex-wrap gap-6 justify-center items-center">
              <div className="flex items-center space-x-2 text-white/90">
                <Users className="h-5 w-5" />
                <span className="font-medium">10,000+ Readers</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <Book className="h-5 w-5" />
                <span className="font-medium">500+ Articles</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <Globe className="h-5 w-5" />
                <span className="font-medium">50+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
            <div className="text-sm text-gray-600 font-medium">
              Secure Payments
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">₹2.5L+</div>
            <div className="text-sm text-gray-600 font-medium">
              Total Raised
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
            <div className="text-sm text-gray-600 font-medium">
              Contributors
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">Tax</div>
            <div className="text-sm text-gray-600 font-medium">Deductible</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Choose Your Contribution
                </h2>
                <p className="text-gray-600">
                  Every contribution helps us preserve and share ancient wisdom
                </p>
              </div>

              {/* One-time vs Monthly Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                  <button
                    onClick={() => setIsMonthly(false)}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${
                      !isMonthly
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setIsMonthly(true)}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${
                      isMonthly
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`relative p-4 rounded-lg font-semibold transition-all ${
                        selectedAmount === amount
                          ? "bg-orange-600 text-white shadow-md ring-2 ring-orange-600 ring-offset-2"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <div className="text-xl">₹{amount}</div>
                      {isMonthly && (
                        <div
                          className={`text-xs mt-1 ${selectedAmount === amount ? "text-orange-100" : "text-gray-500"}`}
                        >
                          /month
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none font-semibold placeholder:text-gray-400 placeholder:font-normal text-gray-900"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Payment Method
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "upi"
                        ? "border-orange-600 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          paymentMethod === "upi"
                            ? "bg-orange-600"
                            : "bg-gray-100"
                        }`}
                      >
                        <Smartphone
                          className={`h-5 w-5 ${paymentMethod === "upi" ? "text-white" : "text-gray-600"}`}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">UPI</div>
                        <div className="text-xs text-gray-500">
                          Instant payment
                        </div>
                      </div>
                    </div>
                    {paymentMethod === "upi" && (
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    )}
                  </label>

                  <label
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-orange-600 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          paymentMethod === "card"
                            ? "bg-orange-600"
                            : "bg-gray-100"
                        }`}
                      >
                        <CreditCard
                          className={`h-5 w-5 ${paymentMethod === "card" ? "text-white" : "text-gray-600"}`}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Card</div>
                        <div className="text-xs text-gray-500">
                          Credit/Debit
                        </div>
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    )}
                  </label>
                </div>
              </div>

              {/* UPI Details */}
              {paymentMethod === "upi" && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg inline-block mb-4 border border-gray-200">
                      <Image
                        src="/QrCode.png"
                        alt="UPI QR Code - Scan to pay"
                        width={256}
                        height={256}
                        className="rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      Scan QR Code with any UPI App
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-500 mb-2">
                        Or use UPI Link:
                      </div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <a
                          href="https://razorpay.me/@vedicsanatanblogsuse"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm font-semibold text-orange-600 hover:text-orange-700 break-all underline"
                        >
                          razorpay.me/@vedicsanatanblogsuse
                        </a>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Or UPI ID:
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-base font-semibold text-gray-900 break-all">
                          sanatanblogs@paytm
                        </span>
                        <button
                          onClick={() => copyToClipboard("sanatanblogs@paytm")}
                          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 font-medium flex-shrink-0 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="text-sm">
                            {copied ? "Copied!" : "Copy"}
                          </span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Or click the donate button below to pay via Razorpay
                    </p>
                  </div>
                </div>
              )}

              {/* Donor Details */}
              <div className="mb-8 space-y-4">
                <label className="block text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Your Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={donorDetails.name}
                  onChange={(e) =>
                    setDonorDetails({ ...donorDetails, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-gray-900 placeholder:text-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={donorDetails.email}
                  onChange={(e) =>
                    setDonorDetails({ ...donorDetails, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-gray-900 placeholder:text-gray-400"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={donorDetails.phone}
                  onChange={(e) =>
                    setDonorDetails({ ...donorDetails, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                disabled={isLoading}
                className="w-full bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-orange-700 transition-colors shadow-sm flex items-center justify-center space-x-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart className="h-5 w-5" />
                <span>
                  {isLoading
                    ? "Processing..."
                    : `Donate ₹${finalAmount || 0}${isMonthly ? "/month" : ""}`}
                </span>
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </button>

              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure payment • SSL encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Column - Impact & Information */}
          <div className="space-y-6">
            {/* Impact Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Your Impact
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  See how your contribution makes a difference
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">₹100</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                      Server Costs
                    </h4>
                    <p className="text-xs text-gray-600">
                      Keeps the platform running for 1 day
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">₹500</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                      Content Creation
                    </h4>
                    <p className="text-xs text-gray-600">
                      Supports research and 5 articles
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">₹1K</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                      Development
                    </h4>
                    <p className="text-xs text-gray-600">
                      Platform features & improvements
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">₹2.5K</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                      Community Events
                    </h4>
                    <p className="text-xs text-gray-600">
                      Workshops and discussions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Donate Section */}
            <div className="bg-orange-600 text-white rounded-lg shadow-sm p-6">
              <div className="mb-5">
                <h3 className="text-xl font-bold mb-2">
                  Why Your Support Matters
                </h3>
                <p className="text-orange-100 text-sm">
                  Together we preserve ancient wisdom
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white">
                    Preserve ancient wisdom for future generations
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white">
                    Create quality spiritual content
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white">
                    Build a global spiritual community
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white">
                    Provide free access to all resources
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white">
                    Support independent spiritual content
                  </span>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Common Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    Is my donation secure?
                  </h4>
                  <p className="text-xs text-gray-600">
                    Yes, all payments are encrypted and processed through secure
                    gateways.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    Can I get a receipt?
                  </h4>
                  <p className="text-xs text-gray-600">
                    Yes, you&apos;ll receive an email receipt after your
                    donation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    Can I cancel monthly donations?
                  </h4>
                  <p className="text-xs text-gray-600">
                    Yes, you can cancel anytime from your account settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900 rounded-lg p-10 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Join Our Community
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
              Become part of a movement preserving and sharing the wisdom of
              Sanatan Dharma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/blogs"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Explore Content
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
