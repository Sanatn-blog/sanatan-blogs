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
  Send
} from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-600 to-pink-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay Connected with Sanatan Blogs
          </h3>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest spiritual articles, insights, and updates delivered to your inbox.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Subscribe</span>
            </button>
          </form>
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
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              <p className="flex items-center justify-center md:justify-start space-x-1">
                <span>&copy; 2025 Sanatan Blogs. All rights reserved.</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <span>Made with</span>
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                  <span>for the community</span>
                </span>
              </p>
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