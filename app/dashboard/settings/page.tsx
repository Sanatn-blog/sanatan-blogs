'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Save, 
  ArrowLeft,
  Mail,
  MapPin,
  Briefcase,
  Award,
  Globe,
  Twitter,
  Linkedin,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  Instagram,
  Youtube,
  Facebook,
  Camera,
  Upload,
  Lock,
  AtSign,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import ImageCropper from '@/components/ImageCropper';

interface ProfileForm {
  name: string;
  bio: string;
  location: string;
  expertise: string[];
  achievements: string[];
  socialLinks: {
    twitter: string;
    linkedin: string;
    website: string;
    instagram: string;
    youtube: string;
    facebook: string;
  };
}

export default function SettingsPage() {
  const { user, loading, updateUser, refreshUserData } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    bio: '',
    location: '',
    expertise: [],
    achievements: [],
    socialLinks: {
      twitter: '',
      linkedin: '',
      website: '',
      instagram: '',
      youtube: '',
      facebook: ''
    }
  });

  const [newExpertise, setNewExpertise] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  // User ID (Username) change state
  const [newUserId, setNewUserId] = useState('');
  const [changingUserId, setChangingUserId] = useState(false);
  const [userIdMessage, setUserIdMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null);
  const [suggestedUserIds, setSuggestedUserIds] = useState<string[]>([]);
  const [debouncedUserId, setDebouncedUserId] = useState('');
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    if (user) {
      loadProfile();
    }
  }, [user]);

  // Clear User ID availability check when user changes
  useEffect(() => {
    setUserIdAvailable(null);
    setSuggestedUserIds([]);
    setNewUserId('');
  }, [user]);

  // Debounce User ID input for availability check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedUserId(newUserId);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [newUserId]);



  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setForm({
          name: data.user.name || '',
          bio: data.user.bio || '',
          location: data.user.location || '',
          expertise: data.user.expertise || [],
          achievements: data.user.achievements || [],
          socialLinks: {
            twitter: data.user.socialLinks?.twitter || '',
            linkedin: data.user.socialLinks?.linkedin || '',
            website: data.user.socialLinks?.website || '',
            instagram: data.user.socialLinks?.instagram || '',
            youtube: data.user.socialLinks?.youtube || '',
            facebook: data.user.socialLinks?.facebook || ''
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update the user context with any changes
        if (data.user) {
          updateUser(data.user);
        } else {
          // Fallback: refresh user data from server
          await refreshUserData();
        }
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !form.expertise.includes(newExpertise.trim())) {
      setForm(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (index: number) => {
    setForm(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim() && !form.achievements.includes(newAchievement.trim())) {
      setForm(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setShowImageCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setAvatarPreview(croppedImageUrl);
    setShowImageCropper(false);
    setSelectedImage('');
  };

  const handleAvatarUpload = async () => {
    if (!avatarPreview) return;

    try {
      setUploadingAvatar(true);
      
      // Convert data URL to blob
      const response = await fetch(avatarPreview);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('avatar', blob, 'avatar.jpg');

      const token = localStorage.getItem('accessToken');
      const uploadResponse = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        setAvatarPreview('');
        // Update the user context with new avatar
        if (data.avatar) {
          updateUser({ avatar: data.avatar });
        } else if (data.user) {
          updateUser(data.user);
        } else {
          // Fallback: refresh user data from server
          await refreshUserData();
        }
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await uploadResponse.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to upload profile picture' });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage({ type: 'error', text: 'Failed to upload profile picture' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Check if User ID (username) is available
  const checkUserIdAvailability = useCallback(async (userId: string) => {
    if (!userId.trim() || userId.trim().length < 3) {
      setUserIdAvailable(null);
      setSuggestedUserIds([]);
      return;
    }

    try {
      setCheckingUserId(true);
      const response = await fetch(`/api/auth/check-exists?username=${encodeURIComponent(userId.trim())}`);
      if (response.ok) {
        const data = await response.json();
        const isAvailable = !data.username;
        setUserIdAvailable(isAvailable);
        
        // If not available, generate suggestions
        if (!isAvailable) {
          const suggestions = generateUserIdSuggestions(userId.trim());
          setSuggestedUserIds(suggestions);
        } else {
          setSuggestedUserIds([]);
        }
      }
    } catch (error) {
      console.error('Error checking User ID availability:', error);
      setUserIdAvailable(null);
    } finally {
      setCheckingUserId(false);
    }
  }, []);

  // Check User ID availability when debounced value changes
  useEffect(() => {
    if (debouncedUserId) {
      checkUserIdAvailability(debouncedUserId);
    } else {
      setUserIdAvailable(null);
      setSuggestedUserIds([]);
    }
  }, [debouncedUserId, checkUserIdAvailability]);

  // Generate User ID suggestions
  const generateUserIdSuggestions = (baseUserId: string): string[] => {
    const suggestions: string[] = [];
    const cleanBase = baseUserId.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    
    // Add numbers
    for (let i = 1; i <= 5; i++) {
      suggestions.push(`${cleanBase}${i}`);
    }
    
    // Add random numbers
    for (let i = 0; i < 3; i++) {
      const randomNum = Math.floor(Math.random() * 999) + 1;
      suggestions.push(`${cleanBase}${randomNum}`);
    }
    
    // Add underscore and hyphen variations
    suggestions.push(`${cleanBase}_user`);
    suggestions.push(`user_${cleanBase}`);
    suggestions.push(`${cleanBase}-user`);
    suggestions.push(`user-${cleanBase}`);
    
    return suggestions.slice(0, 5); // Return max 5 suggestions
  };

  const handleUserIdChange = async () => {
    if (!newUserId.trim()) {
      setUserIdMessage({ type: 'error', text: 'Please enter a new User ID' });
      return;
    }

    if (newUserId.trim().length < 3) {
      setUserIdMessage({ type: 'error', text: 'User ID must be at least 3 characters long' });
      return;
    }

    // Validate User ID format
    const userIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userIdRegex.test(newUserId.trim())) {
      setUserIdMessage({ type: 'error', text: 'User ID can only contain letters, numbers, hyphens, and underscores' });
      return;
    }

    try {
      setChangingUserId(true);
      setUserIdMessage(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/profile/change-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername: newUserId.trim() })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserIdMessage({ type: 'success', text: 'User ID changed successfully!' });
        setNewUserId('');
        setUserIdAvailable(null);
        setSuggestedUserIds([]);
        // Update the user context with new username
        if (data.user?.username) {
          updateUser({ username: data.user.username });
        } else if (data.user) {
          updateUser(data.user);
        } else {
          // Fallback: refresh user data from server
          await refreshUserData();
        }
        setTimeout(() => setUserIdMessage(null), 3000);
      } else {
        const data = await response.json();
        setUserIdMessage({ type: 'error', text: data.error || 'Failed to change User ID' });
      }
    } catch (error) {
      console.error('Error changing User ID:', error);
      setUserIdMessage({ type: 'error', text: 'Failed to change User ID' });
    } finally {
      setChangingUserId(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordMessage(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordMessage(null), 3000);
      } else {
        const data = await response.json();
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setChangingPassword(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-purple-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Access Restricted</h1>
            <p className="text-slate-400">Please log in to access your settings</p>
          </div>
          <Link href="/login">
            <span className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
              <User className="w-5 h-5" />
              <span>Login</span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <div className="p-3 bg-slate-800/50 backdrop-blur-sm rounded-xl hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50 shadow-sm">
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </div>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">Manage your spiritual profile and preferences</p>
            </div>
          </div>
          

        </div>

        {/* Profile Image and Save Changes Section */}
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 mb-8">
          {/* Profile Image Section - 70% */}
          <div className="xl:col-span-7">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl h-full">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span>Profile Picture</span>
              </h2>
              
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Current Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-4 border-slate-600/50 shadow-lg">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400" />
                    )}
                  </div>
                  
                  {/* Avatar Preview */}
                  {avatarPreview && (
                    <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-purple-500/50">
                      <Image
                        src={avatarPreview}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Upload indicator */}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 w-full lg:w-auto">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        Update Profile Picture
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-600/50 hover:border-purple-500/50"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choose Image</span>
                        </label>
                        
                        {avatarPreview && (
                          <button
                            onClick={handleAvatarUpload}
                            disabled={uploadingAvatar}
                            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
                          >
                            {uploadingAvatar ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            <span>{uploadingAvatar ? 'Uploading...' : 'Upload'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400">
                        <strong>Recommended:</strong> Square image, at least 200x200 pixels. JPG, PNG, or GIF up to 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Changes Section - 30% */}
          <div className="xl:col-span-3">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl h-full">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Save className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Save Changes</span>
              </h3>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
              </button>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Save your spiritual profile information and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
            message.type === 'success' 
              ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10' 
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-500/50 dark:text-red-300 shadow-lg shadow-red-500/10'
          }`}>
            <div className="flex items-center space-x-3">
              {message.type === 'success' ? (
                <div className="p-1 bg-emerald-500/20 rounded-full">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : (
                <div className="p-1 bg-red-500/20 rounded-full">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Profile Settings */}
          <div className="xl:col-span-3 space-y-6">
            {/* Basic Information */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span>Basic Information</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your full name (e.g., Krishna Das, Radha Rani)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-300 resize-none backdrop-blur-sm"
                    placeholder="Share your spiritual journey, knowledge of Sanatan Dharma, and what you write about..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-slate-500">Share your spiritual journey with the Sanatan community</p>
                    <p className={`text-xs ${form.bio.length > 450 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500'}`}>
                      {form.bio.length}/500 characters
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="e.g., Varanasi, India or New York, USA"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span>Expertise</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                    className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="e.g., Vedic Studies, Sanskrit, Yoga, Meditation, Ayurveda, Philosophy"
                  />
                  <button
                    onClick={addExpertise}
                    disabled={!newExpertise.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
                  >
                    Add Skill
                  </button>
                </div>
                
                {form.expertise.length > 0 && (
                  <div className="bg-slate-700/20 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-slate-300 mb-3">Your Skills ({form.expertise.length})</h3>
                    <div className="flex flex-wrap gap-3">
                      {form.expertise.map((item, index) => (
                        <span
                          key={index}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-600/20 dark:to-cyan-600/20 border border-blue-300 dark:border-blue-500/30 rounded-lg text-blue-700 dark:text-blue-300 backdrop-blur-sm"
                        >
                          <span className="text-sm font-medium">{item}</span>
                          <button
                            onClick={() => removeExpertise(index)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span>Achievements & Awards</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="e.g., Sanskrit Scholar, Yoga Teacher Certification, Published Spiritual Book"
                  />
                  <button
                    onClick={addAchievement}
                    disabled={!newAchievement.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
                  >
                    Add Achievement
                  </button>
                </div>
                
                {form.achievements.length > 0 && (
                  <div className="bg-slate-700/20 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-slate-300 mb-3">Your Achievements ({form.achievements.length})</h3>
                    <div className="space-y-3">
                      {form.achievements.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-600/10 dark:to-orange-600/10 border border-yellow-300 dark:border-yellow-500/20 rounded-lg backdrop-blur-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-yellow-800 dark:text-yellow-300 font-medium">{item}</span>
                          </div>
                          <button
                            onClick={() => removeAchievement(index)}
                            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200 transition-colors duration-200 p-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span>Social Links</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Twitter</label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={form.socialLinks.twitter}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="https://twitter.com/your_spiritual_handle"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={form.socialLinks.linkedin}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="https://linkedin.com/in/your_professional_profile"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Facebook</label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={form.socialLinks.facebook}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="https://facebook.com/your_spiritual_page"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={form.socialLinks.website}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, website: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="https://your-spiritual-website.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Instagram</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={form.socialLinks.instagram}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="https://instagram.com/your_spiritual_journey"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">YouTube</label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={form.socialLinks.youtube}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="https://youtube.com/@your_spiritual_channel"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* User ID (Username) Change */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <AtSign className="w-5 h-5 text-white" />
                </div>
                <span>User ID</span>
              </h2>
              
              {userIdMessage && (
                <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                  userIdMessage.type === 'success' 
                    ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10' 
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-500/50 dark:text-red-300 shadow-lg shadow-red-500/10'
                }`}>
                  <div className="flex items-center space-x-3">
                    {userIdMessage.type === 'success' ? (
                      <div className="p-1 bg-emerald-500/20 rounded-full">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    ) : (
                      <div className="p-1 bg-red-500/20 rounded-full">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                    <span className="font-medium">{userIdMessage.text}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current User ID</label>
                  <input
                    type="text"
                    value={user.username || 'Loading...'}
                    disabled
                    className={`w-full px-4 py-3 border rounded-xl cursor-not-allowed backdrop-blur-sm transition-all duration-300 ${
                      userIdMessage?.type === 'success' 
                        ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300' 
                        : 'bg-slate-700/30 border-slate-600/50 text-slate-400'
                    }`}
                  />
                  {userIdMessage?.type === 'success' && (
                    <div className="mt-2 p-2 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                        ✓ User ID updated successfully to: <span className="font-bold">{user.username || 'Loading...'}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New User ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                        userIdAvailable === true 
                          ? 'border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500/50' 
                          : userIdAvailable === false 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500/50'
                          : 'border-slate-600/50 focus:ring-purple-500 focus:border-purple-500/50'
                      }`}
                      placeholder="Enter new unique User ID"
                    />
                    {checkingUserId && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                      </div>
                    )}
                    {userIdAvailable === true && !checkingUserId && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                    )}
                    {userIdAvailable === false && !checkingUserId && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Availability Status */}
                  {userIdAvailable === true && (
                    <div className="mt-2 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                        ✓ User ID is available
                      </p>
                    </div>
                  )}
                  
                  {userIdAvailable === false && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/30">
                      <p className="text-xs text-red-700 dark:text-red-300 font-medium mb-2">
                        ✗ User ID is already taken
                      </p>
                      {suggestedUserIds.length > 0 && (
                        <div>
                          <p className="text-xs text-red-600 dark:text-red-400 mb-2">Try these alternatives:</p>
                          <div className="flex flex-wrap gap-2">
                            {suggestedUserIds.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => setNewUserId(suggestion)}
                                className="px-2 py-1 text-xs bg-slate-700 border border-slate-600 rounded-md text-slate-300 hover:bg-slate-600 transition-colors duration-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-2 p-3 bg-slate-700/20 rounded-lg">
                    <p className="text-xs text-slate-400">
                      <strong>Requirements:</strong> 3-30 characters, letters, numbers, hyphens, and underscores only
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleUserIdChange}
                  disabled={changingUserId || !newUserId.trim() || userIdAvailable !== true}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600 text-white rounded-xl font-medium transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
                >
                  {changingUserId ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <AtSign className="w-5 h-5" />
                  )}
                  <span>{changingUserId ? 'Changing User ID...' : 'Change User ID'}</span>
                </button>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <span>Change Password</span>
              </h2>
              
              {passwordMessage && (
                <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                  passwordMessage.type === 'success' 
                    ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10' 
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-500/50 dark:text-red-300 shadow-lg shadow-red-500/10'
                }`}>
                  <div className="flex items-center space-x-3">
                    {passwordMessage.type === 'success' ? (
                      <div className="p-1 bg-emerald-500/20 rounded-full">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    ) : (
                      <div className="p-1 bg-red-500/20 rounded-full">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                    <span className="font-medium">{passwordMessage.text}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your new secure password"
                  />
                  <div className="mt-2 p-3 bg-slate-700/20 rounded-lg">
                    <p className="text-xs text-slate-400">
                      <strong>Requirements:</strong> At least 6 characters long
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Confirm your new secure password"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600 text-white rounded-xl font-medium transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
                >
                  {changingPassword ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                  <span>{changingPassword ? 'Changing Password...' : 'Change Password'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span>Account Information</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-700/20 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-slate-300 text-sm font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-700/20 rounded-lg">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Role</p>
                    <p className="text-slate-300 text-sm font-medium capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-700/20 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30' :
                    user.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-300 dark:border-red-500/30' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-500/30'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showImageCropper && selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowImageCropper(false);
            setSelectedImage('');
          }}
          aspectRatio={1}
        />
      )}
    </div>
  );
} 