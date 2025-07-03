'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Crown,
  Gift
} from 'lucide-react';

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [copied, setCopied] = useState(false);

  const predefinedAmounts = [100, 250, 500, 1000, 2500, 5000];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Heart className="h-10 w-10 text-white animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Contribute to Our Work
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Help us spread the wisdom of <span className="font-bold">Sanatan Dharma</span> and build a platform
              that connects millions of hearts to their spiritual roots
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="h-5 w-5" />
                <span className="font-semibold">10,000+ Active Readers</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Book className="h-5 w-5" />
                <span className="font-semibold">500+ Articles Published</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column - Donation Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Make a Donation</h2>
                <p className="text-gray-600">Every contribution helps us grow and serve better</p>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Choose Amount (₹)
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
                        selectedAmount === amount
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                  />
                  <span className="absolute left-4 top-4 text-gray-500 font-semibold">₹</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      paymentMethod === 'upi' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'upi' && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                    </div>
                    <Smartphone className="h-6 w-6 text-orange-600 mr-3" />
                    <span className="font-semibold text-gray-900">UPI Payment</span>
                    <span className="ml-auto text-sm text-gray-500">Instant & Secure</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      paymentMethod === 'card' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'card' && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                    </div>
                    <CreditCard className="h-6 w-6 text-orange-600 mr-3" />
                    <span className="font-semibold text-gray-900">Credit/Debit Card</span>
                    <span className="ml-auto text-sm text-gray-500">All cards accepted</span>
                  </label>
                </div>
              </div>

              {/* UPI Details */}
              {paymentMethod === 'upi' && (
                <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-200">
                  <div className="text-center">
                    <QrCode className="h-32 w-32 mx-auto mb-4 text-orange-600" />
                    <p className="text-sm text-gray-600 mb-4">Scan QR Code or use UPI ID</p>
                    <div className="bg-white p-4 rounded-xl border border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-lg font-semibold text-gray-900">
                          sanatanblogs@paytm
                        </span>
                        <button
                          onClick={() => copyToClipboard('sanatanblogs@paytm')}
                          className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          <Copy className="h-4 w-4" />
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Donate Button */}
              <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3">
                <Heart className="h-6 w-6" />
                <span>Donate ₹{finalAmount || 0}</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  🔒 Your donation is secure and protected
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Impact & Information */}
          <div className="space-y-8">
            
            {/* Impact Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Impact</h3>
                <p className="text-gray-600">See how your contribution makes a difference</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₹100</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Server Maintenance</h4>
                    <p className="text-sm text-gray-600">Keeps our platform running smoothly for 1 day</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₹500</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Content Creation</h4>
                    <p className="text-sm text-gray-600">Supports research and writing of 5 quality articles</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₹1000</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Platform Development</h4>
                    <p className="text-sm text-gray-600">Adds new features and improves user experience</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₹2500</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Community Events</h4>
                    <p className="text-sm text-gray-600">Organizes spiritual workshops and discussions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Donate Section */}
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-3xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Why Your Support Matters</h3>
                <p className="text-orange-100">Together, we&apos;re building something special</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                  <span>Preserve and share ancient wisdom for future generations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                  <span>Create high-quality spiritual content in Hindi & English</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                  <span>Build a community of like-minded spiritual seekers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                  <span>Provide free access to all spiritual resources</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                  <span>Support independent spiritual journalism</span>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">What Our Supporters Say</h3>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      P
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    &ldquo;This platform has been my spiritual guide. The quality of content is exceptional, 
                    and I&apos;m happy to contribute to this noble cause.&rdquo;
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      R
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">Raj Patel</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    &ldquo;Supporting this initiative feels like investing in our cultural heritage. 
                    Every rupee goes towards spreading positivity and wisdom.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="text-center">
                <Share2 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Spread the Word</h3>
                <p className="text-gray-600 mb-6">
                  Can&apos;t donate? Help us by sharing our mission with your friends and family.
                </p>
                <div className="flex justify-center space-x-4">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                    Share on Facebook
                  </button>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
                    Share on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white">
            <Crown className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-4">
              Join Our Community of Supporters
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Become part of a movement that&apos;s preserving and sharing the timeless wisdom of Sanatan Dharma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Join Our Community
              </Link>
              <Link
                href="/blogs"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-orange-600 transition-colors"
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