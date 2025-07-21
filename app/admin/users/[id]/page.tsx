'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Crown, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit3,
  Save,
  X,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  FileText,
  MessageSquare,
  AlertCircle,
  Verified,
  Lock
} from 'lucide-react';

interface UserDetails {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  emailVerified: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  isActive: boolean;
  isTemporary: boolean;
  authProvider: 'email' | 'phone' | 'google' | 'facebook' | 'instagram' | 'twitter';
  blogsCount: number;
  commentsCount: number;
  recentBlogs?: Array<{
    _id: string;
    title: string;
    slug: string;
    createdAt: string;
    status: string;
  }>;
  recentComments?: Array<{
    _id: string;
    content: string;
    createdAt: string;
  }>;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserDetails>>({});
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setEditForm(data.user);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch user details');
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      setError('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(prev => prev ? { ...prev, ...data.user } : null);
        setIsEditing(false);
        // Show success message
        alert('User updated successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(user || {});
    setIsEditing(false);
  };

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      setResettingPassword(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      
      if (response.ok) {
        alert('Password reset successfully');
        setShowPasswordReset(false);
        setNewPassword('');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-5 w-5 text-purple-600" />;
      case 'admin': return <Shield className="h-5 w-5 text-blue-600" />;
      default: return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      suspended: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-900 dark:text-red-100">Error</h3>
              <p className="text-red-700 dark:text-red-300">{error || 'User not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Users</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit User</span>
              </button>
              <button
                onClick={() => setShowPasswordReset(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>Reset Password</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-6">
              <div className={`w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-white font-bold text-2xl ${
                user.role === 'super_admin' 
                  ? 'bg-gradient-to-r from-purple-600 to-orange-600' 
                  : user.role === 'admin' 
                  ? 'bg-gradient-to-r from-blue-600 to-orange-600'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700'
              }`}>
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-orange-500"
                      />
                    ) : (
                      user.name
                    )}
                  </h1>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role)}
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {user.email && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-orange-500"
                          />
                        ) : (
                          user.email
                        )}
                      </span>
                    </div>
                  )}
                  
                  {user.phoneNumber && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Verification */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status & Verification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Status
                </label>
                {isEditing ? (
                  <select
                    value={editForm.status || user.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as 'pending' | 'approved' | 'rejected' | 'suspended' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Role
                </label>
                {isEditing ? (
                  <select
                    value={editForm.role || user.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' | 'super_admin' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Verification
                </label>
                {isEditing ? (
                  <select
                    value={editForm.emailVerified?.toString() || user.emailVerified.toString()}
                    onChange={(e) => setEditForm(prev => ({ ...prev, emailVerified: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    {user.emailVerified ? (
                      <Verified className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-900 dark:text-white">
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Verification
                </label>
                {isEditing ? (
                  <select
                    value={editForm.isVerified?.toString() || user.isVerified.toString()}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isVerified: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    {user.isVerified ? (
                      <Verified className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-900 dark:text-white">
                      {user.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bio</h2>
              {isEditing ? (
                <textarea
                  value={editForm.bio || user.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
              )}
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Blogs */}
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Recent Blogs ({user.blogsCount} total)</span>
                </h3>
                {(user.recentBlogs && user.recentBlogs.length > 0) ? (
                  <div className="space-y-2">
                    {user.recentBlogs.map((blog) => (
                      <div key={blog._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{blog.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(blog.createdAt)} • {blog.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No blogs yet</p>
                )}
              </div>

              {/* Recent Comments */}
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Recent Comments ({user.commentsCount} total)</span>
                </h3>
                {(user.recentComments && user.recentComments.length > 0) ? (
                  <div className="space-y-2">
                    {user.recentComments.map((comment) => (
                      <div key={comment._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="text-sm text-gray-900 dark:text-white line-clamp-2">{comment.content}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Auth Provider
                </label>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{user.authProvider}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Account Active
                </label>
                {isEditing ? (
                  <select
                    value={editForm.isActive?.toString() || user.isActive.toString()}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    {user.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-900 dark:text-white">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Temporary Account
                </label>
                <div className="flex items-center space-x-2">
                  {user.isTemporary ? (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-sm text-gray-900 dark:text-white">
                    {user.isTemporary ? 'Temporary' : 'Permanent'}
                  </span>
                </div>
              </div>
              
              {user.lastLogin && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Login
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(user.lastLogin)}</p>
                </div>
              )}
              
              {user.verifiedAt && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Verified At
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(user.verifiedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Links</h2>
              <div className="space-y-3">
                {user.socialLinks.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <a 
                      href={user.socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Website
                    </a>
                  </div>
                )}
                {user.socialLinks.twitter && (
                  <div className="flex items-center space-x-2">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    <a 
                      href={user.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Twitter
                    </a>
                  </div>
                )}
                {user.socialLinks.linkedin && (
                  <div className="flex items-center space-x-2">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                    <a 
                      href={user.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
                {user.socialLinks.instagram && (
                  <div className="flex items-center space-x-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <a 
                      href={user.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Instagram
                    </a>
                  </div>
                )}
                {user.socialLinks.youtube && (
                  <div className="flex items-center space-x-2">
                    <Youtube className="h-4 w-4 text-red-600" />
                    <a 
                      href={user.socialLinks.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      YouTube
                    </a>
                  </div>
                )}
                {user.socialLinks.facebook && (
                  <div className="flex items-center space-x-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <a 
                      href={user.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Facebook
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reset Password for {user?.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordReset(false);
                    setNewPassword('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  disabled={resettingPassword || !newPassword || newPassword.length < 6}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {resettingPassword ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 