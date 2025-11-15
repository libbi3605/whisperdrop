# Wicker Chat Application - Complete Deployment Guide

## Overview

You have successfully converted the Wicker chat application from Firebase to Supabase and added support for:
- **Image messaging** - Users can upload and share images
- **Voice messaging** - Users can record and send voice messages
- **Real-time updates** - Messages update in real-time using Supabase subscriptions

## Code Changes Completed

### 1. **Supabase Integration**
   - Created: `src/lib/supabase.ts` - Supabase client initialization
   - Environment variables configured in `.env.local`
   - Firebase auth replaced with Supabase auth

### 2. **Enhanced Chat Features**
   - Updated: `src/app/chat/page.tsx` - Added image and voice support
   - Features:
     - Image upload button (📷) - Upload images to share
     - Voice recording button (🎤) - Record and send voice messages
     - Audio playback - Listen to received voice messages
     - Image display - View shared images in chat
     - Real-time message updates

### 3. **Database Schema**
   - Created: `supabase/schema.sql` - Database tables and policies
   - Created: `supabase/setup-storage.sql` - Storage bucket configuration
   - Tables created:
     - `users` - User profiles
     - `messages` - Chat messages with image_url and voice_url fields

### 4. **Deployment Configuration**
   - Created: `netlify.toml` - Netlify configuration for Next.js
   - Auto-build on GitHub push enabled

## Setup Steps

### Step 1: Set Up Supabase Database

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select project: **yyweysxclfvcvrmsabag** (whisperdrop)
3. Go to **SQL Editor**
4. Create a new query and copy-paste the contents of `supabase/schema.sql`
5. Run the query
6. Next, create another query with contents of `supabase/setup-storage.sql`
7. Run that query

### Step 2: Verify Environment Variables

The `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://yyweysxclfvcvrmsabag.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

These are already configured and committed.

### Step 3: Deploy to Netlify

1. Go to Netlify dashboard: https://app.netlify.com
2. Click "Add new project" → "Import an existing project"
3. Connect to GitHub and select `libbi3605/wicker`
4. Build settings (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables in Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Step 4: Test the Application

1. Wait for Netlify build to complete (usually 2-5 minutes)
2. Once deployed, visit your Netlify site URL
3. Create accounts and test:
   - Text messaging
   - Image upload
   - Voice recording

## Files Created/Modified

### New Files:
- `src/lib/supabase.ts` - Supabase client
- `supabase/schema.sql` - Database schema
- `supabase/setup-storage.sql` - Storage setup
- `SETUP_DATABASE.md` - Database setup instructions
- `netlify.toml` - Netlify configuration
- `DEPLOYMENT_GUIDE.md` - This file

### Modified Files:
- `package.json` - Added `react-mic` for voice recording
- `.env.local` - Added Supabase credentials
- `src/app/chat/page.tsx` - Enhanced with image/voice features
- `src/app/login/page.tsx` - Updated for Supabase auth
- `src/app/signup/page.tsx` - Updated for Supabase auth

## Features Explained

### Image Sharing
- Click the 📷 button to select an image
- Image is uploaded to Supabase Storage
- URL is saved in message and displayed in chat
- Public access enabled for viewing shared images

### Voice Messaging
- Click the 🎤 button to start recording
- Click the ⏹️ button to stop recording
- Audio is automatically uploaded to Supabase Storage
- Message is created with voice URL
- Audio player controls appear with message

## Troubleshooting

### Build Issues
- Ensure `npm install` has been run
- Check that all environment variables are set
- Verify Node.js version is 18+

### Supabase Connection Issues
- Verify API keys are correct in `.env.local`
- Check that database tables were created successfully
- Ensure RLS policies are applied

### Storage Issues
- Verify `message-media` bucket exists and is public
- Check storage policies in Supabase
- Ensure bucket path format matches code: `images/` and `voices/`

## Next Steps

1. ✅ Code has been pushed to GitHub
2. ✅ Netlify is connected to GitHub
3. → Set up Supabase database (SQL schema)
4. → Deploy to Netlify
5. → Test the application

## Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **Netlify**: https://docs.netlify.com
- **Next.js**: https://nextjs.org/docs
