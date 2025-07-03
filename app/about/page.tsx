import { Shield, Users, BookOpen, Heart, Target, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About 
            <span className="text-orange-600"> Sanatan Blogs</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
            A platform dedicated to authentic storytelling, meaningful conversations, 
            and building a community of thoughtful writers and readers.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At Sanatan Blogs, we believe in the power of authentic storytelling. 
                Our mission is to create a secure, welcoming space where writers can 
                share their thoughts, experiences, and knowledge with a global community.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We are committed to maintaining high-quality content through our 
                thoughtful approval process while ensuring every voice has the 
                opportunity to be heard.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-600 text-white rounded-lg">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quality First</h3>
                  <p className="text-gray-600">Every post is carefully reviewed to maintain our standards</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-200 to-yellow-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-24 w-24 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
                  <p className="text-gray-600">Stories Shared</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These values guide everything we do and shape our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-lg mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Security & Trust
              </h3>
              <p className="text-gray-600">
                We prioritize user safety with robust security measures, 
                admin approval systems, and transparent moderation policies.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-lg mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Community First
              </h3>
              <p className="text-gray-600">
                Our community is at the heart of everything. We foster 
                meaningful connections and respectful dialogue among all members.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-lg mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Excellence
              </h3>
              <p className="text-gray-600">
                We strive for excellence in content quality, user experience, 
                and platform reliability to serve our community better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Sanatan Blogs Works
            </h2>
            <p className="text-xl text-gray-600">
              A simple, secure process to ensure quality content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Register
              </h3>
              <p className="text-gray-600">
                Create your account with your basic information and tell us about yourself
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Admin Review
              </h3>
              <p className="text-gray-600">
                Our admin team reviews your application to ensure community standards
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Writing
              </h3>
              <p className="text-gray-600">
                Once approved, unleash your creativity and start sharing your stories
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-full text-2xl font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Build Community
              </h3>
              <p className="text-gray-600">
                Engage with readers, receive feedback, and grow your audience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🔒 Secure Authentication
              </h3>
              <p className="text-gray-600">
                JWT-based authentication with secure password hashing and session management
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📝 Rich Text Editor
              </h3>
              <p className="text-gray-600">
                Create beautiful content with our advanced editor supporting images and formatting
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🖼️ Image Management
              </h3>
              <p className="text-gray-600">
                Upload and manage images with Cloudinary integration for optimal performance
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📊 SEO Optimization
              </h3>
              <p className="text-gray-600">
                Built-in SEO tools to help your content reach a wider audience
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                👥 User Management
              </h3>
              <p className="text-gray-600">
                Comprehensive user roles and permissions with admin approval workflow
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📱 Mobile Responsive
              </h3>
              <p className="text-gray-600">
                Fully responsive design that works perfectly on all devices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-lg mb-6">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Ready to share your voice with the world? Join thousands of writers 
            who trust Sanatan Blogs to share their stories and connect with readers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
            <a
              href="mailto:admin@sanatanblogs.com"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 