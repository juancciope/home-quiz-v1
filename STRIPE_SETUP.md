# Stripe PDF Payment Integration Setup

This document explains how to set up the Stripe integration for PDF downloads.

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Stripe Configuration (Required)
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_endpoint_secret_here

# Optional: Use your pre-created Stripe Product ID
STRIPE_PDF_PRODUCT_ID=price_your_stripe_price_id_here

# Application URL (Required for redirects)
NEXT_PUBLIC_URL=https://your-domain.com
```

## Stripe Setup Steps

### 1. Create Product in Stripe Dashboard

1. Go to Stripe Dashboard → Products
2. Click "Add Product"
3. Name: "Music Creator Roadmap PDF"
4. Description: "Your personalized music career roadmap with detailed action steps"
5. Price: $20.00 USD (one-time payment)
6. Copy the Price ID (starts with `price_`) and use it as `STRIPE_PDF_PRODUCT_ID`

### 2. Set up Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe-webhook`
3. Select events: `checkout.session.completed`
4. Copy the webhook secret and use it as `STRIPE_WEBHOOK_SECRET`

### 3. Get API Keys

1. Go to Stripe Dashboard → Developers → API Keys
2. Copy Publishable Key → `STRIPE_PUBLISHABLE_KEY`
3. Copy Secret Key → `STRIPE_SECRET_KEY`

## How It Works

1. User clicks "Download Now" button
2. System creates Stripe checkout session with user data stored in metadata
3. User completes payment on Stripe
4. Stripe redirects to `/api/download-pdf` with session ID
5. Server verifies payment and generates personalized PDF
6. PDF is automatically downloaded to user's device

## Testing

For testing, use Stripe's test mode:
- Use test API keys (they start with `pk_test_` and `sk_test_`)
- Use test card number: `4242 4242 4242 4242`
- Any future expiry date and CVC

## Fallback Behavior

If `STRIPE_PDF_PRODUCT_ID` is not set, the system will create dynamic pricing at $20 USD automatically.

## Security Notes

- Never commit real API keys to version control
- Use test keys for development
- Webhook endpoint should be HTTPS in production
- Always verify payment status before delivering content