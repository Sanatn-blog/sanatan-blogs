# Newsletter Subscription System

This document describes the newsletter subscription system implemented for the Sanatan Blogs platform.

## Features

- ✅ Email subscription with duplicate prevention
- ✅ Email validation
- ✅ Subscription status management (active/unsubscribed)
- ✅ Admin dashboard for managing subscriptions
- ✅ CSV export functionality
- ✅ Reusable components and hooks
- ✅ Responsive design

## Database Schema

### Subscription Model (`models/Subscription.ts`)

```typescript
interface ISubscription {
  _id: string;
  email: string;                    // Unique email address
  status: 'active' | 'unsubscribed'; // Subscription status
  subscribedAt: Date;               // When they subscribed
  unsubscribedAt?: Date;            // When they unsubscribed (if applicable)
  source?: string;                  // Where the subscription came from
  ipAddress?: string;               // Client IP address
  userAgent?: string;               // Client user agent
}
```

## API Endpoints

### 1. Subscribe to Newsletter
- **POST** `/api/subscribe`
- **Body**: `{ email: string, source?: string }`
- **Response**: Success/error message with status

### 2. Unsubscribe from Newsletter
- **POST** `/api/unsubscribe`
- **Body**: `{ email: string }`
- **Response**: Success/error message

### 3. Admin: Get Subscriptions
- **GET** `/api/admin/subscriptions`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `status`: Filter by status (active/unsubscribed)
  - `search`: Search by email
- **Response**: Paginated subscriptions with statistics

### 4. Admin: Delete Subscription
- **DELETE** `/api/admin/subscriptions?email=user@example.com`
- **Response**: Success/error message

## Components

### 1. Newsletter Component (`components/Newsletter.tsx`)
A reusable newsletter subscription component with multiple variants:

```tsx
<Newsletter
  title="Stay Connected"
  description="Subscribe to our newsletter for the latest updates."
  variant="default" // 'default' | 'minimal' | 'card'
  source="footer"
/>
```

### 2. Footer Integration
The footer component has been updated to use the subscription system with:
- Real-time validation
- Loading states
- Success/error messages
- Duplicate prevention

## Hooks

### useSubscription Hook (`hooks/useSubscription.tsx`)
A custom hook for managing subscriptions:

```tsx
const { subscribe, unsubscribe, isSubmitting, message, clearMessage } = useSubscription();

// Subscribe
const result = await subscribe('user@example.com', 'footer');

// Unsubscribe
const result = await unsubscribe('user@example.com');
```

## Admin Dashboard

### Subscriptions Page (`app/admin/subscriptions/page.tsx`)
Features:
- 📊 Statistics dashboard (total, active, unsubscribed)
- 🔍 Search and filter functionality
- 📄 Pagination
- 📥 CSV export
- 🗑️ Delete subscriptions
- 📱 Responsive design

## Usage Examples

### Basic Subscription Form
```tsx
import { useSubscription } from '@/hooks/useSubscription';

function MyComponent() {
  const { subscribe, isSubmitting, message } = useSubscription();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await subscribe(email, 'my-component');
    if (result.success) {
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
}
```

### Using the Newsletter Component
```tsx
import Newsletter from '@/components/Newsletter';

function MyPage() {
  return (
    <div>
      <h1>Welcome to our blog</h1>
      <Newsletter
        title="Get Weekly Updates"
        description="Never miss our latest spiritual insights."
        variant="card"
        source="blog-page"
      />
    </div>
  );
}
```

## Duplicate Prevention

The system prevents duplicate subscriptions through:

1. **Database-level unique constraint** on the email field
2. **Application-level check** before saving
3. **Case-insensitive email matching**
4. **Graceful handling** of existing subscriptions

### Response Types

- **New subscription**: "Thank you for subscribing to our newsletter!"
- **Already subscribed**: "You are already subscribed to our newsletter!"
- **Resubscribed**: "Welcome back! You have been resubscribed to our newsletter."

## Security Features

- Email validation using regex
- IP address and user agent tracking
- Input sanitization
- Rate limiting (can be added)
- Admin authentication (uses existing auth system)

## Future Enhancements

- [ ] Email verification for new subscriptions
- [ ] Double opt-in functionality
- [ ] Email templates for welcome/unsubscribe
- [ ] Analytics and tracking
- [ ] Bulk email sending functionality
- [ ] Subscription preferences
- [ ] GDPR compliance features

## Testing

To test the subscription system:

1. **Subscribe**: Use the footer form or any Newsletter component
2. **Duplicate test**: Try subscribing the same email twice
3. **Admin access**: Visit `/admin/subscriptions` to view all subscriptions
4. **Export**: Use the CSV export feature in the admin dashboard

## Database Indexes

The following indexes are created for optimal performance:
- `email` (unique)
- `status`
- `subscribedAt` (descending)

## Error Handling

The system handles various error scenarios:
- Invalid email format
- Database connection issues
- Duplicate key violations
- Network errors
- Missing required fields

All errors are logged and appropriate user-friendly messages are displayed. 