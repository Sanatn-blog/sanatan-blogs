import Link from 'next/link';
import { 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart,
  ArrowUp,
  BookOpen,
  Users,
  Globe,
  Send,
  Bell,
  Sparkles,
  PenTool,
  Star,
  ArrowRight,
  BookMarked,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { subscribe, isSubmitting, message } = useSubscription();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    const result = await subscribe(email, 'footer');
    if (result.success || result.alreadySubscribed || result.resubscribed) {
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute top-1/4 right-0 w-24 h-24 bg-white rounded-full translate-x-12"></div>
          <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon and Title */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-gray-900" />
              </div>
            </div>
          </div>
          
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Stay Connected with{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              Sanatan Blogs
            </span>
          </h3>
          
          <p className="text-lg md:text-xl text-orange-50 mb-10 max-w-3xl mx-auto leading-relaxed">
            Subscribe to our newsletter and get the latest spiritual articles, insights, and updates delivered to your inbox. 
            <span className="block text-orange-100 text-base mt-2">
              Join 10,000+ spiritual seekers on their journey of wisdom.
            </span>
          </p>
          
          {/* Enhanced Form */}
          <form onSubmit={handleNewsletterSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all duration-300 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Message Display */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                message.includes('already subscribed') || message.includes('Thank you') || message.includes('Welcome back')
                  ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                  : 'bg-red-500/20 text-red-100 border border-red-400/30'
              }`}>
                {message}
              </div>
            )}
            
            {/* Trust Indicators */}
            <div className="mt-6 flex items-center justify-center space-x-6 text-orange-100 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Ready to Share Your Story Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <PenTool className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-gray-900" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Share Your{' '}
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Story?
                </span>
              </h3>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Join our community of spiritual writers and share your wisdom with thousands of seekers. 
                Your voice matters in spreading the timeless knowledge of Sanatan Dharma.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/write-blog"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <PenTool className="mr-2 h-5 w-5" />
                  Start Writing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-4 border-2 border-orange-400 text-orange-400 rounded-xl font-bold hover:bg-orange-400 hover:text-white transition-all duration-300"
                >
                  Join Community
                </Link>
              </div>
            </div>
            
            {/* Right Content - Benefits */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookMarked className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Quality Content Platform</h4>
                    <p className="text-gray-300">Create beautiful, SEO-optimized articles with image uploads and rich formatting.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Engaged Community</h4>
                    <p className="text-gray-300">Connect with 10,000+ spiritual seekers and build meaningful relationships.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Grow Your Audience</h4>
                    <p className="text-gray-300">Reach readers worldwide and establish yourself as a thought leader.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-white">SB</span>
                </div>
                <h3 className="text-2xl font-bold">सनातन Blogs</h3>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                A platform dedicated to sharing the timeless wisdom of Sanatan Dharma through authentic storytelling and meaningful conversations.
              </p>
              
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-orange-400">Explore</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/blogs" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>All Blogs</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Categories</span>
                  </Link>
                </li>
                <li>
                  <Link href="/authors" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Authors</span>
                  </Link>
                </li>
                <li>
                  <Link href="/write-blog" className="text-gray-400 hover:text-white transition-colors">
                    Write Article
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-orange-400">Categories</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/blogs?category=Spirituality" className="text-gray-400 hover:text-white transition-colors">
                    Spirituality
                  </Link>
                </li>
                <li>
                  <Link href="/blogs?category=Yoga" className="text-gray-400 hover:text-white transition-colors">
                    Yoga & Meditation
                  </Link>
                </li>
                <li>
                  <Link href="/blogs?category=Philosophy" className="text-gray-400 hover:text-white transition-colors">
                    Philosophy
                  </Link>
                </li>
                <li>
                  <Link href="/blogs?category=Culture" className="text-gray-400 hover:text-white transition-colors">
                    Culture & Traditions
                  </Link>
                </li>
                <li>
                  <Link href="/blogs?category=Health" className="text-gray-400 hover:text-white transition-colors">
                    Health & Wellness
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-orange-400">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="text-gray-400 hover:text-white transition-colors">
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-gray-800 rounded-2xl p-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">10,000+</div>
                <div className="text-gray-400">Active Readers</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">500+</div>
                <div className="text-gray-400">Articles Published</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">100+</div>
                <div className="text-gray-400">Expert Authors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-1">
                <span>&copy; 2025 Sanatan Blogs. All rights reserved.</span>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center space-x-1">
                  <span>Made with</span>
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                  <span>for the community</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={scrollToTop}
              className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full transition-colors shadow-lg"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
} 