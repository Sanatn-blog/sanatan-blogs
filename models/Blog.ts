import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isPublished: boolean;
  publishedAt?: Date;
  views: number;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minLength: [3, 'Title must be at least 3 characters'],
    maxLength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true,
    minLength: [10, 'Excerpt must be at least 10 characters'],
    maxLength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minLength: [50, 'Content must be at least 50 characters']
  },
  featuredImage: {
    type: String,
    default: null
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
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
    ]
  },
  tags: {
    type: [String],
    default: [],
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment',
    default: []
  },
  seo: {
    metaTitle: {
      type: String,
      maxLength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxLength: [160, 'Meta description cannot exceed 160 characters']
    },
    metaKeywords: {
      type: [String],
      default: [],
      trim: true,
      lowercase: true
    }
  },
  readingTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
BlogSchema.index({ author: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ isPublished: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ publishedAt: -1 });
BlogSchema.index({ views: -1 });
BlogSchema.index({ createdAt: -1 });

// Text search index
BlogSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
});

// Calculate reading time before saving
BlogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  // Set published date if status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
    this.isPublished = true;
  }
  
  next();
});

// Generate slug from title
BlogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog; 