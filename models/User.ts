import mongoose, { Document, Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  name: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  location?: string;
  expertise?: string[];
  achievements?: string[];
  followers?: string[];
  following?: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  emailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isVerified?: boolean;
  verifiedAt?: Date;
  isActive?: boolean;
  isTemporary?: boolean;
  otp?: string;
  otpExpiry?: Date;
  googleId?: string;
  facebookId?: string;
  instagramId?: string;
  twitterId?: string;
  authProvider?: 'email' | 'phone' | 'google' | 'facebook' | 'instagram' | 'twitter';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters'],
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    minLength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  bio: {
    type: String,
    maxLength: [500, 'Bio cannot exceed 500 characters']
  },
  socialLinks: {
    twitter: String,
    linkedin: String,
    website: String
  },
  location: {
    type: String,
    maxLength: [100, 'Location cannot exceed 100 characters']
  },
  expertise: [{
    type: String,
    maxLength: [50, 'Expertise item cannot exceed 50 characters']
  }],
  achievements: [{
    type: String,
    maxLength: [200, 'Achievement cannot exceed 200 characters']
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  isActive: {
    type: Boolean,
    default: false
  },
  isTemporary: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpiry: Date,
  googleId: String,
  facebookId: String,
  instagramId: String,
  twitterId: String,
  authProvider: {
    type: String,
    enum: ['email', 'phone', 'google', 'facebook', 'instagram', 'twitter'],
    default: 'email'
  }
}, {
  timestamps: true
});

// Index for better query performance
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (!user.isModified('password') || !user.password) return next();

  try {
    const salt = await bcryptjs.genSalt(12);
    user.password = await bcryptjs.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 