'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { 
  User, 
  Save, 
  ArrowLeft,
  Moon,
  Sun,
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
  Upload
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
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  useEffect(() => {
    setMounted(true);
    if (user) {
      loadProfile();
    }
  }, [user]);

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
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
        await uploadResponse.json();
        setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        setAvatarPreview('');
        // Update the user context if needed
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

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">Please log in to access settings</h1>
          <Link href="/login">
            <span className="inline-block px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-medium shadow hover:from-orange-700 hover:to-pink-700 transition-all text-sm sm:text-base">
              Login
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <div className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </div>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 text-sm">Manage your profile and preferences</p>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>

        {/* Profile Image Section */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-500" />
            <span>Profile Picture</span>
          </h2>
          
          <div className="flex items-center space-x-6">
            {/* Current Avatar */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                )}
              </div>
              
              {/* Avatar Preview */}
              {avatarPreview && (
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Update Profile Picture
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Image</span>
                    </label>
                    
                    {avatarPreview && (
                      <button
                        onClick={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-all disabled:cursor-not-allowed"
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
                
                <p className="text-xs text-gray-400">
                  Recommended: Square image, at least 200x200 pixels. JPG, PNG, or GIF up to 5MB.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-900/20 border-green-700 text-green-300' 
              : 'bg-red-900/20 border-red-700 text-red-300'
          }`}>
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <User className="w-5 h-5 text-orange-500" />
                <span>Basic Information</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{form.bio.length}/500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your location"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span>Expertise</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add your expertise"
                  />
                  <button
                    onClick={addExpertise}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {form.expertise.map((item, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-300"
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => removeExpertise(index)}
                        className="text-blue-400 hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Achievements</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Add your achievement"
                  />
                  <button
                    onClick={addAchievement}
                    className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {form.achievements.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg"
                    >
                      <span className="text-yellow-300">{item}</span>
                      <button
                        onClick={() => removeAchievement(index)}
                        className="text-yellow-400 hover:text-yellow-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-500" />
                <span>Social Links</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={form.socialLinks.twitter}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={form.socialLinks.linkedin}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={form.socialLinks.facebook}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={form.socialLinks.website}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, website: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={form.socialLinks.instagram}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">YouTube</label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={form.socialLinks.youtube}
                      onChange={(e) => setForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://youtube.com/@channel"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Button */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 disabled:from-orange-400 disabled:to-pink-400 text-white rounded-xl font-medium transition-all"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            {/* Account Info */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm capitalize">{user.role}</span>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'approved' ? 'bg-green-900/30 text-green-300' :
                  user.status === 'rejected' ? 'bg-red-900/30 text-red-300' :
                  'bg-yellow-900/30 text-yellow-300'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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