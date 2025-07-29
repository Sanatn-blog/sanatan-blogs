import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  _id: string;
  content: string;
  author: mongoose.Types.ObjectId;
  blog: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  replies: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  isApproved: boolean;
  isReported: boolean;
  reportReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minLength: [1, 'Comment must be at least 1 character'],
    maxLength: [1000, 'Comment cannot exceed 1000 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment author is required']
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: [true, 'Blog reference is required']
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
CommentSchema.index({ blog: 1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ isApproved: 1 });
CommentSchema.index({ createdAt: -1 });

// Simple model registration
const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment; 