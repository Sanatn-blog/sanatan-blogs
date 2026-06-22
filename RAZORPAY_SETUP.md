# Razorpay Integration Setup Guide

This guide will help you set up Razorpay payment gateway for accepting donations on Sanatan Blogs.

## Prerequisites

- A Razorpay account ([Sign up here](https://razorpay.com))
- Node.js and npm installed
- MongoDB database configured

## Setup Steps

### 1. Get Razorpay Credentials

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Generate API keys (if not already generated)
4. You'll get:
   - **Key ID** (starts with `rzp_test_` for test mode or `rzp_live_` for live mode)
   - **Key Secret** (click "Show" to reveal)

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

**Important:**

- Use test credentials (`rzp_test_*`) for development
- Use live credentials (`rzp_live_*`) for production
- Never commit your `.env` file to version control

### 3. Install Dependencies

The Razorpay package has already been installed. If you need to reinstall:

```bash
npm install razorpay
```

### 4. Set Up Webhook (Recommended)

Webhooks allow Razorpay to notify your application about payment events automatically.

1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Click **Create New Webhook**
3. Enter your webhook URL: `https://yourdomain.com/api/payment/webhook`
4. Select events to listen to:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
5. Enter a webhook secret (optional but recommended)
6. Save the webhook

**For local testing:**

- Use tools like [ngrok](https://ngrok.com/) to expose your local server
- Example: `ngrok http 3000`
- Use the ngrok URL for webhook: `https://your-ngrok-url.ngrok.io/api/payment/webhook`

### 5. Test the Integration

#### Test Mode Cards (Razorpay Provides These):

**Successful Payment:**

- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**

- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

#### Test UPI:

- UPI ID: `success@razorpay`

### 6. Go Live

When you're ready to accept real payments:

1. Complete KYC verification in Razorpay Dashboard
2. Activate your account
3. Replace test credentials with live credentials in `.env`
4. Update webhook URL to production URL
5. Test with a small real transaction

## Features Implemented

✅ **Payment Order Creation** - Create payment orders with custom amounts
✅ **Payment Verification** - Verify payment signatures for security
✅ **Webhook Handler** - Automatic payment status updates
✅ **Payment History** - Track all transactions in MongoDB
✅ **One-time Donations** - Accept single donations
✅ **Monthly Donations** - Support for recurring donations (setup required)
✅ **Multiple Payment Methods** - UPI, Cards, Net Banking, Wallets
✅ **Donor Details** - Collect optional donor information
✅ **Success Page** - Confirmation page after successful payment
✅ **Admin Dashboard** - View payment history and statistics

## API Endpoints

### Create Payment Order

```
POST /api/payment/create-order
```

Request:

```json
{
  "amount": 500,
  "currency": "INR",
  "isMonthly": false,
  "email": "donor@example.com",
  "name": "John Doe",
  "phone": "9876543210"
}
```

### Verify Payment

```
POST /api/payment/verify
```

Request:

```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

### Webhook Handler

```
POST /api/payment/webhook
```

### Admin: Get Payment History

```
GET /api/admin/payments?page=1&limit=20&status=paid
```

## Database Schema

Payments are stored in MongoDB with the following structure:

```typescript
{
  orderId: string; // Unique order ID
  razorpayOrderId: string; // Razorpay order ID
  razorpayPaymentId: string; // Razorpay payment ID
  razorpaySignature: string; // Payment signature
  amount: number; // Amount in INR
  currency: string; // Currency code (INR)
  status: string; // created, attempted, paid, failed
  paymentMethod: string; // upi, card, netbanking, wallet
  email: string; // Donor email
  name: string; // Donor name
  phone: string; // Donor phone
  isMonthly: boolean; // Is recurring donation
  notes: object; // Additional metadata
  createdAt: Date;
  updatedAt: Date;
}
```

## Monthly Subscriptions

For monthly recurring donations, you'll need to:

1. Enable **Subscriptions** in Razorpay Dashboard
2. Create subscription plans
3. Modify the code to use Razorpay Subscriptions API

## Security Best Practices

✅ Always verify payment signatures
✅ Use HTTPS in production
✅ Keep API keys secure
✅ Validate webhook signatures
✅ Store sensitive data securely
✅ Implement rate limiting
✅ Log all transactions

## Troubleshooting

### Payment Not Getting Verified

- Check if webhook URL is correct
- Verify webhook secret (if configured)
- Check Razorpay dashboard for payment status
- Review server logs for errors

### Razorpay Script Not Loading

- Check if NEXT_PUBLIC_RAZORPAY_KEY_ID is set
- Verify internet connection
- Check browser console for errors

### Signature Verification Failed

- Ensure RAZORPAY_KEY_SECRET is correct
- Check if payment data is being sent correctly
- Verify the signature generation logic

## Support

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- API Reference: https://razorpay.com/docs/api/

## Testing Checklist

- [ ] Test mode credentials configured
- [ ] Payment order creation works
- [ ] Razorpay checkout opens
- [ ] Test payment succeeds
- [ ] Payment verification works
- [ ] Payment record saved in database
- [ ] Success page displays
- [ ] Webhook receives events
- [ ] Admin can view payments
- [ ] Email receipts sent (if configured)

## Production Checklist

- [ ] Live credentials configured
- [ ] Webhook URL updated
- [ ] KYC completed
- [ ] SSL certificate installed
- [ ] Error logging configured
- [ ] Backup system in place
- [ ] Test transaction completed
- [ ] Email notifications working
- [ ] Admin dashboard accessible
- [ ] Legal terms updated

---

**Need Help?** Contact Razorpay support or refer to their extensive documentation.
