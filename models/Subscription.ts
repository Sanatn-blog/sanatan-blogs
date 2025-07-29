import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: Date;
  unsubscribedAt?: Date;
  source?: string; // Where the subscription came from (footer, popup, etc.)
  ipAddress?: string;
  userAgent?: string;
}

const SubscriptionSchema = new Schema<ISubscription>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  source: {
    type: String,
    default: 'footer'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ subscribedAt: -1 });

// Remove sensitive fields from JSON output
SubscriptionSchema.methods.toJSON = function() {
  const subscriptionObject = this.toObject();
  delete subscriptionObject.ipAddress;
  delete subscriptionObject.userAgent;
  return subscriptionObject;
};

// Simple model registration
const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription; 