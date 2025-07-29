'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Loader2, 
  Users, 
  UserPlus, 
  UserMinus,
  MapPin,
  Calendar
} from 'lucide-react';

interface Follower {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedAt: string;
}

interface Following {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedAt: string;
}

export default function FollowersPage() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [currentUser, setCurrentUser] = useState<{ _id: string; name: string } | null>(null);

  useEffect(() => {
    // Get current user
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          fetchFollowers(data.user._id);
        }
      })
      .catch(err => {
        console.error('Error fetching current user:', err);
        setError('Failed to load user data');
      });
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchFollowers = async (userId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Fetch followers
      const followersResponse = await fetch(`/api/users/${userId}/followers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch following
      const followingResponse = await fetch(`/api/users/${userId}/following`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (followersResponse.ok && followingResponse.ok) {
        const followersData = await followersResponse.json();
        const followingData = await followingResponse.json();
        
        setFollowers(followersData.followers || []);
        setFollowing(followingData.following || []);
      } else {
        throw new Error('Failed to fetch followers/following data');
      }
    } catch (err) {
      console.error('Error fetching followers/following:', err);
      setError('Failed to load followers and following data');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });

      if (response.ok) {
        // Remove from following list
        setFollowing(prev => prev.filter(user => user._id !== targetUserId));
        // Refresh the followers/following data to get updated counts
        if (currentUser) {
          fetchFollowers(currentUser._id);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing:', error);
      alert('Failed to unfollow user');
    }
  };

  const formatDate = (dateString: string) => {
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
          <p className="text-gray-600">Loading followers and following...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
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
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Followers & Following</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('followers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'followers'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Followers ({followers.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'following'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Following ({following.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'followers' ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Followers</h2>
                {followers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No followers yet</h3>
                    <p className="text-gray-600">When people follow you, they&apos;ll appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {followers.map((follower) => (
                      <div key={follower._id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start space-x-4">
                          {follower.avatar ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                              <Image 
                                src={follower.avatar} 
                                alt={follower.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                              {follower.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              <Link href={`/authors/${follower._id}`} className="hover:text-orange-600 transition-colors">
                                {follower.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">@{follower.username}</p>
                            {follower.bio && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{follower.bio}</p>
                            )}
                            <div className="flex items-center text-xs text-gray-500">
                              {follower.location && (
                                <div className="flex items-center mr-4">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {follower.location}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Joined {formatDate(follower.joinedAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">People You Follow</h2>
                {following.length === 0 ? (
                  <div className="text-center py-12">
                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Not following anyone yet</h3>
                    <p className="text-gray-600">Start following authors to see their content here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {following.map((followedUser) => (
                      <div key={followedUser._id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start space-x-4">
                          {followedUser.avatar ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                              <Image 
                                src={followedUser.avatar} 
                                alt={followedUser.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                              {followedUser.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              <Link href={`/authors/${followedUser._id}`} className="hover:text-orange-600 transition-colors">
                                {followedUser.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">@{followedUser.username}</p>
                            {followedUser.bio && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{followedUser.bio}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-500">
                                {followedUser.location && (
                                  <div className="flex items-center mr-4">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {followedUser.location}
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Joined {formatDate(followedUser.joinedAt)}
                                </div>
                              </div>
                              <button
                                onClick={() => handleUnfollow(followedUser._id)}
                                className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <UserMinus className="h-4 w-4" />
                                <span>Unfollow</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 