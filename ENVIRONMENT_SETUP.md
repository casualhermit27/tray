# 🔧 **Environment Setup Guide for Trayyy SaaS**

This guide will help you set up all the necessary environment variables and external services for your Trayyy file processing SaaS platform.

## 📋 **Required Environment Variables**

Create a `.env.local` file in your project root with the following variables:

```env
# ===============================================
# DATABASE CONFIGURATION
# ===============================================
DATABASE_URL="file:./dev.db"
# For production, use PostgreSQL:
# DATABASE_URL="postgresql://username:password@host:port/database"

# ===============================================
# NEXTAUTH CONFIGURATION
# ===============================================
NEXTAUTH_URL="http://localhost:3000"
# For production: NEXTAUTH_URL="https://yourdomain.com"

NEXTAUTH_SECRET="your-very-secure-random-string-at-least-32-characters-long"
# Generate with: openssl rand -base64 32

# ===============================================
# OAUTH PROVIDERS
# ===============================================
# Google OAuth (Required for Google Sign-in)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ===============================================
# STRIPE PAYMENT PROCESSING
# ===============================================
# Stripe Secret Key (starts with sk_test_ for development)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"

# Stripe Publishable Key (starts with pk_test_ for development)
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Stripe Webhook Secret (starts with whsec_)
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# ===============================================
# REDIS (FOR USAGE TRACKING & RATE LIMITING)
# ===============================================
# Upstash Redis URL
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"

# Upstash Redis Token
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# ===============================================
# APPLICATION CONFIGURATION
# ===============================================
# Your app's public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# For production: NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## 🔐 **How to Get Each API Key**

### **1. Database Setup**

#### **Development (SQLite - Default)**
- No setup required, uses local `dev.db` file
- Automatically created when you run: `npx prisma db push`

#### **Production (PostgreSQL Recommended)**
- **Option 1: Vercel Postgres**
  1. Go to [Vercel Dashboard](https://vercel.com)
  2. Create new project → Storage tab → Create Database
  3. Copy the connection string

- **Option 2: Supabase**
  1. Go to [Supabase](https://supabase.com)
  2. Create new project
  3. Go to Settings → Database → Connection string
  4. Copy the URI format

- **Option 3: Railway**
  1. Go to [Railway](https://railway.app)
  2. Create project → Add PostgreSQL
  3. Copy connection string from Variables tab

### **2. NextAuth Secret**

Generate a secure random string:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -p "require('crypto').randomBytes(32).toString('base64')"

# Online generator
# Visit: https://generate-secret.vercel.app/32
```

### **3. Google OAuth Setup**

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Create or select a project**
3. **Enable Google+ API:**
   - APIs & Services → Library
   - Search "Google+ API" → Enable
4. **Create OAuth Credentials:**
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client IDs
   - Application type: Web application
   - Name: "Trayyy App"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. **Copy Client ID and Client Secret**

### **4. Stripe Setup**

1. **Create Stripe Account:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Create account and verify business details

2. **Get API Keys:**
   - Dashboard → Developers → API keys
   - Copy "Publishable key" and "Secret key"
   - Use test keys for development (start with `pk_test_` and `sk_test_`)

3. **Set Up Webhooks:**
   - Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the "Signing secret" (starts with `whsec_`)

4. **Create Products (Optional):**
   - Dashboard → Products → Add product
   - Pro Plan: $5/month
   - Team Plan: $15/month

### **5. Redis Setup (Upstash)**

1. **Create Upstash Account:**
   - Go to [Upstash Console](https://console.upstash.com)
   - Sign up with GitHub/Google

2. **Create Redis Database:**
   - Create Database → Choose region
   - Database name: "trayyy-production"
   - Type: Pay as you go (free tier available)

3. **Get Connection Details:**
   - Database → REST API
   - Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### **6. Domain Setup (Production)**

#### **Option 1: Vercel (Recommended)**
1. Deploy to Vercel: `npx vercel --prod`
2. Add custom domain in Vercel dashboard
3. Update environment variables

#### **Option 2: Netlify**
1. Build: `npm run build`
2. Deploy build folder
3. Add environment variables in site settings

#### **Option 3: DigitalOcean App Platform**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Add environment variables

## 🚀 **Quick Setup Commands**

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma generate
npx prisma db push

# 3. Create environment file
cp env.local.example .env.local
# Edit .env.local with your actual values

# 4. Run development server
npm run dev

# 5. Open browser
open http://localhost:3000
```

## 🔍 **Testing Your Setup**

### **Database Test**
```bash
npx prisma studio
# Should open database browser at http://localhost:5555
```

### **Authentication Test**
1. Visit `/auth/signin`
2. Try Google sign-in
3. Check if user appears in database

### **Stripe Test**
1. Visit `/pricing`
2. Click "Get Started" on Pro plan
3. Use test card: `4242 4242 4242 4242`
4. Check Stripe dashboard for test payment

### **Redis Test**
```bash
# Test Redis connection
curl -X POST https://your-redis-url.upstash.io/set/test/hello \
  -H "Authorization: Bearer your-token"
```

## 🛠️ **Production Deployment Checklist**

### **Environment Variables**
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Use production Stripe keys (starts with `sk_live_` and `pk_live_`)
- [ ] Use production database URL (PostgreSQL)
- [ ] Generate new `NEXTAUTH_SECRET` for production

### **Security**
- [ ] Enable HTTPS on your domain
- [ ] Set up proper CORS headers
- [ ] Configure CSP (Content Security Policy)
- [ ] Set up monitoring and logging

### **Stripe Production**
- [ ] Complete Stripe account verification
- [ ] Switch to live API keys
- [ ] Update webhook endpoint to production URL
- [ ] Test real payments with small amounts

### **Database**
- [ ] Set up production PostgreSQL database
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Set up database backups
- [ ] Monitor database performance

## ⚠️ **Common Issues & Solutions**

### **"No such file or directory" for SQLite**
```bash
# Make sure you're in the project directory
cd /path/to/your/project
npx prisma db push
```

### **Google OAuth "redirect_uri_mismatch"**
- Check that your redirect URI exactly matches what's in Google Console
- Include both `http://localhost:3000` and your production domain

### **Stripe Webhook Verification Failed**
- Ensure webhook secret matches exactly
- Check that your endpoint is publicly accessible
- Test webhook with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### **Redis Connection Issues**
- Verify URL and token are correct
- Check Upstash dashboard for connection errors
- Make sure your deployment platform can reach external APIs

### **Build Errors in Production**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check for missing environment variables
npm run build 2>&1 | grep -i "env"
```

## 📚 **Additional Resources**

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Prisma Database Setup](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)

## 🎯 **Need Help?**

If you encounter issues:
1. Check this guide first
2. Review error messages carefully
3. Test each service individually
4. Check the browser console for client-side errors
5. Check server logs for API errors

---

**🎉 Once everything is set up, your Trayyy SaaS platform will be ready to process files, handle payments, and scale with your users!**
