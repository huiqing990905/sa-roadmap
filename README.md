# Solution Architect Roadmap

A personal, interactive roadmap tracking my journey from Full Stack Engineer to Solution Architect. 245 actionable tasks across 9 phases with real-time progress tracking.

**Live site:** [sa.hqinglab.tech](https://sa.hqinglab.tech)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Hosting:** Vercel
- **Icons:** Lucide React

## Features

- 9-phase structured learning roadmap with 245 checklist items
- Interactive checkboxes (owner only) with real-time Supabase sync
- Progress dashboard with per-phase breakdown
- Public read-only mode for visitors (shareable on LinkedIn)
- Owner authentication via Supabase Auth
- Responsive dark theme with glassmorphism design
- localStorage fallback for offline resilience

## Setup

```bash
# Install
npm install

# Configure environment
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Run the SQL schema in Supabase Dashboard → SQL Editor
# (see supabase-schema.sql)

# Create a user in Supabase Dashboard → Authentication → Users

# Start dev server
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Connect repo on [vercel.com](https://vercel.com)
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Customizing Content

All roadmap data lives in `src/data/siteData.ts`. Edit tasks, add phases, or update resource links there.
