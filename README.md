# PULSE - Premium News Aggregator

A modern, minimalist news aggregator built with Next.js 14, TypeScript, and Tailwind CSS. PULSE aggregates top stories from NewsAPI and The Guardian with a sleek editorial design featuring a signature freshness indicator bar.

## Features

- **Dual API Integration**: Combines news from NewsAPI and The Guardian Open Platform with automatic deduplication
- **Category Navigation**: Browse by Technology, Business, Sports, World, and Science
- **Full-Text Search**: Search across multiple news sources
- **Dark/Light Mode**: Complete dark theme support with persistent storage
- **Multi-Language**: English and Russian language support
- **Freshness Indicator**: Animated color bar showing article age (blue for fresh, grey for old)
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Editorial Minimalism**: Clean design with lots of whitespace and a single accent color

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Fonts**: Playfair Display (headlines), Inter (body/UI), Inter Mono (meta)
- **APIs**: [NewsAPI.org](https://newsapi.org/) + [The Guardian Open Platform](https://open-platform.theguardian.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Design System

### Colors
- **Light Mode**: White background (#FFFFFF), dark text (#111111)
- **Dark Mode**: Dark background (#0F0F0F), card background (#1A1A1A)
- **Accent**: Single blue accent (#2563EB)
- **Text**: Secondary text (#6B7280), dividers (#E5E7EB)

### Typography
- **Headlines**: Playfair Display (bold, 700-900 weight)
- **Body & UI**: Inter (regular)
- **Meta**: Inter Mono (timestamps, source)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/shyraq.git
cd shyraq
```

### 2. Get API Keys

#### NewsAPI
1. Visit [https://newsapi.org](https://newsapi.org)
2. Sign up for a free account
3. Go to your dashboard and copy your API key
4. Free tier includes: 100 requests/day, 30-day history

#### The Guardian Open Platform
1. Visit [https://open-platform.theguardian.com/documentation](https://open-platform.theguardian.com/documentation)
2. Sign up for a free developer account
3. Go to your dashboard and copy your API key
4. Free tier includes: 5000 requests/day

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

```
GUARDIAN_API_KEY=your_guardian_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
ANTHROPIC_API_KEY=your_anthropic_key
```

### Supabase Setup

1. **Create a Supabase Project**
   - Visit [https://supabase.com](https://supabase.com) and sign up
   - Create a new project
   - Wait for the project to initialize
   
2. **Run Database Migration**
   - In your Supabase project dashboard, go to `SQL Editor`
   - Create a new query
   - Copy and paste the contents of `supabase/migrations/001_init.sql`
   - Run the migration query
   
3. **Get Your Credentials**
   - Go to `Project Settings → API`
   - Copy your `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy your `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy your `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`
   
4. **Configure Google OAuth (Already Done)**
   - Google OAuth has been pre-configured in your Supabase project
   - The app will use `supabase.auth.signInWithOAuth({ provider: 'google' })` for sign-ins

### Anthropic API Key

1. Visit [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to `API Keys` and create a new key
4. Add to `.env.local` as `ANTHROPIC_API_KEY`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /layout.tsx              # Root layout with fonts and theme provider
  /page.tsx                # Homepage with hero section and news feed
  /category/[slug]/page.tsx # Category-filtered news pages
  /search/page.tsx         # Search results page
  /globals.css             # Tailwind imports and base styles
/components
  /Header.tsx              # Navigation header with search bar
  /CategoryNav.tsx         # Category navigation tabs
  /NewsCard.tsx            # Compact news card with freshness bar
  /HeroCard.tsx            # Large featured news card
  /NewsFeed.tsx            # News grid layout
  /SearchBar.tsx           # Search input component
  /ThemeToggle.tsx         # Dark/light mode toggle
  /LanguageToggle.tsx      # Language switcher
  /FreshnessBar.tsx        # Animated freshness indicator
/lib
  /types.ts                # TypeScript interfaces
  /newsapi.ts              # NewsAPI integration
  /guardian.ts             # Guardian API integration
  /mergeFeeds.ts           # Feed merging and deduplication
/public                    # Static assets
tailwind.config.ts         # Tailwind configuration
next.config.js             # Next.js configuration
tsconfig.json              # TypeScript configuration
package.json               # Dependencies and scripts
```

## Available Routes

- `/` - Homepage with top stories (hero section) and news feed
- `/category/[slug]` - Filtered news by category
  - `/category/technology`
  - `/category/business`
  - `/category/sports`
  - `/category/general`
  - `/category/science`
- `/search?q=<query>` - Search results page

## Features Guide

### Dark Mode
- Click the moon/sun icon in the header to toggle dark mode
- Your preference is saved to localStorage

### Language Toggle
- Click the EN/RU button in the header to switch languages
- Page reloads to fetch news in the selected language

### Freshness Bar
- The thin colored bar under each article indicates freshness
- **Blue** (#2563EB): Fresh articles (less than 1 hour old)
- **Grey** (#6B7280): Older articles (12+ hours old)
- Color gradient animates in real-time for articles 1-12 hours old

### Search
- Use the search bar in the header to find articles
- Search works across both NewsAPI and Guardian API

## Supabase Features

### User Authentication
- **Google OAuth**: Sign in with your Google account via `Sign In` button
- **Magic Link**: Alternative authentication via email link
- Session management is handled automatically

### Save Articles
- Click the heart icon on any article card to save it to your library
- Access saved articles via `Saved Articles` in the user menu (top-right)
- Saved articles persist in your Supabase account

### AI Summaries
- Each article detail page includes an AI-generated summary
- Summaries are cached in Supabase to minimize API usage
- Generated by Claude 3.5 Sonnet via Anthropic API

### Related Articles
- Article detail pages display related articles from the same category
- Helps with content discovery and engagement

## Building for Production

### Build the App

```bash
npm run build
```

### Run Production Build Locally

```bash
npm run start
```

## Deploying to Vercel

### Option 1: Vercel Dashboard

1. Push your code to GitHub
2. Visit [https://vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set environment variables in Vercel dashboard:
   - `GUARDIAN_API_KEY`
6. Click "Deploy"

### Option 2: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy from project root:
   ```bash
   vercel
   ```

3. Follow the prompts and add environment variables

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Environment Variables in Vercel

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add the API key:
   - Key: `GUARDIAN_API_KEY`
   - Value: `your_guardian_api_key`
4. Redeploy your project

## Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization with responsive sizing
- **Caching**: API responses cached for 5 minutes (ISR strategy)
- **Font Optimization**: Google Fonts self-hosted and optimized with `next/font`
- **CSS**: Tailwind CSS with purging for production builds
- **Code Splitting**: Automatic code splitting by Next.js

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### API Keys Not Working
- Verify keys are correctly copied (no extra spaces)
- Check NewsAPI rate limit (100 requests/day free tier)
- Check Guardian API rate limit (5000 requests/day free tier)
- Ensure `.env.local` is in the project root

### No Articles Appearing
- Check browser console for API errors
- Verify network requests in DevTools
- Try switching language to English
- Wait a few seconds and refresh

### Dark Mode Not Persisting
- Check that localStorage is enabled
- Check browser's privacy/storage settings
- Try incognito/private window to test

### Build Fails on Vercel
- Ensure all environment variables are set in Vercel dashboard
- Check that `NEXT_PUBLIC_*` prefix is correct
- Review build logs in Vercel dashboard

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

- TypeScript strict mode enabled
- Tailwind CSS for styling
- Server components by default with `'use client'` where needed
- Functional components with hooks

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.

## Credits

- News data from [NewsAPI.org](https://newsapi.org/)
- News data from [The Guardian Open Platform](https://open-platform.theguardian.com/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)
