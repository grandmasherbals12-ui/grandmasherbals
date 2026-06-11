# Grandma's Herbal Haven - Backend & Image Setup Guide

## Overview
This guide walks you through setting up the Supabase backend and image management system for Grandma's Herbal Haven.

## Prerequisites
- Supabase account (already created)
- Access to your Supabase dashboard
- Project ID: `azurdwzifjkmhxbvnaix`

## Part 1: Database Setup

### Step 1: Run Database Schema
1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the entire contents of `database-schema.sql` from the project root
5. Click "Run" to execute the schema

This will create:
- `products` table (products catalog)
- `users` table (user profiles)
- `orders` table (order history)
- `order_items` table (items in orders)
- `consultations` table (booking reservations)
- `wishlist` table (saved items)
- `reviews` table (product reviews)

### Step 2: Verify Tables
After running the schema:
1. Navigate to **Table Editor** in Supabase
2. Verify that all tables are created
3. Check that sample products were inserted into the `products` table

## Part 2: Storage Setup (Image Management)

### Step 1: Create Storage Buckets
1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket** for each:

#### Bucket 1: Product Images
- **Name**: `product-images`
- **Public**: Yes (checked)
- **File size limit**: 10 MB
- Click **Create bucket**

#### Bucket 2: Profile Images
- **Name**: `profile-images`
- **Public**: Yes (checked)
- **File size limit**: 5 MB
- Click **Create bucket**

#### Bucket 3: Site Assets
- **Name**: `site-assets`
- **Public**: Yes (checked)
- **File size limit**: 50 MB
- Click **Create bucket**

### Step 2: Configure Bucket Policies

For each bucket, set up public read access:

1. Click on bucket name
2. Go to **Policies** tab
3. Click **New Policy** → **For queries only**
4. Select **SELECT** operation
5. For **Target roles**, select **Public**
6. Click **Review**, then **Save policy**

This allows anyone to view images but only authenticated users can upload.

## Part 3: Environment Variables

The `.env.local` file is already configured with:
```
VITE_SUPABASE_URL=https://azurdwzifjkmhxbvnaix.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are used for client-side authentication and image uploads.

## Part 4: Authentication Setup

### Email/Password Authentication (Already Enabled)
Supabase has email/password authentication enabled by default. Users can:
- Sign up with email and password
- Sign in to their accounts
- Reset passwords via email

### Step 1: Enable Email Confirmations (Optional)
1. Go to **Authentication** → **Providers**
2. Find **Email**
3. Toggle **Confirm email** if you want email verification

### Step 2: Test Authentication
1. Run the development server: `npm run dev`
2. Navigate to any protected page to test login/signup

## Part 5: Uploading Product Images

### Method 1: Through Supabase Dashboard
1. Go to **Storage** → **product-images**
2. Click **Upload** button
3. Select image files
4. Copy the public URL for reference

### Method 2: Through Admin Interface (When Built)
Once you create an admin interface, users can upload images through:
- Image upload component (already created)
- Product management forms
- Profile/avatar uploads

## Part 6: Connecting Your App

### Products Page
- Automatically fetches from Supabase `products` table
- Falls back to local data if Supabase is unavailable
- Uses React Query for efficient caching

### User Authentication
- Account page uses Supabase auth
- Orders are saved to `orders` table
- User profile linked to Supabase `users` table

### Image URLs
- Product images: `https://azurdwzifjkmhxbvnaix.supabase.co/storage/v1/object/public/product-images/products/{filename}`
- Profile images: `https://azurdwzifjkmhxbvnaix.supabase.co/storage/v1/object/public/profile-images/{filename}`

## Part 7: Adding Products to Database

### Option 1: Manual Entry via Supabase Dashboard
1. Go to **Table Editor** → **products**
2. Click **Insert** → **Insert row**
3. Fill in product details:
   - `name`: Product name
   - `tagline`: Short description
   - `category`: Pick from list
   - `description`: Full product description
   - `price`: Decimal price (e.g., 34.99)
   - `ingredients`: Array of ingredients
   - `rating`: 1-5 decimal rating
   - `reviews`: Number of reviews

### Option 2: Using the App (Once Admin Built)
- Admin dashboard to create/edit/delete products
- Image uploads directly from the interface

## Part 8: Row-Level Security (RLS)

The database includes RLS policies for data protection:
- Users can only see their own orders
- Users can only modify their own profile
- All product images are publicly readable
- Reviews are publicly readable

These are configured automatically in the schema.

## Troubleshooting

### Images Not Loading
- Check that bucket is **Public** (not private)
- Verify file exists in Storage
- Check browser console for CORS errors

### Authentication Not Working
- Ensure `.env.local` has correct credentials
- Check that `AuthProvider` wraps your app (in `__root.tsx`)
- Clear browser cookies and try again

### Database Errors
- Check RLS policies are enabled
- Verify user is authenticated before accessing restricted tables
- Check Supabase dashboard for query errors

## Next Steps

1. **Run the schema** to set up database tables
2. **Create storage buckets** for images
3. **Add initial products** through Supabase Dashboard or API
4. **Test authentication** by signing up/logging in
5. **Upload images** and verify they load correctly
6. **Deploy** when ready

## Useful Links
- Supabase Dashboard: https://app.supabase.com
- Supabase Docs: https://supabase.com/docs
- API Documentation: https://supabase.com/docs/reference/javascript

## File References
- Environment config: `.env.local`
- Database schema: `database-schema.sql`
- Supabase client: `src/lib/supabase.ts`
- Auth context: `src/lib/auth-context.tsx`
- Image upload hook: `src/hooks/use-image-upload.tsx`
- Image upload component: `src/components/ui/image-upload.tsx`
