# Video Testimonials Setup Guide

## Overview
This feature allows customers to record video testimonials directly on your website. Videos are stored in Supabase Storage and require admin approval before appearing publicly.

## Database Setup

### 1. Run the SQL Script
Execute the `database-video-testimonials.sql` file in your Supabase SQL Editor:

```sql
-- This will create:
-- - video_testimonials table
-- - Storage bucket for videos
-- - RLS policies for security
```

### 2. Verify Storage Bucket
Go to Supabase Dashboard → Storage and confirm the `video-testimonials` bucket was created with public access enabled.

## Features

### Customer Features
- **Record Video**: Customers can record 30-60 second video testimonials directly in their browser
- **Add Details**: Include name, email (optional), star rating, and written comment
- **Preview & Retake**: Review video before submission, retake if needed
- **Easy Submission**: Videos are uploaded to Supabase Storage automatically

### Admin Features
- **Review Pending**: See all testimonials awaiting approval
- **Approve/Reject**: Control which testimonials appear publicly
- **Feature Testimonials**: Mark important testimonials as "featured"
- **Delete**: Remove inappropriate or unwanted testimonials
- **Video Playback**: Watch all videos directly in the admin panel

## How It Works

### For Customers
1. Visit `/testimonials` page
2. Click "Share Your Video Testimonial"
3. Allow camera/microphone permissions
4. Record video (click Start → Stop)
5. Fill in details (name, rating, comment)
6. Submit for review

### For Admins
1. Go to `/admin` and select "Testimonials" tab
2. Review pending testimonials
3. Watch videos and read comments
4. Click "Approve" to make testimonial public
5. Optionally click "Feature" to highlight best testimonials
6. Featured testimonials appear first on the page

## Pages

### `/testimonials` - Public Testimonials Page
- Displays all approved video testimonials
- Shows featured testimonials with special badge
- Includes video recording interface
- Grid layout with video players

### `/admin` - Admin Panel
- "Testimonials" tab for management
- Filter by: All, Pending, Approved
- Approve, feature, or delete testimonials
- Real-time video playback

## Technical Details

### Components Created
- `VideoRecorder.tsx` - Video recording interface
- `Testimonials.tsx` - Public testimonials display (removed dummy data)
- `AdminTestimonials.tsx` - Admin management panel

### Database Schema
```sql
video_testimonials
- id (UUID, primary key)
- customer_name (TEXT, required)
- customer_email (TEXT, optional)
- video_url (TEXT, required)
- thumbnail_url (TEXT, optional)
- rating (INTEGER, 1-5, required)
- comment (TEXT, required)
- duration (INTEGER, seconds)
- approved (BOOLEAN, default false)
- featured (BOOLEAN, default false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Storage Structure
- Bucket: `video-testimonials`
- Access: Public (for approved videos)
- File Format: WebM (video/webm)
- Naming: `{timestamp}-{customer-name}.webm`

## Security

### Row Level Security (RLS)
- **Public SELECT**: Only approved testimonials visible
- **Public INSERT**: Anyone can submit testimonials
- **Admin UPDATE/DELETE**: Requires service role or admin privileges

### Storage Policies
- Anyone can upload videos (for submissions)
- Anyone can view videos (once approved)
- Only admins can delete videos

## Browser Compatibility

### Required Browser Features
- `getUserMedia()` API for camera/microphone access
- `MediaRecorder` API for video recording
- WebM video codec support

### Supported Browsers
- Chrome/Edge 49+
- Firefox 29+
- Safari 14.1+
- Opera 36+

### Mobile Support
- iOS Safari 14.3+
- Chrome for Android
- Samsung Internet

## Customization

### Video Settings
Edit `VideoRecorder.tsx` to change:
- Resolution: Currently 1280x720
- Codec: Currently VP8/Opus
- Max duration: Add timer if needed

### Display Settings
Edit `Testimonials.tsx` to change:
- Grid layout (currently 3 columns)
- Number of testimonials displayed (currently 12)
- Sort order (currently featured first, then by date)

## Troubleshooting

### Video Upload Fails
- Check Supabase Storage bucket exists
- Verify storage policies are correct
- Ensure customer has stable internet connection

### Camera Access Denied
- User must grant browser permissions
- HTTPS required (localhost is OK for development)
- Check browser compatibility

### Testimonials Not Appearing
- Verify testimonial is approved (admin panel)
- Check RLS policies in Supabase
- Confirm `approved = true` in database

## Future Enhancements

Consider adding:
- Video thumbnails (auto-generated)
- Duration limits (e.g., max 2 minutes)
- Video compression before upload
- Email notifications when testimonial is approved
- Moderation queue with notes
- Export testimonials for marketing use

## Support

For issues or questions:
1. Check Supabase logs for errors
2. Review browser console for client-side errors
3. Verify database and storage setup
4. Test with different browsers/devices
