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
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  FileText,
  Tag,
  Search,
  Sparkles,
  Strikethrough,
  Code,
  ListOrdered,
  Minus,
  Table,
  Type
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

const tagSuggestions = {
  'Technology': ['programming', 'ai', 'machine learning', 'web development', 'cybersecurity', 'blockchain', 'cloud computing', 'mobile apps'],
  'Spirituality': ['meditation', 'yoga', 'mindfulness', 'consciousness', 'enlightenment', 'karma', 'dharma', 'sanskrit'],
  'Culture': ['traditions', 'festivals', 'heritage', 'customs', 'religion', 'art', 'music', 'dance'],
  'Philosophy': ['wisdom', 'ethics', 'metaphysics', 'logic', 'existentialism', 'stoicism', 'buddhism', 'hinduism'],
  'Health': ['wellness', 'nutrition', 'fitness', 'mental health', 'ayurveda', 'yoga', 'meditation', 'holistic'],
  'Education': ['learning', 'knowledge', 'wisdom', 'teaching', 'students', 'academic', 'research', 'study'],
  'Lifestyle': ['wellness', 'productivity', 'happiness', 'balance', 'mindfulness', 'self-improvement', 'habits'],
  'Art': ['creativity', 'painting', 'sculpture', 'music', 'dance', 'literature', 'poetry', 'design'],
  'Science': ['research', 'discovery', 'innovation', 'experiments', 'theories', 'physics', 'chemistry', 'biology'],
  'Politics': ['governance', 'democracy', 'policy', 'social issues', 'activism', 'leadership', 'reform'],
  'Environment': ['sustainability', 'climate change', 'conservation', 'green living', 'ecology', 'renewable energy'],
  'Other': ['general', 'miscellaneous', 'various', 'diverse', 'interesting', 'unique', 'special']
};

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
  const [tagInputError, setTagInputError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

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

  const validateForm = useCallback((): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.title, formData.excerpt, formData.content, formData.category]);

  const handleSubmit = useCallback(async (status: 'draft' | 'published') => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({ submit: '' });

    try {
      let finalImageUrl = formData.featuredImage || '';

      if (selectedImageFile && (formData.featuredImage || '').startsWith('blob:')) {
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
          } catch {
            throw new Error('Invalid upload response');
          }
          
          finalImageUrl = uploadData.url;
        } else {
          const uploadResponseText = await uploadResponse.text();
          let errorData;
          try {
            errorData = uploadResponseText ? JSON.parse(uploadResponseText) : {};
          } catch {
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

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { error: 'Invalid server response' };
      }

      if (response.ok) {
        alert(status === 'published' ? '🎉 Blog published successfully!' : '💾 Draft saved successfully!');
        router.push('/dashboard/blogs');
      } else {
        setErrors({ submit: data.error || `Failed to save blog (Status: ${response.status})` });
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save blog. Please check your internet connection.' });
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  }, [formData, selectedImageFile, validateForm, router]);

  const handleTextFormatting = useCallback((format: string) => {
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
      case 'strikethrough':
        replacement = `~~${selectedText || 'strikethrough text'}~~`;
        break;
      case 'heading':
        replacement = `## ${selectedText || 'Heading'}`;
        break;
      case 'subheading':
        replacement = `### ${selectedText || 'Subheading'}`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'List item'}`;
        break;
      case 'numbered-list':
        replacement = `\n1. ${selectedText || 'Numbered item'}`;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'Quote text'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link text'}](URL)`;
        break;
      case 'inline-code':
        replacement = `\`${selectedText || 'code'}\``;
        break;
      case 'code-block':
        replacement = `\`\`\`\n${selectedText || 'Your code here'}\n\`\`\``;
        break;
      case 'table':
        replacement = `\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n`;
        break;
      case 'horizontal-rule':
        replacement = `\n---\n`;
        break;
      case 'image':
        replacement = `![${selectedText || 'Alt text'}](image-url)`;
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
  }, [formData.content]);

  useEffect(() => {
    if (editBlogId) {
      loadBlogForEditing();
    }
  }, [editBlogId, loadBlogForEditing]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            handleTextFormatting('bold');
            break;
          case 'i':
            e.preventDefault();
            handleTextFormatting('italic');
            break;
          case 'k':
            e.preventDefault();
            setShowKeyboardShortcuts(!showKeyboardShortcuts);
            break;
          case 's':
            e.preventDefault();
            handleSubmit('draft');
            break;
          case 'p':
            e.preventDefault();
            setShowPreview(!showPreview);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showKeyboardShortcuts, showPreview, handleSubmit, handleTextFormatting]);

  if (!loading && !user) {
    router.push('/login');
    return null;
  }

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
    const trimmedTag = tagInput.trim();
    
    // Validation checks
    if (!trimmedTag) {
      return;
    }
    
    // Check tag length (1-20 characters)
    if (trimmedTag.length < 1 || trimmedTag.length > 20) {
      setErrors(prev => ({ ...prev, tags: 'Tags must be between 1 and 20 characters' }));
      return;
    }
    
    // Check for special characters (only allow letters, numbers, hyphens, and spaces)
    if (!/^[a-zA-Z0-9\s-]+$/.test(trimmedTag)) {
      setErrors(prev => ({ ...prev, tags: 'Tags can only contain letters, numbers, spaces, and hyphens' }));
      return;
    }
    
    // Check maximum number of tags (limit to 10)
    if ((formData.tags || []).length >= 10) {
      setErrors(prev => ({ ...prev, tags: 'Maximum 10 tags allowed' }));
      return;
    }
    
    // Format tag: lowercase, replace multiple spaces with single space, trim
    const formattedTag = trimmedTag.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Check for duplicates (case-insensitive)
    if ((formData.tags || []).some(tag => tag.toLowerCase() === formattedTag)) {
      setErrors(prev => ({ ...prev, tags: 'This tag already exists' }));
      return;
    }
    
    // Add tag
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), formattedTag]
    }));
    setTagInput('');
    setErrors(prev => ({ ...prev, tags: '' }));
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const validateTagInput = (input: string) => {
    if (!input.trim()) {
      setTagInputError('');
      return true;
    }
    
    if (input.length > 20) {
      setTagInputError('Tag must be 20 characters or less');
      return false;
    }
    
    if (!/^[a-zA-Z0-9\s-]+$/.test(input)) {
      setTagInputError('Tags can only contain letters, numbers, spaces, and hyphens');
      return false;
    }
    
    setTagInputError('');
    return true;
  };

  const addSuggestedTag = (suggestedTag: string) => {
    // Check if tag already exists
    if ((formData.tags || []).some(tag => tag.toLowerCase() === suggestedTag.toLowerCase())) {
      return;
    }
    
    // Check maximum number of tags
    if ((formData.tags || []).length >= 10) {
      setErrors(prev => ({ ...prev, tags: 'Maximum 10 tags allowed' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), suggestedTag]
    }));
    setErrors(prev => ({ ...prev, tags: '' }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ image: 'Image size must be less than 10MB' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors({ image: 'Please select a valid image file' });
      return;
    }

    setSelectedImageFile(file);
    setErrors({ image: '' });

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      featuredImage: previewUrl
    }));
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <p className="mt-6 text-gray-300 text-lg">
            {isLoading ? 'Loading blog for editing...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">
                  {editBlogId ? 'Edit Blog' : 'Write Blog'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  showPreview 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">{showPreview ? 'Edit' : 'Preview'}</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSubmit('draft')}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save Draft</span>
                </button>
                
                <button
                  onClick={() => handleSubmit('published')}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {editBlogId ? 'Update & Publish' : 'Publish'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            {!showPreview ? (
              <>
                {/* Title Input */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter an engaging title for your blog..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg placeholder-gray-400 text-white transition-all duration-200"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Excerpt Input */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt || ''}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Write a compelling summary that makes readers want to know more..."
                    rows={3}
                    maxLength={300}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none placeholder-gray-400 text-white transition-all duration-200"
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.excerpt && (
                      <p className="text-red-400 text-sm flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {errors.excerpt}
                      </p>
                    )}
                    <p className="text-gray-400 text-sm ml-auto">
                      {(formData.excerpt || '').length}/300
                    </p>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Content *
                  </label>
                  
                  {/* Formatting Toolbar */}
                  <div className="flex items-center flex-wrap gap-2 mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <span className="text-sm font-medium text-gray-400 mr-2">Format:</span>
                    
                    {/* Text Formatting */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('bold')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('italic')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('strikethrough')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Strikethrough"
                      >
                        <Strikethrough className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Headings */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('heading')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Heading (H2)"
                      >
                        <Hash className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('subheading')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Subheading (H3)"
                      >
                        <Type className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Lists */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('list')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Bullet List"
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('numbered-list')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Numbered List"
                      >
                        <ListOrdered className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Code & Technical */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('inline-code')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Inline Code"
                      >
                        <Code className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('code-block')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Code Block"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Media & Structure */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('quote')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Quote"
                      >
                        <Quote className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('link')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Insert Link"
                      >
                        <Link2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('image')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Insert Image"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Advanced Formatting */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('table')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Insert Table"
                      >
                        <Table className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTextFormatting('horizontal-rule')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Horizontal Rule"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Help */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded transition-all duration-200"
                        title="Keyboard Shortcuts (Ctrl+K)"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    id="content"
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Start writing your amazing content here...

Example:
## Main Topic

### Subheading

You can write your thoughts here...

**Important Points:**
- First point
- Second point

1. Numbered point
2. Another numbered point

> 'A good quote will come here'

`inline code` or ```code blocks```

~~strikethrough text~~

| Table | Header | Example |
|-------|--------|---------|
| Cell  | Data   | Info    |

---

![Image Alt](image-url)"
                    rows={20}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm placeholder-gray-400 leading-relaxed text-white transition-all duration-200"
                  />
                  {errors.content && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {errors.content}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-400 text-sm">
                      📊 {(formData.content || '').length} characters
                    </p>
                    <p className="text-gray-400 text-sm">
                      ⏱️ ~{Math.ceil((formData.content || '').length / 1000)} min read
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Preview Mode */
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
                <div className="mb-6">
                  <span className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center w-fit">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview Mode
                  </span>
                </div>
                <article className="prose prose-invert max-w-none">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {formData.title || '📝 Your Blog Title Here'}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-400 mb-6">
                    <span className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full mr-2"></div>
                      {user?.name}
                    </span>
                    <span>📅 {new Date().toLocaleDateString()}</span>
                    <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                      {formData.category || 'Category'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-lg mb-8 font-medium border-l-4 border-purple-500 pl-4 bg-gray-700 py-3 rounded-r">
                    {formData.excerpt || '📄 Your blog excerpt will appear here...'}
                  </p>
                  <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                    {formData.content || '✨ Your amazing content will be displayed here...'}
                  </div>
                </article>
              </div>
            )}

            {/* Error Display */}
            {errors.submit && (
              <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
                <p className="text-red-400 text-sm flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-1">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'content'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'settings'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>

            {activeTab === 'content' ? (
              <>
                {/* Featured Image */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Featured Image
                  </h3>
                  
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
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-gray-700 transition-all duration-200 group"
                    >
                      {uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-12 w-12 text-purple-500 animate-spin mx-auto mb-4" />
                          <p className="text-purple-400 font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-gray-500 group-hover:text-purple-500 mx-auto mb-4 transition-colors duration-200" />
                          <p className="text-gray-400 group-hover:text-purple-400 font-medium">
                            Click to upload featured image
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
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
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {errors.image}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Category *
                  </h3>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                  >
                    <option value="">Select category...</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Tags
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTagInput(value);
                        validateTagInput(value);
                        if (errors.tags) {
                          setErrors(prev => ({ ...prev, tags: '' }));
                        }
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag (1-20 characters)..."
                      maxLength={20}
                      className={`flex-1 px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200 ${
                        tagInputError ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    <button
                      onClick={addTag}
                      disabled={!tagInput.trim() || (formData.tags || []).length >= 10 || !!tagInputError}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                      title={
                        !tagInput.trim() ? 'Enter a tag' : 
                        (formData.tags || []).length >= 10 ? 'Maximum 10 tags reached' : 
                        tagInputError ? 'Fix tag format' : 'Add tag'
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Tag count and validation */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 text-sm">
                      {(formData.tags || []).length}/10 tags
                    </span>
                    {tagInput && (
                      <span className={`text-sm ${tagInputError ? 'text-red-400' : 'text-gray-400'}`}>
                        {tagInput.length}/20 characters
                      </span>
                    )}
                  </div>
                  
                  {/* Real-time validation error */}
                  {tagInputError && (
                    <p className="text-red-400 text-sm mb-3 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {tagInputError}
                    </p>
                  )}
                  
                  {/* Error message */}
                  {errors.tags && (
                    <p className="text-red-400 text-sm mb-3 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {errors.tags}
                    </p>
                  )}
                  
                  {/* Tags display */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(formData.tags || []).map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm rounded-full border border-purple-500 hover:border-purple-400 transition-all duration-200 group"
                      >
                        <span className="mr-1">#</span>
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-purple-200 hover:text-white font-bold transition-colors duration-200 opacity-70 group-hover:opacity-100"
                          title="Remove tag"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {/* Tag suggestions */}
                  {formData.category && tagSuggestions[formData.category as keyof typeof tagSuggestions] && (
                    <div className="mt-4">
                      <p className="text-gray-400 text-sm mb-2 flex items-center">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Suggested tags for {formData.category}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tagSuggestions[formData.category as keyof typeof tagSuggestions]
                          .filter(suggestion => !(formData.tags || []).some(tag => tag.toLowerCase() === suggestion.toLowerCase()))
                          .slice(0, 6)
                          .map(suggestion => (
                            <button
                              key={suggestion}
                              onClick={() => addSuggestedTag(suggestion)}
                              disabled={(formData.tags || []).length >= 10}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-300 text-sm rounded-full border border-gray-600 hover:border-gray-500 transition-all duration-200 disabled:cursor-not-allowed"
                              title="Click to add this tag"
                            >
                              + {suggestion}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Help text */}
                  {formData.tags.length === 0 ? (
                    <p className="text-gray-500 text-sm mt-3">
                      💡 Add relevant tags to help readers find your content
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm mt-3">
                      ✨ Tags help categorize your content and improve discoverability
                    </p>
                  )}
                </div>
              </>
            ) : (
              /* Settings Tab */
              <div className="space-y-6">
                {/* SEO Settings */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    SEO Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
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
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
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
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-white transition-all duration-200"
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        {(formData.seo.description || '').length}/160 characters
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
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
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        Separate keywords with commas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Writing Tips */}
                <div className="bg-gradient-to-r from-purple-900/20 to-orange-900/20 rounded-xl border border-purple-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Writing Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Use engaging headlines
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Add relevant images
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Keep paragraphs short
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Use bullet points
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Include a call-to-action
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-5">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Bold</span>
                <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Ctrl+B</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Italic</span>
                <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Ctrl+I</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Show Shortcuts</span>
                <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Ctrl+K</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Save Draft</span>
                <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Ctrl+S</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Preview</span>
                <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Ctrl+P</kbd>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-gray-400 text-xs">
                💡 Tip: Use the toolbar buttons for quick formatting or learn markdown syntax for more control.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 