'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy
} from 'lucide-react';

// Mock data - Replace with actual API call
const mockBlog = {
  _id: '1',
  title: 'Timeless Wisdom from Gita: Finding Peace in Life',
  content: `
    <div class="prose max-w-none">
      <p class="lead">The Bhagavad Gita is a precious gem of Indian philosophy that provides guidance in every aspect of life. In this article, we will understand some important verses of the Gita that help bring peace and satisfaction in life.</p>
      
      <h2>The Principle of Karma</h2>
      <blockquote class="border-l-4 border-orange-500 pl-4 italic text-gray-700 my-6">
        "You have the right to perform your prescribed duty, but not to the fruits of action.<br>
        Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty."
      </blockquote>
      
      <p>This verse teaches us that our right is only in doing karma, not in the results. When we leave the worry of results and follow our duty, peace comes to the mind.</p>
      
      <h2>Immortality of the Soul</h2>
      <p>In the Gita, Lord Krishna explains to Arjuna that the soul is immortal. This knowledge liberates from the fear of death and gives life a new perspective.</p>
      
      <h2>Importance of Yoga</h2>
      <p>In the Gita, yoga is described as the art of living life. Yoga means balance - in action, in food, in sleep, and in contemplation.</p>
      
      <h2>Conclusion</h2>
      <p>These teachings of the Gita are as relevant today as they were thousands of years ago. By adopting them in our lives, we can find peace and happiness.</p>
    </div>
  `,
  excerpt: 'Learn from the verses of Bhagavad Gita how to find peace and satisfaction in life.',
  author: {
    _id: 'author1',
    name: 'Ram Sharma',
    bio: 'Spiritual Writer and Yoga Teacher',
    avatar: '/avatar1.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/ramsharma',
      linkedin: 'https://linkedin.com/in/ramsharma'
    }
  },
  featuredImage: '/blog1.jpg',
  category: 'Spirituality',
  tags: ['Gita', 'Peace', 'Life', 'Yoga', 'Karma'],
  publishedAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  readingTime: '5 min',
  views: 1250,
  likes: 89,
  bookmarks: 45,
  comments: 12,
  featured: true,
  status: 'published',
  seo: {
    metaTitle: 'Timeless Wisdom from Gita: Finding Peace in Life | Sanatan Blogs',
    metaDescription: 'Learn from the verses of Bhagavad Gita how to find peace and satisfaction in life. Deep discussion on Karma Yoga and spiritual knowledge.',
    keywords: ['Bhagavad Gita', 'Spirituality', 'Yoga', 'Peace', 'Life Philosophy', 'Karma Yoga']
  }
};

const relatedBlogs = [
  {
    _id: '2',
    title: 'Yoga and Meditation: Foundation of Healthy Living',
    excerpt: 'How to improve your life with the power of yoga and meditation.',
    featuredImage: '/blog2.jpg',
    category: 'Yoga',
    readingTime: '7 min'
  },
  {
    _id: '3',
    title: 'Vedanta Philosophy: Search for Truth',
    excerpt: 'Understand and adopt the deep principles of Vedanta philosophy in life.',
    featuredImage: '/blog3.jpg',
    category: 'Philosophy',
    readingTime: '10 min'
  }
];

export default function BlogDetailPage() {
  const [blog] = useState(mockBlog);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const [bookmarks, setBookmarks] = useState(blog.bookmarks);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setBookmarks(isBookmarked ? bookmarks - 1 : bookmarks + 1);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'text-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`,
      color: 'text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'text-blue-700'
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied!');
    setShowShareMenu(false);
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading article...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <head>
        <title>{blog.seo.metaTitle}</title>
        <meta name="description" content={blog.seo.metaDescription} />
        <meta name="keywords" content={blog.seo.keywords.join(', ')} />
        <meta name="author" content={blog.author.name} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featuredImage} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={blog.author.name} />
        <meta property="article:published_time" content={blog.publishedAt} />
        <meta property="article:modified_time" content={blog.updatedAt} />
        <meta property="article:section" content={blog.category} />
        {blog.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={blog.featuredImage} />
        
        <link rel="canonical" href={shareUrl} />
      </head>

      {/* Navigation Breadcrumb */}
      <nav className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-orange-600 hover:text-orange-700">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/blogs" className="text-orange-600 hover:text-orange-700">Blogs</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500 truncate">{blog.title}</span>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <header className="py-12 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Category Badge */}
            <span className="inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              {blog.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {blog.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{blog.readingTime}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                <span>{blog.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
        <div className="relative h-96 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
              <p className="text-gray-800 font-medium">
                📖 Estimated reading time: {blog.readingTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Social Actions */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8 space-y-4">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isLiked
                    ? 'bg-red-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likes}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isBookmarked
                    ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <BookmarkPlus className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span className="font-medium">{bookmarks}</span>
              </button>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                    {shareOptions.map((option) => (
                      <a
                        key={option.name}
                        href={option.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors ${option.color}`}
                      >
                        <option.icon className="h-4 w-4" />
                        <span className="text-sm font-medium text-gray-700">{option.name}</span>
                      </a>
                    ))}
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="text-sm font-medium text-gray-700">Copy Link</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Comments Link */}
              <Link
                href="#comments"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">{blog.comments}</span>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <article className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="text-gray-800 leading-relaxed"
              />
            </article>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {blog.author.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{blog.author.name}</h4>
                  <p className="text-gray-600 mb-3">{blog.author.bio}</p>
                  <div className="flex space-x-2">
                    {blog.author.socialLinks?.twitter && (
                      <a
                        href={blog.author.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {blog.author.socialLinks?.linkedin && (
                      <a
                        href={blog.author.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Related Articles */}
      <section className="py-16 bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Related Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedBlogs.map((relatedBlog) => (
              <article
                key={relatedBlog._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 bg-gradient-to-r from-gray-400 to-gray-600">
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                      {relatedBlog.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-orange-600 transition-colors">
                    <Link href={`/blogs/${relatedBlog._id}`}>
                      {relatedBlog.title}
                    </Link>
                  </h3>

                  <p className="text-gray-600 mb-4">
                    {relatedBlog.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {relatedBlog.readingTime}
                    </span>

                    <Link
                      href={`/blogs/${relatedBlog._id}`}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Blogs */}
      <div className="py-8 text-center">
        <Link
          href="/blogs"
          className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>View All Articles</span>
        </Link>
      </div>
    </div>
  );
} 