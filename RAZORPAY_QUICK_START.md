# Razorpay Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Razorpay Credentials

1. Sign up at [Razorpay](https://razorpay.com) (if you haven't)
2. Go to **Settings** → **API Keys** in your dashboard
3. Generate test keys (for development)

### Step 2: Add to Your .env File

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

### Step 3: Start Your Server

```bash
npm run dev
```

### Step 4: Test the Payment

1. Go to `http://localhost:3000/donate`
2. Select an amount or enter custom amount
3. Fill in optional donor details
4. Click "Donate" button
5. Use test card: `4111 1111 1111 1111`, CVV: `123`, Expiry: Any future date
6. Complete payment

### Step 5: Verify Success

After payment, you should be redirected to the success page at `/donate/success`.

## 🧪 Test Cards

**Success:**

- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**

- Card: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI:**

- UPI ID: `success@razorpay`

## 📁 Files Created

### Backend

- `/lib/razorpay.ts` - Razorpay configuration
- `/models/Payment.ts` - Payment database model
- `/app/api/payment/create-order/route.ts` - Create payment orders
- `/app/api/payment/verify/route.ts` - Verify payments
- `/app/api/payment/webhook/route.ts` - Handle webhooks
- `/app/api/admin/payments/route.ts` - Admin payment history

### Frontend

- `/hooks/useRazorpay.tsx` - Payment processing hook
- `/app/donate/page.tsx` - Updated with Razorpay integration
- `/app/donate/success/page.tsx` - Success confirmation page
- `/types/razorpay.d.ts` - TypeScript declarations

### Documentation

- `/RAZORPAY_SETUP.md` - Complete setup guide
- `/RAZORPAY_QUICK_START.md` - This file

## 💰 Payment Flow

1. **User clicks "Donate"** → Creates order via `/api/payment/create-order`
2. **Razorpay checkout opens** → User enters payment details
3. **Payment processed** → Razorpay handles transaction
4. **Verification** → `/api/payment/verify` confirms signature
5. **Success page** → User sees confirmation
6. **Webhook** → Razorpay sends status updates to `/api/payment/webhook`

## 🎯 What Works Now

✅ Accept donations via Razorpay
✅ Support UPI, Cards, Net Banking, Wallets
✅ One-time and monthly donations
✅ Collect optional donor information
✅ Verify payment signatures securely
✅ Store payment records in MongoDB
✅ Show success confirmation page
✅ Webhook for automatic updates
✅ Admin payment history API

## 🔄 Next Steps

1. **Add environment variables** to your `.env` file
2. **Test in development** using test credentials
3. **Complete Razorpay KYC** for live mode
4. **Set up webhook** for production
5. **Switch to live keys** when ready

## 🔐 Security Notes

- Never commit `.env` file
- Always verify payment signatures
- Use HTTPS in production
- Validate all inputs
- Store keys securely

## 📞 Need Help?

- Razorpay Docs: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- Full Setup Guide: See `RAZORPAY_SETUP.md`

## 🐛 Common Issues

**"Payment gateway is loading"**

- Wait a few seconds for Razorpay script to load
- Check browser console for errors

**"Failed to create order"**

- Verify environment variables are set
- Check MongoDB connection
- Review server logs

**Payment succeeds but not verified**

- Check webhook configuration
- Verify signature logic
- Review Razorpay dashboard

---

Happy accepting payments! 🎉
