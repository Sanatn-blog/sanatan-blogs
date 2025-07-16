'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Save, 
  Eye, 
  Send, 
  Bold, 
  Italic, 
  List, 
  Hash,
  Quote,
  Link2,
  Trash2,
  Loader2,
  Upload
} from 'lucide-react';
import Image from 'next/image';

const categories = [
  'Technology',
  'Spirituality', 
  'Culture',
  'Philosophy',
  'Health',
  'Education',
  'Lifestyle',
  'Art',
  'Science',
  'Politics',
  'Environment',
  'Other'
];

interface BlogData {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: 'draft' | 'published' | 'archived';
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export default function WriteBlog() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editBlogId = searchParams.get('edit');

  const [formData, setFormData] = useState<BlogData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featuredImage: '',
    status: 'draft',
    seo: {
      title: '',
      description: '',
      keywords: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  // const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  // const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  // Auto-save functionality (temporarily disabled for debugging)
  // const autoSave = useCallback(async () => {
  //   if (!formData.title && !formData.content) return;
    
  //   setAutoSaveStatus('saving');
  //   try {
  //     const response = await fetch('/api/blogs', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //       },
  //       body: JSON.stringify({
  //         ...formData,
  //         status: 'draft'
  //       })
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       if (!formData._id) {
  //         // Update the form data with the new blog ID
  //         setFormData(prev => ({ ...prev, _id: data.blog._id }));
  //       }
  //       setAutoSaveStatus('saved');
  //       setLastSaved(new Date());
  //     } else {
  //       setAutoSaveStatus('error');
  //     }
  //   } catch {
  //     setAutoSaveStatus('error');
  //   }
  // }, [formData]);

  // Auto-save functionality (temporarily disabled for debugging)
  // useEffect(() => {
  //   if (!formData.title && !formData.content) return;

  //   const autoSaveTimer = setTimeout(async () => {
  //     if (formData.title || formData.content) {
  //       await autoSave();
  //     }
  //   }, 3000); // Auto-save after 3 seconds of inactivity

  //   return () => clearTimeout(autoSaveTimer);
  // }, [formData.title, formData.content, formData.excerpt, autoSave]);

  const loadBlogForEditing = useCallback(async () => {
    if (!editBlogId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/blogs/${editBlogId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle both direct blog object (for drafts) and nested blog object (for published)
        const blog = data.blog || data;
        
        setFormData({
          _id: blog._id,
          title: blog.title || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          category: blog.category || '',
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          featuredImage: blog.featuredImage || '',
          status: blog.status || 'draft',
          seo: blog.seo || {
            title: '',
            description: '',
            keywords: ''
          }
        });
      } else {
        setErrors({ submit: 'Failed to load blog for editing' });
      }
    } catch {
      setErrors({ submit: 'Failed to load blog for editing' });
    } finally {
      setIsLoading(false);
    }
  }, [editBlogId]);

  // Load existing blog for editing
  useEffect(() => {
    if (editBlogId) {
      loadBlogForEditing();
    }
  }, [editBlogId, loadBlogForEditing]);

  // Redirect if not authenticated
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  // Redirect if user is not approved
  if (!loading && user && user.status !== 'approved') {
    router.push('/');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !(formData.tags || []).includes(tagInput.trim().toLowerCase())) {
      const newTag = tagInput.trim().toLowerCase();
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ image: 'Image size must be less than 10MB' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ image: 'Please select a valid image file' });
      return;
    }

    // Store the file for later upload and create preview
    setSelectedImageFile(file);
    setErrors({ image: '' });

    // Create preview URL and update form data
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      featuredImage: previewUrl
    }));
  };

  const validateForm = (): boolean => {
    console.log('Validating form...');
    const newErrors: Record<string, string> = {};

    if (!(formData.title || '').trim()) {
      newErrors.title = 'Title is required';
    } else if ((formData.title || '').length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!(formData.excerpt || '').trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if ((formData.excerpt || '').length < 10) {
      newErrors.excerpt = 'Excerpt must be at least 10 characters';
    }

    if (!(formData.content || '').trim()) {
      newErrors.content = 'Content is required';
    } else if ((formData.content || '').length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    return isValid;
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    console.log('Submitting blog with status:', status);
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setErrors({ submit: '' });

    try {
      let finalImageUrl = formData.featuredImage || '';

      // Upload image to Cloudinary only when publishing
      if (status === 'published' && selectedImageFile && (formData.featuredImage || '').startsWith('blob:')) {
        console.log('Uploading image to Cloudinary...');
        setUploadingImage(true);
        
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedImageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: formDataUpload
        });

        if (uploadResponse.ok) {
          const uploadResponseText = await uploadResponse.text();
          let uploadData;
          try {
            uploadData = uploadResponseText ? JSON.parse(uploadResponseText) : {};
          } catch (parseError) {
            console.error('Failed to parse upload response as JSON:', parseError);
            throw new Error('Invalid upload response');
          }
          
          finalImageUrl = uploadData.url;
          console.log('Image uploaded successfully:', finalImageUrl);
        } else {
          const uploadResponseText = await uploadResponse.text();
          let errorData;
          try {
            errorData = uploadResponseText ? JSON.parse(uploadResponseText) : {};
          } catch (parseError) {
            console.error('Failed to parse upload error response:', parseError);
            errorData = { error: 'Upload failed' };
          }
          throw new Error(errorData.error || `Failed to upload image (Status: ${uploadResponse.status})`);
        }
      }

      const url = formData._id ? `/api/blogs/${formData._id}` : '/api/blogs';
      const method = formData._id ? 'PUT' : 'POST';
      
      const requestBody = {
        ...formData,
        featuredImage: finalImageUrl,
        status
      };
      
      console.log('Making request to:', url);
      console.log('Request body:', requestBody);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      // Check if response has content
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        data = { error: 'Invalid server response' };
      }
      
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Blog saved successfully');
        // Show success message and redirect
        alert(status === 'published' ? '🎉 Blog published successfully!' : '💾 Draft saved successfully!');
        router.push('/dashboard/blogs');
      } else {
        console.error('Blog save failed:', data.error);
        setErrors({ submit: data.error || `Failed to save blog (Status: ${response.status})` });
      }
    } catch (error) {
      console.error('Blog save error:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save blog. Please check your internet connection.' });
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleTextFormatting = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);
    
    let replacement = '';
    switch (format) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        replacement = `## ${selectedText || 'Heading'}`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'List item'}`;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'Quote text'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link text'}](URL)`;
        break;
    }

    const newContent = 
      (formData.content || '').slice(0, start) + 
      replacement + 
      (formData.content || '').slice(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-orange-600 mx-auto"></Loader2>
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Loading blog for editing...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editBlogId ? '✏️ Edit Blog' : '✍️ Write New Blog'}
              </h1>
              <p className="text-gray-600 mt-2">
                {editBlogId ? 'Update your blog post' : 'Share your thoughts with the world'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Auto-save status (temporarily disabled) */}
              {/* <div className="flex items-center space-x-2 text-sm">
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                )}
                {autoSaveStatus === 'saved' && lastSaved && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
                {autoSaveStatus === 'error' && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Save failed</span>
                  </div>
                )}
              </div> */}
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-orange-600 border border-gray-300 rounded-lg hover:border-orange-300 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? 'Edit' : 'Preview'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!showPreview ? (
              <>
                {/* Title */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📝 Blog Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter an engaging title for your blog..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg placeholder-gray-400 text-gray-900 bg-white"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      ⚠️ {errors.title}
                    </p>
                  )}
                </div>

                {/* Excerpt */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📄 Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt || ''}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Write a compelling summary that makes readers want to know more..."
                    rows={3}
                    maxLength={300}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none placeholder-gray-400 text-gray-900 bg-white"
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.excerpt && (
                      <p className="text-red-600 text-sm">⚠️ {errors.excerpt}</p>
                    )}
                    <p className="text-gray-500 text-sm ml-auto">
                      {(formData.excerpt || '').length}/300
                    </p>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ✨ Content *
                  </label>
                  
                  {/* Formatting Toolbar */}
                  <div className="flex items-center flex-wrap gap-2 mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                    <span className="text-sm font-medium text-gray-600 mr-2">Format:</span>
                    <button
                      type="button"
                      onClick={() => handleTextFormatting('bold')}
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-white rounded transition-colors"
                      title="Bold (Ctrl+B)"
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTextFormatting('italic')}
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-white rounded transition-colors"
                      title="Italic (Ctrl+I)"
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => handleTextFormatting('heading')}
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-white rounded transition-colors"
                      title="Heading"
                    >
                      <Hash className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTextFormatting('list')}
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-white rounded transition-colors"
                      title="Bullet List"
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTextFormatting('quote')}
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-white rounded transition-colors"
                      title="Quote"
                    >
                      <Quote className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTextFormatting('link')}
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-white rounded transition-colors"
                      title="Insert Link"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                  </div>

                  <textarea
                    id="content"
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Start writing your amazing content here...

Example:
## Main Topic

You can write your thoughts here...

**Important Points:**
- First point
- Second point

> 'A good quote will come here'"
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-mono text-sm placeholder-gray-400 leading-relaxed text-gray-900 bg-white"
                  />
                  {errors.content && (
                    <p className="text-red-600 text-sm mt-2">⚠️ {errors.content}</p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-500 text-sm">
                      📊 {(formData.content || '').length} characters
                    </p>
                    <p className="text-gray-500 text-sm">
                      ⏱️ ~{Math.ceil((formData.content || '').length / 1000)} min read
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Preview Mode */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="mb-4">
                  <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                    👁️ Preview Mode
                  </span>
                </div>
                <article className="prose max-w-none">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {formData.title || '📝 Your Blog Title Here'}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-6">
                    <span>👤 {user?.name}</span>
                    <span>📅 {new Date().toLocaleDateString()}</span>
                    <span>🏷️ {formData.category || 'Category'}</span>
                  </div>
                  <p className="text-gray-600 text-lg mb-8 font-medium border-l-4 border-orange-500 pl-4 bg-orange-50 py-3">
                    {formData.excerpt || '📄 Your blog excerpt will appear here...'}
                  </p>
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {formData.content || '✨ Your amazing content will be displayed here...'}
                  </div>
                </article>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {isSubmitting 
                    ? ((formData.status || 'draft') === 'draft' ? '💾 Saving draft...' : '🚀 Publishing...') 
                    : '✅ Ready to save'
                  }
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSubmit('draft')}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    <span>💾 Save Draft</span>
                  </button>
                  <button
                    onClick={() => handleSubmit('published')}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <Send className="h-4 w-4" />
                    <span>🚀 {editBlogId ? 'Update And Publish' : 'Publish Now'}</span>
                  </button>
                </div>
              </div>
              {errors.submit && (
                <p className="text-red-600 text-sm mt-3 p-3 bg-red-50 rounded-lg">
                  ❌ {errors.submit}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Featured Image</h3>
              
              {formData.featuredImage && formData.featuredImage !== '' ? (
                <div className="relative group">
                  <Image
                    src={formData.featuredImage}
                    alt="Featured"
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, featuredImage: '' }));
                      setSelectedImageFile(null);
                      if ((formData.featuredImage || '').startsWith('blob:')) {
                        URL.revokeObjectURL(formData.featuredImage || '');
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group"
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
                      <p className="text-orange-600 font-medium">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
                      <p className="text-gray-600 group-hover:text-orange-600 font-medium">
                        📸 Click to upload featured image
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        JPG, PNG up to 10MB
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                  />
                </div>
              )}
              {errors.image && (
                <p className="text-red-600 text-sm mt-2">⚠️ {errors.image}</p>
              )}
            </div>

            {/* Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏷️ Category *</h3>
              <select
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Select category...</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-2">⚠️ {errors.category}</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏷️ Tags</h3>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-sm rounded-full border border-orange-300"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-orange-600 hover:text-orange-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {formData.tags.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">
                  💡 Add relevant tags to help readers find your content
                </p>
              )}
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo.title || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, title: e.target.value }
                    }))}
                    placeholder="SEO friendly title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seo.description || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, description: e.target.value }
                    }))}
                    placeholder="Brief description for search engines..."
                    rows={3}
                    maxLength={160}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 bg-white"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    {(formData.seo.description || '').length}/160 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.seo.keywords || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, keywords: e.target.value }
                    }))}
                    placeholder="keyword1, keyword2, keyword3..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Writing Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Use engaging headlines</li>
                <li>• Add relevant images</li>
                <li>• Keep paragraphs short</li>
                <li>• Use bullet points</li>
                <li>• Include a call-to-action</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 