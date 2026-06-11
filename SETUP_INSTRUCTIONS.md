# Setup Instructions - Video Testimonials

## ⚠️ IMPORTANT: Follow These Steps in Order

### Step 1: Stop the Dev Server
If your dev server is running, stop it now:
- Press `Ctrl+C` in the terminal where `npm run dev` is running

### Step 2: Set Up Supabase Database
1. Open your **Supabase Dashboard**: https://app.supabase.com
2. Go to your project: `azurdwzifjkmhxbvnaix`
3. Click on **SQL Editor** in the left sidebar
4. Click **"+ New Query"**
5. Copy the ENTIRE contents of `database-video-testimonials.sql`
6. Paste into the SQL editor
7. Click **"Run"** button (or press F5)
8. You should see: "Success. No rows returned"

### Step 3: Verify Storage Bucket
1. In Supabase Dashboard, click **Storage** in left sidebar
2. You should see a bucket named `video-testimonials`
3. If you don't see it:
   - Click **"New bucket"**
   - Name: `video-testimonials`
   - Public: ✅ **Check this box**
   - Click **"Create bucket"**

### Step 4: Restart Dev Server
```bash
npm run dev
```

Wait for it to say "ready" or show the localhost URL.

### Step 5: Hard Refresh Browser
1. Go to `http://localhost:3000/testimonials` (or whatever port your dev server is on)
2. Do a **hard refresh**:
   - **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
   - **Mac**: `Cmd + Shift + R`

### Step 6: Test the Page
You should now see:
- Header with "Testimonials" link
- "What Our Community is Saying" heading
- "Share Your Video Testimonial" button
- "Be the First!" message (since no testimonials exist yet)

---

## 🧪 Testing Video Recording

### Test Customer Flow:
1. Click **"Share Your Video Testimonial"** button
2. Click **"Allow"** when browser asks for camera/microphone permissions
3. You should see your camera feed
4. Click **"Start Recording"**
5. Recording indicator should appear
6. Say something for 5-10 seconds
7. Click **"Stop Recording"**
8. Video preview should appear
9. Click **"Continue"**
10. Fill in the form:
    - Name: "Test Customer"
    - Rating: 5 stars
    - Comment: "This is a test testimonial"
11. Click **"Submit Testimonial"**
12. You should see: "Thank you! Your testimonial has been submitted..."

### Test Admin Approval:
1. Go to `http://localhost:3000/admin`
2. Click **"Testimonials"** tab in sidebar
3. You should see your test testimonial with:
   - Orange border (pending)
   - Video player
   - Customer details
   - "Approve" button
4. Click **"Approve"**
5. Border turns green
6. "Feature" button appears

### Verify Public Display:
1. Go back to `http://localhost:3000/testimonials`
2. Your approved testimonial now appears!
3. Click the play button to watch
4. Rating stars and comment are visible

---

## 🐛 Troubleshooting

### "Hello */testimonials*!" appears
**Solution**: Hard refresh browser (`Ctrl + Shift + R`)

### Camera/Microphone not working
**Solutions**:
1. Check browser permissions (click lock icon in address bar)
2. Must use `https://` or `localhost` (http://localhost is OK)
3. Try a different browser (Chrome recommended)

### "table video_testimonials does not exist"
**Solution**: Run `database-video-testimonials.sql` in Supabase SQL Editor

### Upload fails / "bucket not found"
**Solutions**:
1. Go to Supabase → Storage
2. Create `video-testimonials` bucket
3. Make sure "Public" is checked
4. Re-run storage policies from `database-video-testimonials.sql`

### Testimonials not showing after approval
**Solutions**:
1. Hard refresh the page
2. Check browser console for errors
3. Verify in Supabase that `approved = true`

### Toast notifications not appearing
**Solution**: Already fixed! The Toaster component is now added to `__root.tsx`

---

## ✅ Success Checklist

Your setup is complete when ALL of these work:

- [ ] `/testimonials` page loads (no "Hello */testimonials*!")
- [ ] Header shows "Testimonials" link
- [ ] "Share Your Video Testimonial" button appears
- [ ] Clicking button shows video recorder interface
- [ ] Camera feed displays when starting recording
- [ ] Can record and stop video
- [ ] Form appears after recording
- [ ] Can submit testimonial (success message appears)
- [ ] `/admin` page has "Testimonials" tab
- [ ] Pending testimonial appears in admin (orange border)
- [ ] Can approve testimonial
- [ ] Approved testimonial appears on public page
- [ ] Can play video on public page

---

## 🚀 What's Been Fixed

### 1. Duplicate Merchandise (✅ Fixed)
- **Before**: Mugs and t-shirts showed 9 times each
- **After**: Each item shows once in clean gallery
- **File**: `src/routes/shop.tsx`

### 2. Dummy Testimonials Data (✅ Removed)
- **Before**: Fake testimonials (Sarah L., Michael B., Jessica R.)
- **After**: Real customer video testimonials only
- **File**: `src/components/site/Testimonials.tsx`

### 3. Toast Notifications (✅ Fixed)
- **Before**: Toaster component not rendered
- **After**: Toaster added to root layout
- **File**: `src/routes/__root.tsx`

### 4. Error Handling (✅ Improved)
- **Before**: Page crashed if table doesn't exist
- **After**: Shows "Be the First!" message gracefully
- **Files**: All testimonial components

---

## 📱 Browser Compatibility

### ✅ Fully Supported:
- Chrome 49+ (Desktop & Mobile)
- Edge 79+
- Firefox 29+
- Safari 14.1+ (Mac & iOS)
- Opera 36+

### ⚠️ Limited Support:
- IE 11: No support (MediaRecorder API not available)
- Old Android browsers: May have issues

### 📝 Requirements:
- Camera and microphone
- HTTPS or localhost
- Modern browser with MediaRecorder API

---

## 🎯 Next Steps

After setup is complete:

1. **Customize Design**: Edit colors, layout in component files
2. **Add Email Notifications**: Send email when testimonial is approved
3. **Video Thumbnails**: Auto-generate thumbnails for better UX
4. **Duration Limits**: Add max video length (e.g., 2 minutes)
5. **Compression**: Compress videos before upload to save storage
6. **Moderation Notes**: Add admin notes field for internal use

---

## 📞 Need Help?

If you're still having issues:

1. **Check Browser Console**: Press F12, look for red errors
2. **Check Supabase Logs**: Dashboard → Logs
3. **Verify Environment Variables**: Check `.env` file has correct values
4. **Clear Browser Cache**: Sometimes old code gets cached
5. **Try Incognito Mode**: Rules out extension conflicts

---

## 🎉 You're All Set!

Once all the checklist items work, your video testimonial system is production-ready!

Customers can now:
- ✅ Record video testimonials on your site
- ✅ Submit with rating and written comment
- ✅ See approved testimonials from others

You can:
- ✅ Review submissions in admin panel
- ✅ Approve/reject testimonials
- ✅ Feature the best ones
- ✅ Delete unwanted submissions

**Happy collecting authentic customer stories!** 🌟
