# ApplianceAI Prototype

ApplianceAI helps users operate unfamiliar home appliances by taking a photo and getting AI-generated step-by-step instructions. Snap a photo. Get instructions. Done.

## Features

- 📱 Mobile-first responsive design
- 🤖 AI-powered appliance identification via Claude's vision API
- 🎯 Category-specific context inputs (washing, cooking, dishwashing, etc.)
- 📸 In-browser image compression for fast uploads
- 🛡️ Safety tips and estimates with every response
- 💾 Scan history stored in Supabase PostgreSQL
- ⚡ Supabase Edge Functions for serverless backend
- 🎨 Beautiful Tailwind CSS design with custom animations

## Tech Stack

- **Frontend**: Astro + Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: Supabase PostgreSQL
- **AI**: Claude Vision API (claude-sonnet-4-5-20241022)
- **Hosting**: Static site (Fornex or any static host)

## Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase project (free tier works)
- An Anthropic API key for Claude access
- Git (optional, for version control)

## Frontend Setup

### 1. Install Dependencies

```bash
cd applianceai-prototype
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project:
1. Go to Settings → API
2. Copy the `Project URL` and `anon public` key

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. The app should load with the Welcome screen.

### 4. Build for Production

```bash
npm run build
```

This generates a static site in `dist/`. You can serve this anywhere (Fornex, Netlify, etc).

## Supabase Backend Setup

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign up
2. Create a new project (choose a region close to your users)
3. Wait for the project to initialize

### 2. Run the Database Migration

1. In the Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_create_scans.sql`
4. Paste it into the editor and click "Run"

This creates the `scans` table where appliance analysis results are stored.

### 3. Set Up Edge Function

You'll need the Supabase CLI to deploy the edge function:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxx

# Deploy the function
supabase functions deploy analyze --grant-type service_role
```

Get your `project-ref` from the Supabase dashboard URL: `https://app.supabase.com/project/your-project-ref`

**Important**: The `ANTHROPIC_API_KEY` is set as a Supabase secret and is only accessible to the edge function (not exposed to the frontend).

### 4. Verify the Edge Function

After deployment, test it:

```bash
# Get your service role key from Supabase dashboard (Settings → API → Service role key)
curl -X POST \
  "https://your-project.supabase.co/functions/v1/analyze" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "base64_image_data_here",
    "task": "washing",
    "context": {"loadSize": "medium"}
  }'
```

## How It Works

### Frontend Flow

1. **Welcome** → User taps "Get Started"
2. **Category Select** → Pick appliance type (washing machine, oven, etc.)
3. **Photo Capture** → Take a photo or upload from gallery
4. **Context Inputs** → Answer category-specific questions (load size, fabric type, etc.)
5. **Loading** → Image is compressed and sent to the backend
6. **Results** → Claude's response is displayed with steps, safety tips, and estimated time

### Image Compression

The app compresses images in the browser before sending to the edge function:
- Maximum dimension: 1024px
- Format: JPEG
- Quality: 0.8 (80%)

This keeps upload size small while maintaining enough quality for Claude to identify appliances.

### API Flow

1. Frontend calls: `POST /functions/v1/analyze`
2. Edge Function receives base64 image + task + context
3. Calls Claude API with multimodal message (image + text)
4. Saves result to `scans` table
5. Returns JSON with model, confidence, steps, safety tips, estimated time

### Response Format

The edge function returns:

```json
{
  "model": "LG WM4000CW Front Load Washer",
  "confidence": "high",
  "steps": [
    "Open the washer door by pulling the handle to the right",
    "Load your clothes, filling the drum about 3/4 full",
    "Add detergent to the dispenser drawer"
  ],
  "safetyTips": [
    "Do not overload the washer",
    "Remove metal items like zips before washing"
  ],
  "estimatedTime": "40 minutes"
}
```

## Deployment to Fornex

### Build the Static Site

```bash
npm run build
```

This creates a `dist/` folder with all static files.

### Upload to Fornex

1. Connect to your Fornex VPS via SFTP
2. Upload the contents of `dist/` to your web root (usually `/var/www/html/` or `/home/username/public_html/`)
3. Configure your web server (Nginx or Apache) to serve the files
4. Point your domain to the server

### Example Nginx Configuration

```nginx
server {
  listen 80;
  server_name applianceai.example.com;

  root /var/www/applianceai;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|svg|woff2?)$ {
    expires 30d;
  }
}
```

## Customization

### Change Colors

Edit `tailwind.config.mjs`:

```javascript
colors: {
  primary: '#1A1A2E',    // Navy
  secondary: '#16213E',  // Dark blue
  accent: '#E94560',     // Red
  surface: '#F8F9FA',    // Light gray
  text: '#333333',       // Dark gray
}
```

### Add More Appliance Categories

1. Add to `CategorySelect.astro`:

```astro
<button class="category-card ..." data-category="microwave">
  <span class="text-4xl">🔥</span>
  <span>Microwave</span>
</button>
```

2. Add context inputs to `ContextInputs.astro`:

```astro
<div id="microwave-inputs" class="hidden space-y-6">
  <!-- Your inputs here -->
</div>
```

3. Handle in `index.astro` script

### Modify Claude's Behavior

Edit the `systemPrompt` in `supabase/functions/analyze/index.ts` to change how Claude identifies appliances or formats responses.

## Troubleshooting

### "Missing image or task" error

- Ensure the frontend is sending base64 data (not file data)
- Check that task is one of: `washing`, `cooking`, `coffee`, `dishwashing`, `drying`, `other`

### "ANTHROPIC_API_KEY not configured"

- Verify the secret is set in Supabase: `supabase secrets list`
- Redeploy the function after setting the secret

### Edge Function returns 500 error

- Check function logs: `supabase functions logs analyze`
- Verify the image is valid base64
- Ensure Claude API key is correct

### Images not compressing

- Check browser console for errors
- Verify the canvas API is supported (should work on all modern browsers)
- Try a different image format

### "Scan Another" doesn't work

- Clear the browser cache or hard refresh (Ctrl+Shift+R)
- Check that all hidden state is being reset in the script

## Security Considerations

- The frontend only sends base64 images (not file metadata)
- The Claude API key is server-side only (never exposed to frontend)
- Database is Supabase-managed with built-in security
- Image compression is done client-side to reduce bandwidth
- No authentication is required for this prototype (add if deploying publicly)

## Performance

- Static site: instant loads, zero server rendering
- Image compression: ~100KB average payload size
- Edge Function: ~1-3s typical response time
- Database: indexes on created_at and user_id for fast queries

## Next Steps

1. **Authentication**: Add user accounts to track personal scan history
2. **Image Storage**: Save images to Supabase Storage for debugging/analytics
3. **Analytics**: Track which appliances are most common
4. **Offline Mode**: Cache results and queue offline scans
5. **Mobile App**: Wrap with Capacitor/React Native for app stores
6. **Multilingual**: Add i18n for different languages
7. **Feedback Loop**: Let users rate instruction accuracy

## License

MIT - Feel free to use, modify, and deploy.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Review Astro documentation: https://docs.astro.build
4. Check Claude API documentation: https://anthropic.com/docs
