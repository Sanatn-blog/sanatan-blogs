'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Users, 
  BookOpen, 
  Eye, 
  Heart, 
  MapPin, 
  Calendar,
  Loader2
} from 'lucide-react';

// TypeScript interfaces
interface Author {
  _id: string;
  name: string;
  bio?: string;
  avatar?: string;
  location?: string;
  joinedAt: string;
  totalBlogs: number;
  totalViews: number;
  totalLikes: number;
  followers: number;
  following: number;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        // We'll need to create an API endpoint for this
        // For now, let's create a simple endpoint that fetches all authors
        const response = await fetch('/api/authors');
        
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        
        const data = await response.json();
        setAuthors(data.authors);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load authors');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (author.bio && author.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (author.location && author.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <p className="text-gray-600">Loading authors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Authors</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our 
            <span className="text-orange-600"> Authors</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover talented writers who share their knowledge, stories, and insights 
            with our community.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search authors by name, bio, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAuthors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No authors found' : 'No authors yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms.' 
                  : 'Be the first to join our community of writers!'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-gray-600">
                  {filteredAuthors.length} author{filteredAuthors.length !== 1 ? 's' : ''} found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuthors.map((author) => (
                  <div key={author._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4 mb-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-orange-600 rounded-full overflow-hidden flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {author.avatar ? (
                          <Image 
                            src={author.avatar} 
                            alt={author.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span>{author.name.charAt(0)}</span>
                        )}
                      </div>
                      
                      {/* Author Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          <Link href={`/authors/${author._id}`} className="hover:text-orange-600 transition-colors">
                            {author.name}
                          </Link>
                        </h3>
                        {author.location && (
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {author.location}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Joined {formatJoinDate(author.joinedAt)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Bio */}
                    {author.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {author.bio}
                      </p>
                    )}
                    
                    {/* Stats */}
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div className="bg-orange-50 rounded-lg p-2">
                        <BookOpen className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-900">{author.totalBlogs}</div>
                        <div className="text-xs text-gray-500">Articles</div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-2">
                        <Eye className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-900">
                          {author.totalViews > 999 ? `${(author.totalViews / 1000).toFixed(1)}k` : author.totalViews}
                        </div>
                        <div className="text-xs text-gray-500">Views</div>
                      </div>
                      
                      <div className="bg-red-50 rounded-lg p-2">
                        <Heart className="h-4 w-4 text-red-600 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-900">
                          {author.totalLikes > 999 ? `${(author.totalLikes / 1000).toFixed(1)}k` : author.totalLikes}
                        </div>
                        <div className="text-xs text-gray-500">Likes</div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-2">
                        <Users className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-900">{author.followers}</div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-2">
                        <Users className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-900">{author.following}</div>
                        <div className="text-xs text-gray-500">Following</div>
                      </div>
                    </div>
                    
                    {/* View Profile Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/authors/${author._id}`}
                        className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium text-center block"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
} 