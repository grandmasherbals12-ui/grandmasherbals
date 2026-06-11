# Quick Start Guide

## ⚡ Get Video Testimonials Running in 5 Minutes

### Step 1: Setup Database (2 minutes)
1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste contents of `database-video-testimonials.sql`
4. Click **Run**
5. Verify success message

### Step 2: Verify Storage (1 minute)
1. In Supabase Dashboard, go to **Storage**
2. Confirm `video-testimonials` bucket exists
3. Check that it's marked as **Public**

### Step 3: Test Customer Flow (2 minutes)
1. Run your dev server: `npm run dev`
2. Visit `http://localhost:5173/testimonials`
3. Click "Share Your Video Testimonial"
4. Allow camera/microphone when prompted
5. Record a short test video (5-10 seconds)
6. Fill in:
   - Name: "Test User"
   - Rating: 5 stars
   - Comment: "Test testimonial"
7. Click "Submit Testimonial"
8. Should see success message

### Step 4: Approve Testimonial (30 seconds)
1. Visit `http://localhost:5173/admin`
2. Click **"Testimonials"** tab in sidebar
3. See your test video in "Pending" section
4. Watch the video (optional)
5. Click **"Approve"** button
6. Optionally click **"Feature"** to highlight it

### Step 5: Verify Public Display (30 seconds)
1. Go back to `http://localhost:5173/testimonials`
2. Your approved video now appears in the grid
3. Click play to watch
4. Featured badge shows if you marked it as featured

---

## 🎯 What Was Fixed

### ✅ Duplicate Merchandise Issue
- **Before**: Mugs and t-shirts appeared 9 times each
- **After**: Each item shows once in clean gallery

### ✅ Testimonials System
- **Before**: Dummy data (Sarah L., Michael B., Jessica R.)
- **After**: Real customer video testimonials with admin approval

---

## 📱 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Public Testimonials | `/testimonials` | Customers view and record testimonials |
| Admin Panel | `/admin` → Testimonials tab | Approve and manage testimonials |
| Shop | `/shop` | Fixed duplicate merchandise display |

---

## 🔐 Admin Access

The `/admin` page shows all testimonials pending approval. Features:
- **Approve**: Make testimonial public
- **Feature**: Highlight as featured (shows first with badge)
- **Delete**: Remove testimonial and video file
- **Filters**: View All, Pending, or Approved

---

## 📹 Video Requirements

### Recording Specs:
- **Format**: WebM (video/webm)
- **Resolution**: 1280x720 (720p)
- **Codec**: VP8 video, Opus audio
- **Recommended Length**: 30-60 seconds

### Browser Support:
- ✅ Chrome/Edge 49+
- ✅ Firefox 29+
- ✅ Safari 14.1+
- ✅ Mobile browsers with camera access

---

## 🛠️ Common Issues & Solutions

### "Camera access denied"
**Solution**: User must allow camera/microphone permissions in browser. Only works on HTTPS (or localhost).

### "Upload failed"
**Solution**: Check Supabase storage bucket exists and is public. Verify storage policies in `database-video-testimonials.sql` were applied.

### "Testimonial not showing"
**Solution**: Admin must approve the testimonial. Go to `/admin` → Testimonials tab → Click "Approve".

### "Page not found"
**Solution**: Run `npm run dev` and ensure all route files were created. Check `src/routes/testimonials.tsx` exists.

---

## 📝 Customer Instructions

Share these steps with customers:

1. Visit the **Testimonials** page
2. Click **"Share Your Video Testimonial"**
3. Allow your browser to access camera and microphone
4. Click **"Start Recording"**
5. Share your experience (30-60 seconds)
6. Click **"Stop Recording"**
7. Review your video, retake if needed
8. Fill in your name, rating, and written comment
9. Click **"Submit Testimonial"**
10. Your testimonial will be reviewed and published soon!

---

## 💡 Pro Tips

- **Feature Your Best**: Use the "Feature" button for exceptional testimonials
- **Mobile Recording**: Works great on mobile devices with cameras
- **Quality Check**: Watch videos before approving to ensure good quality
- **Regular Review**: Check the admin panel regularly for new submissions
- **Encourage Customers**: Add a call-to-action on your site to record testimonials

---

## 📚 More Documentation

- **Full Setup Guide**: See `VIDEO_TESTIMONIALS_SETUP.md`
- **All Changes**: See `CHANGES_SUMMARY.md`
- **Database Schema**: See `database-video-testimonials.sql`

---

## ✨ You're All Set!

Your video testimonials system is now:
- ✅ Connected to Supabase
- ✅ Recording customer videos
- ✅ Requiring admin approval
- ✅ Displaying without dummy data
- ✅ Mobile-friendly
- ✅ Secure with RLS policies

Happy collecting testimonials! 🎉
