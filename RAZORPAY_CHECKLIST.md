# Razorpay Go-Live Checklist

Use this checklist to ensure your Razorpay integration is production-ready.

## 🔧 Development Setup

- [ ] Razorpay package installed (`npm install razorpay`)
- [ ] Environment variables added to `.env`
- [ ] Test API keys configured
- [ ] MongoDB connection working
- [ ] All files created and accessible

## 🧪 Testing Phase

### Basic Functionality

- [ ] Can create payment orders
- [ ] Razorpay checkout opens successfully
- [ ] Test payment succeeds with test card
- [ ] Payment verification works
- [ ] Payment record saved in database
- [ ] Success page displays correctly
- [ ] Payment failure handled gracefully

### Test Scenarios

- [ ] Test with different amounts
- [ ] Test with minimum amount (₹1)
- [ ] Test with maximum amount
- [ ] Test one-time donation
- [ ] Test monthly donation (if implemented)
- [ ] Test with donor details filled
- [ ] Test without donor details
- [ ] Test payment cancellation
- [ ] Test payment failure
- [ ] Test invalid signature

### Payment Methods

- [ ] Test UPI payment
- [ ] Test Credit Card payment
- [ ] Test Debit Card payment
- [ ] Test Net Banking (if available)
- [ ] Test Wallet payment (if available)

### Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Responsive Design

- [ ] Desktop view works
- [ ] Tablet view works
- [ ] Mobile view works
- [ ] Payment modal responsive

## 🔐 Security Checklist

- [ ] Payment signatures verified
- [ ] Webhook signatures verified
- [ ] Environment variables not committed to git
- [ ] `.env` file in `.gitignore`
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF tokens (if applicable)
- [ ] Rate limiting considered
- [ ] Error messages don't leak sensitive info

## 📊 Database & Backend

- [ ] Payment model created
- [ ] Indexes created for performance
- [ ] Database queries optimized
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Backup strategy in place
- [ ] Database connection pooling configured

## 🎨 Frontend & UX

- [ ] Loading states shown
- [ ] Error messages user-friendly
- [ ] Success confirmation clear
- [ ] Payment amount clearly displayed
- [ ] Currency symbol correct (₹)
- [ ] Donor details optional/required as intended
- [ ] Social sharing works
- [ ] Navigation clear
- [ ] Accessibility tested

## 🔔 Webhooks

- [ ] Webhook URL configured in Razorpay
- [ ] Webhook secret set (if using)
- [ ] Webhook endpoint accessible
- [ ] Webhook signature verification working
- [ ] All event types handled
- [ ] Webhook failures logged
- [ ] Retry mechanism understood

## 📧 Notifications (Optional but Recommended)

- [ ] Email service configured
- [ ] Receipt email template created
- [ ] Thank you email template created
- [ ] Admin notification email set up
- [ ] Email sending tested
- [ ] Unsubscribe link included
- [ ] Email logging implemented

## 📱 Admin Dashboard (Recommended)

- [ ] Admin authentication working
- [ ] Payment list page created
- [ ] Filters working (status, date, amount)
- [ ] Pagination implemented
- [ ] Search functionality added
- [ ] Export to CSV/Excel available
- [ ] Statistics displayed
- [ ] Charts/graphs implemented

## 🚀 Production Preparation

### Razorpay Account

- [ ] KYC verification completed
- [ ] Business details verified
- [ ] Bank account linked
- [ ] Live mode activated
- [ ] Live API keys generated
- [ ] Payment methods enabled
- [ ] Settlement schedule configured

### Environment Configuration

- [ ] Production `.env` created
- [ ] Live API keys added
- [ ] Live webhook URL configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] HTTPS enforced

### Deployment

- [ ] Code reviewed
- [ ] Tests passing
- [ ] Build successful
- [ ] Deployed to production
- [ ] DNS configured
- [ ] CDN configured (if using)
- [ ] Monitoring set up

### Legal & Compliance

- [ ] Terms & Conditions updated
- [ ] Privacy Policy updated
- [ ] Refund Policy defined
- [ ] Tax compliance verified (if applicable)
- [ ] PCI DSS compliance understood
- [ ] GDPR compliance (if applicable)

## ✅ Final Checks Before Launch

- [ ] Small test payment with live keys successful
- [ ] Payment appears in Razorpay Dashboard
- [ ] Payment recorded in database
- [ ] Webhook received and processed
- [ ] Email notification sent (if configured)
- [ ] Settlement to bank account verified
- [ ] Refund process tested
- [ ] Customer support ready

## 📈 Post-Launch Monitoring

### Week 1

- [ ] Monitor all transactions
- [ ] Check webhook deliveries
- [ ] Review error logs
- [ ] Monitor database performance
- [ ] Check email deliveries
- [ ] Verify settlements

### Ongoing

- [ ] Weekly transaction review
- [ ] Monthly reconciliation
- [ ] Performance monitoring
- [ ] Security updates applied
- [ ] User feedback collected
- [ ] Conversion rate tracked
- [ ] Failed payment analysis
- [ ] Support tickets resolved

## 🐛 Troubleshooting Preparation

- [ ] Error logging configured
- [ ] Alert system set up
- [ ] Support team trained
- [ ] FAQ prepared
- [ ] Common issues documented
- [ ] Escalation process defined
- [ ] Razorpay support contact saved

## 📞 Support Contacts

**Razorpay Support:**

- Email: support@razorpay.com
- Dashboard: https://dashboard.razorpay.com/app/dashboard
- Docs: https://razorpay.com/docs/

**Emergency Contacts:**

- Technical Lead: [Your contact]
- DevOps: [Your contact]
- Business Owner: [Your contact]

## 🎯 Success Metrics

Define and track:

- [ ] Conversion rate (visitors → donors)
- [ ] Average donation amount
- [ ] Payment success rate
- [ ] Payment method preferences
- [ ] Monthly recurring donors
- [ ] Drop-off points in funnel
- [ ] Page load times
- [ ] API response times

## 📝 Documentation

- [ ] API documentation updated
- [ ] User guide created
- [ ] Admin guide created
- [ ] Developer docs updated
- [ ] Architecture diagram created
- [ ] Deployment guide written
- [ ] Troubleshooting guide prepared

## 🔄 Maintenance Plan

- [ ] Regular security updates scheduled
- [ ] Dependency updates planned
- [ ] Database maintenance scheduled
- [ ] Log rotation configured
- [ ] Backup verification scheduled
- [ ] Performance review scheduled

---

## Quick Reference

### Test Cards

**Success:** `4111 1111 1111 1111`
**Failure:** `4000 0000 0000 0002`

### Environment Variables

```env
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
```

### Important URLs

- Live Donate: https://yourdomain.com/donate
- Success Page: https://yourdomain.com/donate/success
- Webhook: https://yourdomain.com/api/payment/webhook
- Admin: https://yourdomain.com/admin/payments

---

**Last Updated:** [Date]
**Reviewed By:** [Name]
**Status:** [ ] Development | [ ] Testing | [ ] Staging | [ ] Production

Good luck with your launch! 🚀
