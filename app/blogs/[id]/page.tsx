'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  Copy,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

// TypeScript interfaces
interface Author {
  _id: string;
  name: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: Author;
  category: string;
  tags: string[];
  publishedAt?: string;
  updatedAt: string;
  readingTime: number;
  views: number;
  likes: string[];
  comments: string[];
  featured?: boolean;
  status: 'draft' | 'published' | 'archived';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
}

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  readingTime: number;
  author: {
    name: string;
    avatar?: string;
  };
}

interface BlogResponse {
  blog: Blog;
  relatedBlogs: RelatedBlog[];
  navigation?: {
    next?: { title: string; slug: string };
    previous?: { title: string; slug: string };
  };
}

// Function to convert plain text to formatted HTML
const formatContent = (content: string): string => {
  if (!content) return '';
  
  // Preprocess content to handle very long strings
  const preprocessLongStrings = (text: string): string => {
    // If a line is longer than 100 characters without spaces, add word breaks
    if (text.length > 100 && !text.includes(' ')) {
      // Add spaces every 50 characters to force word breaks
      return text.match(/.{1,50}/g)?.join(' ') || text;
    }
    return text;
  };
  
  // Split content into lines and preprocess
  const lines = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => preprocessLongStrings(line));
  
  let formattedContent = '';
  
  lines.forEach((line) => {
    // Check for headings (lines that start with specific patterns)
    if (line.startsWith('🙏॥') || line.startsWith('🌷') || line.startsWith('**') || line.startsWith('👉')) { // This is likely a heading or special section
      if (line.includes('**')) {
        // Extract text between ** for headings
        const headingText = line.replace(/\*\*/g, '').replace(/🙏॥|🌷|👉/g, '').trim();
        formattedContent += `<h2 class="text-2xl font-bold text-gray-900 mb-4 break-words overflow-hidden">${headingText}</h2>`;
      } else {
        // Regular heading
        const headingText = line.replace(/🙏॥|🌷|👉/g, '').trim();
        formattedContent += `<h3 class="text-xl font-semibold text-gray-800 mb-4 break-words overflow-hidden">${headingText}</h3>`;
      }
    } else if (line.startsWith('-') || line.startsWith('•')) {      // This is a list item
      const listText = line.replace(/^[-•]\s*/, '').trim();
      formattedContent += `<li class="mb-2 text-gray-700 break-words overflow-hidden">${listText}</li>`;
    } else if (line.includes('॥') || line.includes('॥')) { // This is likely a Sanskrit verse or quote
      formattedContent += `<blockquote class="bg-orange-50 border-l-4 border-orange-500 italic text-gray-700 break-words overflow-hidden">${line}</blockquote>`;
    } else if (line.length > 0) {
      // Regular paragraph
      formattedContent += `<p class="mb-4 text-gray-700 leading-relaxed break-words overflow-hidden">${line}</p>`;
    }
  });
  
  // Wrap list items in ul tags if they exist
  formattedContent = formattedContent.replace(
    /(<li[^>]*>.*?<\/li>)+/g,
    (match) => `<ul class="list-disc list-inside mb-4 space-y-2">${match}</ul>`
  );
  
  return formattedContent;
};

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params.id as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [likes, setLikes] = useState(0);
  const [bookmarks, setBookmarks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching blog with ID:', blogId);
        const response = await fetch(`/api/blogs/${blogId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog not found');
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data: BlogResponse = await response.json();
        
        if (!data.blog) {
          throw new Error('Invalid blog data received');
        }
        
        console.log('Blog data received:', data.blog);
        setBlog(data.blog);
        setRelatedBlogs(data.relatedBlogs || []);
        setLikes(data.blog.likes?.length || 0);
        setBookmarks(0); // Bookmarks not implemented in backend yet
        
      } catch (err) {
        console.error('Error fetching blog:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load blog';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = async () => {
    if (!blog) return;
    
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    
    // TODO: Implement like API call
    // const response = await fetch(`/api/blogs/${blog._id}/like`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    //   }
    // });
  };

  const handleBookmark = async () => {
    if (!blog) return;
    
    setIsBookmarked(!isBookmarked);
    setBookmarks(isBookmarked ? bookmarks - 1 : bookmarks + 1);
    
    // TODO: Implement bookmark API call
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
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog?.title || '')}`,
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation Breadcrumb Skeleton */}
        <nav className="bg-gray-50 py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </nav>

        {/* Article Header Skeleton */}
        <header className="py-12 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Category Badge Skeleton */}
              <div className="inline-block h-8 w-24 bg-orange-200 rounded-full animate-pulse mb-6"></div>

              {/* Title Skeleton */}
              <div className="space-y-3 mb-6">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-2xl"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-xl"></div>
              </div>

              {/* Excerpt Skeleton */}
              <div className="space-y-2 mb-8 max-w-3xl mx-auto">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>

              {/* Meta Information Skeleton */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-5 w-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image Skeleton */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
          <div className="relative h-96 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl overflow-hidden shadow-2xl animate-pulse">
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content Skeleton */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Author Bio Skeleton */}
              <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Loading Indicator */}
        <div className="fixed bottom-8 right-8 bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Loading article...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    );
  }

  // No blog data
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-8">The requested article could not be found.</p>
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight break-words overflow-hidden">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto break-words overflow-hidden">
              {blog.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <Link href={`/authors/${blog.author._id}`} className="hover:text-orange-600 transition-colors font-semibold">
                  {blog.author.name}
                </Link>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{blog.readingTime} min read</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                <span>{blog.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
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
            )}
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
          <div className="relative h-96 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={blog.featuredImage} 
              alt={blog.title}
              fill
              className="w-full h-full object-cover"
              style={{objectFit: 'cover'}}
            />
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
                <p className="text-gray-800 font-medium">
                  📖 Estimated reading time: {blog.readingTime} min
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-4 order-1 overflow-hidden">
            <article className="prose prose-lg max-w-none blog-content">
              <div className="overflow-hidden">
                <div 
                  dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
                  className="text-gray-800 leading-relaxed break-words overflow-hidden"
                />
              </div>
            </article>

            {/* Social Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 py-3 px-6 rounded-xl transition-all duration-300 ${
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
                className={`flex items-center space-x-2 py-3 px-6 rounded-xl transition-all duration-300 ${
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
                  className="flex items-center space-x-2 py-3 px-6 rounded-xl bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[200px]">
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
                className="flex items-center space-x-2 py-3 px-6 rounded-xl bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">{blog.comments?.length || 0}</span>
              </Link>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {blog.author.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">
                    <Link href={`/authors/${blog.author._id}`} className="hover:text-orange-600 transition-colors">
                      {blog.author.name}
                    </Link>
                  </h4>
                  {blog.author.bio && (
                    <p className="text-gray-600 mb-3">{blog.author.bio}</p>
                  )}
                  {blog.author.socialLinks && (
                    <div className="flex space-x-2">
                      {blog.author.socialLinks.twitter && (
                        <a
                          href={blog.author.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-500"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {blog.author.socialLinks.linkedin && (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
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
                    {relatedBlog.featuredImage && (
                      <Image 
                        src={relatedBlog.featuredImage} 
                        alt={relatedBlog.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                        {relatedBlog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-orange-600 transition-colors">
                      <Link href={`/blogs/${relatedBlog.slug}`}>
                        {relatedBlog.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4">
                      {relatedBlog.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {relatedBlog.readingTime} min
                      </span>

                      <Link
                        href={`/blogs/${relatedBlog.slug}`}
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
      )}

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