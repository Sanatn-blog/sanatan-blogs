"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Users,
  Target,
  CheckCircle,
  Star,
  CreditCard,
  Smartphone,
  QrCode,
  Copy,
  Share2,
  ArrowRight,
  Sparkles,
  Book,
  Shield,
  Zap,
  TrendingUp,
  Award,
  Globe,
} from "lucide-react";

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [copied, setCopied] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-pink-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full mb-6 backdrop-blur-lg border-2 border-white/20 shadow-2xl">
              <Heart
                className="h-10 w-10 sm:h-12 sm:w-12 text-white animate-pulse"
                fill="currentColor"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Empower Spiritual Growth
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed font-light">
              Join us in preserving and sharing the timeless wisdom of{" "}
              <span className="font-bold text-yellow-300">Sanatan Dharma</span>{" "}
              with the world
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
              <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full border border-white/20">
                <Users className="h-5 w-5" />
                <span className="font-semibold">10,000+ Readers</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full border border-white/20">
                <Book className="h-5 w-5" />
                <span className="font-semibold">500+ Articles</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full border border-white/20">
                <Globe className="h-5 w-5" />
                <span className="font-semibold">50+ Countries</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-orange-50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">100%</div>
            <div className="text-sm text-gray-600">Secure</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">₹2.5L+</div>
            <div className="text-sm text-gray-600">Raised</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
            <div className="text-sm text-gray-600">Supporters</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Award className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">4.9/5</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left Column - Donation Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 sticky top-4">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Make Your Contribution
                </h2>
                <p className="text-gray-600">
                  Choose an amount that resonates with your heart
                </p>
              </div>

              {/* One-time vs Monthly Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gray-100 rounded-full p-1 inline-flex">
                  <button
                    onClick={() => setIsMonthly(false)}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                      !isMonthly
                        ? "bg-white text-orange-600 shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setIsMonthly(true)}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                      isMonthly
                        ? "bg-white text-orange-600 shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Monthly
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      2x Impact
                    </span>
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-5">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`relative p-5 rounded-2xl font-bold transition-all duration-300 group ${
                        selectedAmount === amount
                          ? "bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-xl scale-105 ring-4 ring-orange-200"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-orange-50 hover:to-pink-50 hover:shadow-lg hover:scale-102"
                      }`}
                    >
                      <div className="text-2xl">₹{amount}</div>
                      {isMonthly && (
                        <div
                          className={`text-xs mt-1 ${selectedAmount === amount ? "text-orange-100" : "text-gray-500"}`}
                        >
                          /month
                        </div>
                      )}
                      {selectedAmount === amount && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none text-xl font-bold placeholder:text-gray-400 placeholder:font-normal transition-all"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-5">
                  Payment Method
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === "upi"
                        ? "border-orange-500 bg-orange-50 shadow-lg"
                        : "border-gray-200 hover:border-orange-300 hover:shadow-md"
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
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          paymentMethod === "upi"
                            ? "bg-orange-500"
                            : "bg-gray-100"
                        }`}
                      >
                        <Smartphone
                          className={`h-6 w-6 ${paymentMethod === "upi" ? "text-white" : "text-gray-600"}`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">UPI</div>
                        <div className="text-sm text-gray-500">Instant</div>
                      </div>
                    </div>
                    {paymentMethod === "upi" && (
                      <CheckCircle className="h-6 w-6 text-orange-500 absolute top-3 right-3" />
                    )}
                  </label>

                  <label
                    className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-orange-500 bg-orange-50 shadow-lg"
                        : "border-gray-200 hover:border-orange-300 hover:shadow-md"
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
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          paymentMethod === "card"
                            ? "bg-orange-500"
                            : "bg-gray-100"
                        }`}
                      >
                        <CreditCard
                          className={`h-6 w-6 ${paymentMethod === "card" ? "text-white" : "text-gray-600"}`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Card</div>
                        <div className="text-sm text-gray-500">All cards</div>
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <CheckCircle className="h-6 w-6 text-orange-500 absolute top-3 right-3" />
                    )}
                  </label>
                </div>
              </div>

              {/* UPI Details */}
              {paymentMethod === "upi" && (
                <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-200">
                  <div className="text-center">
                    <div className="bg-white p-6 rounded-2xl inline-block mb-4 shadow-md">
                      <QrCode className="h-32 w-32 text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      Scan QR Code or use UPI ID
                    </p>
                    <div className="bg-white p-4 rounded-xl border-2 border-orange-300 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-lg font-bold text-gray-900 break-all">
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
                  </div>
                </div>
              )}

              {/* Donate Button */}
              <button className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-3 text-lg group">
                <Heart
                  className="h-6 w-6 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                />
                <span>
                  Donate ₹{finalAmount || 0}
                  {isMonthly ? "/month" : ""}
                </span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Shield className="h-4 w-4 text-green-600" />
                <span>
                  Secure payment powered by industry-leading encryption
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Impact & Information */}
          <div className="space-y-6">
            {/* Impact Section */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Impact
                </h3>
                <p className="text-gray-600">
                  See how your contribution makes a difference
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">₹100</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Server Maintenance
                    </h4>
                    <p className="text-sm text-gray-600">
                      Keeps platform running for 1 day
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">₹500</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Content Creation
                    </h4>
                    <p className="text-sm text-gray-600">
                      Supports 5 quality articles
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">₹1K</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Platform Development
                    </h4>
                    <p className="text-sm text-gray-600">
                      New features & improvements
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">₹2.5K</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Community Events
                    </h4>
                    <p className="text-sm text-gray-600">
                      Spiritual workshops & discussions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Donate Section */}
            <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white rounded-3xl shadow-xl p-6">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Why Your Support Matters
                </h3>
                <p className="text-orange-100">
                  Building something special together
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Preserve ancient wisdom for future generations
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Create quality spiritual content in Hindi & English
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Build a community of spiritual seekers
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Provide free access to all resources
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Support independent spiritual journalism
                  </span>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
                  <Star className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  What Supporters Say
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      P
                    </div>
                    <div className="ml-3">
                      <h4 className="font-bold text-gray-900">Priya Sharma</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">
                    &ldquo;This platform has been my spiritual guide. The
                    quality of content is exceptional, and I&apos;m happy to
                    contribute to this noble cause.&rdquo;
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      R
                    </div>
                    <div className="ml-3">
                      <h4 className="font-bold text-gray-900">Raj Patel</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">
                    &ldquo;Supporting this initiative feels like investing in
                    our cultural heritage. Every rupee goes towards spreading
                    positivity and wisdom.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
                  <Share2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Spread the Word
                </h3>
                <p className="text-gray-600 mb-5 text-sm">
                  Can&apos;t donate? Help us by sharing our mission with your
                  friends and family.
                </p>
                <div className="flex flex-col gap-3">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg">
                    Share on Facebook
                  </button>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg">
                    Share on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-10 text-white shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm border-2 border-white/30">
              <Zap className="h-10 w-10 text-yellow-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Join Our Community of Supporters
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto font-light">
              Become part of a movement that&apos;s preserving and sharing the
              timeless wisdom of Sanatan Dharma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Join Our Community
              </Link>
              <Link
                href="/blogs"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-orange-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Explore Our Content
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
