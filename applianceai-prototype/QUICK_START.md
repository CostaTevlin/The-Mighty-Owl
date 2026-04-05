# Quick Start Guide

## Installation & Local Development (5 minutes)

### 1. Install Node dependencies
```bash
cd applianceai-prototype
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your Supabase URL and key (optional for local testing)
```

### 3. Run the development server
```bash
npm run dev
```

The app will be live at http://localhost:3000 with the Welcome screen.

## Test the App Locally

1. **Welcome screen** - Click "Get Started"
2. **Category screen** - Select any appliance (e.g., Washing Machine)
3. **Photo screen** - Click "Open Camera" or "Upload from Gallery" and select an image
4. **Context screen** - Adjust the settings (load size, color, etc.) and click "Teach Me!"
5. **Loading screen** - Watch the animated messages (without Supabase/Claude API, this will timeout)
6. **Results screen** - See the step-by-step instructions (requires API to be working)

**Note**: Without Supabase and Claude API configured, steps 5-6 will show errors. That's expected for local testing.

## Deploy to Fornex

### 1. Build the static site
```bash
npm run build
```

This creates `dist/` with all static files ready to deploy.

### 2. Upload to Fornex
- Via SFTP: Upload contents of `dist/` to `/var/www/html/` or your web root
- Configure Nginx/Apache to serve the files
- Point your domain to the server

### 3. Configure Supabase (Backend)

Follow the full setup in README.md:
- Create a Supabase project
- Run the database migration (SQL in migrations/ folder)
- Deploy the edge function with your Claude API key
- Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in .env

## What Each File Does

| File | Purpose |
|------|---------|
| `index.astro` | Main app - 491 lines of UI + all client-side logic |
| `*.astro` components | 6 reusable screens (Welcome, Category, Photo, Context, Loading, Results) |
| `Layout.astro` | Base HTML template with global styles |
| `package.json` | Dependencies (Astro, Tailwind, Supabase) |
| `tailwind.config.mjs` | Custom colors (navy, red, light) |
| `astro.config.mjs` | Astro + Tailwind setup |
| `tsconfig.json` | TypeScript strict mode |
| `.env.example` | Template for environment variables |
| `analyze/index.ts` | Edge Function - Claude API proxy |
| `001_create_scans.sql` | Database schema migration |
| `README.md` | Full documentation (300+ lines) |
| `IMPLEMENTATION_SUMMARY.md` | What was built (this file) |

## Key Features

- **📱 Mobile-first** - Perfect on phones and tablets
- **🤖 AI-powered** - Uses Claude vision to identify appliances
- **📸 Image compression** - Uploads compressed JPEGs (max 1024px, 80% quality)
- **🎯 Category-specific** - Different questions for washing, cooking, coffee, dishwashing, drying, other
- **💾 Database** - Saves scan history to Supabase PostgreSQL
- **🎨 Beautiful UI** - Professional design with animations and smooth transitions
- **⚡ Static deploy** - No server rendering, just HTML/CSS/JS served from CDN

## Common Issues

### Local app shows "Cannot find Supabase URL"
That's fine - the UI still works without the backend. Image compression and form validation work offline.

### Edge function deployment fails
- Make sure ANTHROPIC_API_KEY is set: `supabase secrets list`
- Verify you're in the right project: `supabase projects list`
- Check logs: `supabase functions logs analyze`

### Images not compressing
- Use a modern browser (Chrome, Safari, Firefox)
- Check browser console for errors (F12 → Console tab)
- Try a different image file

### "Scan Another" doesn't reset properly
- Hard refresh the browser (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)
- Clear browser cache

## Next Steps

1. **Add authentication** - Allow users to sign up and save scan history
2. **Add image storage** - Save images to Supabase Storage for debugging
3. **Analytics** - Track which appliances are most common
4. **Offline support** - Queue scans when offline, sync when back online
5. **Mobile app** - Wrap with Capacitor/React Native for app stores
6. **Translations** - Support multiple languages

## Support

- Full setup guide: See README.md
- Implementation details: See IMPLEMENTATION_SUMMARY.md
- Code structure: Each file is well-commented and organized

---

**Ready to build?** Run `npm install && npm run dev` now!
