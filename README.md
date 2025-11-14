# WhisperDrop - Supabase + Netlify

Anonymous messaging application built with Next.js and Supabase.

## Setup Instructions

### 1. Create Supabase Project

1. Go to https://app.supabase.com
2. Create a new project
3. Go to Project Settings > API
4. Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### 2. Create `.env.local` file

In the root directory, create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Create Supabase Tables

In your Supabase dashboard, create these tables:

**messages table:**
- id (UUID, primary key)
- sender_id (UUID)
- sender_username (TEXT)
- recipient_username (TEXT)
- content (TEXT)
- created_at (TIMESTAMP)
- read (BOOLEAN)

### 4. Deploy to Netlify

1. Push code to GitHub
2. Go to https://app.netlify.com
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub repository
5. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to test the app.

## Testing

1. Sign up with username and password
2. Select recipient username "aaa"
3. Send a test message
4. Check Supabase dashboard to verify message was created