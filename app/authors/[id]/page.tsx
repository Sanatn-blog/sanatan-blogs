'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Eye, 
  Heart, 
  Clock, 
  BookOpen, 
  Users, 
  MapPin, 
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  ExternalLink,
  ArrowLeft,
  Loader2
} from 'lucide-react';

// TypeScript interfaces
interface Author {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: string;
  status: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  location?: string;
  joinedAt: string;
  totalBlogs: number;
  totalViews: number;
  totalLikes: number;
  followers: number;
  following: number;
  expertise?: string[];
  achievements?: string[];
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  readingTime: number;
  views: number;
  likes: string[];
  publishedAt: string;
  status: string;
}

interface AuthorStats {
  totalBlogs: number;
  totalViews: number;
  totalLikes: number;
  averageReadingTime: number;
  mostPopularCategory: string;
}

export default function AuthorProfilePage() {
  const params = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<AuthorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/authors/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Author not found');
        }
        
        const data = await response.json();
        setAuthor(data.author);
        setBlogs(data.blogs);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load author data');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAuthorData();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading author profile...</p>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Author Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The author you are looking for does not exist.'}</p>
          <Link
            href="/blogs"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/blogs"
            className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>

      {/* Author Profile Header */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar */}
              <div className="w-24 h-24 bg-orange-600 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
                {author.avatar ? (
                  <img 
                    src={author.avatar} 
                    alt={author.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span>{author.name.charAt(0)}</span>
                )}
              </div>

              {/* Author Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{author.name}</h1>
                {author.bio && (
                  <p className="text-gray-600 mb-4 max-w-2xl">{author.bio}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  {author.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {author.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {formatJoinDate(author.joinedAt)}
                  </div>
                </div>

                {/* Social Links */}
                {(author.socialLinks?.twitter || author.socialLinks?.linkedin || author.socialLinks?.website || author.socialLinks?.instagram || author.socialLinks?.youtube || author.socialLinks?.facebook) && (
                  <div className="flex space-x-3">
                    {author.socialLinks?.twitter && (
                      <a
                        href={author.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {author.socialLinks?.linkedin && (
                      <a
                        href={author.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {author.socialLinks?.website && (
                      <a
                        href={author.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                    {author.socialLinks?.instagram && (
                      <a
                        href={author.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {author.socialLinks?.youtube && (
                      <a
                        href={author.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                    )}
                    {author.socialLinks?.facebook && (
                      <a
                        href={author.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.averageReadingTime}</div>
                <div className="text-sm text-gray-600">Avg Read Time</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{author.followers}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Author's Blogs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Articles by {author.name}
            </h2>
            <p className="text-gray-600">
              {blogs.length} published article{blogs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-600">This author hasn&apos;t published any articles yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <article key={blog._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {blog.featuredImage && (
                    <div className="aspect-video bg-gray-200">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        {blog.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link href={`/blogs/${blog._id}`} className="hover:text-orange-600 transition-colors">
                        {blog.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {blog.readingTime} min read
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {blog.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {blog.likes.length}
                        </span>
                      </div>
                      
                      <span>{formatDate(blog.publishedAt)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 