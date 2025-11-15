# Database Setup Instructions

## Setting up the Supabase Database

To set up the database tables and storage bucket, follow these steps:

### 1. Create Tables and Policies

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select the project "yyweysxclfvcvrmsabag"
3. Go to SQL Editor
4. Copy and paste the contents of `supabase/schema.sql`
5. Run the query

### 2. Set up Storage Bucket

1. Go to Storage section in the Supabase Dashboard
2. Create a new bucket named "message-media" with public access
3. Or, go to SQL Editor and run the contents of `supabase/setup-storage.sql`

### 3. Environment Variables

The following environment variables are already set in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are used to connect to your Supabase project.

## Features

- Text messaging
- Image uploads (stored in Supabase Storage)
- Voice message recording and playback
- Real-time message updates
- User authentication with Supabase Auth
