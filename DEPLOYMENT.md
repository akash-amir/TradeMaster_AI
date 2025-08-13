# TradeMaster AI - Vercel Deployment Guide

## 🚀 Deployment Steps

### 1. Pre-deployment Setup

1. **Environment Variables**: Set up your environment variables in Vercel dashboard:
   - `VITE_API_PROVIDER=supabase`
   - `VITE_SUPABASE_URL=https://tndgcypaguwxeizryfoj.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZGdjeXBhZ3V3eGVpenJ5Zm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzYwMDMsImV4cCI6MjA2NTk1MjAwM30.bcaJXkjYtXJefotEf-k4hmdDa3IKGsdMFswHA8wzLHs`
   - `VITE_ENABLE_AI_FEATURES=true`
   - `VITE_ENABLE_SUBSCRIPTION_FEATURES=true`
   - `VITE_DEBUG_MODE=false`
   - `VITE_LOG_LEVEL=error`

2. **Build Settings**: Ensure these settings in Vercel:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. SPA Routing Fix

The `vercel.json` file has been created to handle client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes (like `/admin`, `/admin/overview`, etc.) are handled by React Router instead of returning 404 errors.

### 3. Common Issues & Solutions

#### 404 Errors on Direct Navigation
- **Problem**: Navigating directly to `/admin` or other routes returns 404
- **Solution**: The `vercel.json` file fixes this by rewriting all routes to `index.html`

#### Supabase Connection Issues
- **Problem**: Supabase calls work locally but fail in production
- **Solution**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correctly set in Vercel environment variables

#### Environment Variables Not Working
- **Problem**: Environment variables work locally but not in production
- **Solution**: Set environment variables in Vercel dashboard, not just in `.env` files

#### Build Failures
- **Problem**: Build fails during deployment
- **Solution**: Check that all dependencies are in `package.json` and run `npm run build` locally first

### 4. Deployment Checklist

- [ ] `vercel.json` file is present in root directory
- [ ] Environment variables are set in Vercel dashboard
- [ ] Build command is set to `npm run build`
- [ ] Output directory is set to `dist`
- [ ] All routes work after deployment (test `/admin`, `/admin/overview`, etc.)
- [ ] API calls work with production API URL
- [ ] No console errors in browser

### 5. Testing After Deployment

1. **Direct URL Access**: Test navigating directly to:
   - `/admin`
   - `/admin/overview`
   - `/admin/users`
   - `/admin/subscriptions`
   - `/admin/payments`

2. **Functionality**: Verify:
   - Admin login works with hardcoded credentials
   - All admin pages load correctly
   - Navigation between pages works
   - Supabase connection is working
   - No 404 errors in browser console

### 6. Troubleshooting

If you still encounter issues:

1. **Check Vercel Function Logs**: Look for errors in the Vercel dashboard
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Test Build Locally**: Run `npm run build` and `npm run preview` locally
4. **Check Network Tab**: Look for failed API calls in browser dev tools

## 📝 Notes

- The admin panel uses client-side routing with React Router
- All routes must be rewritten to `index.html` for SPA to work correctly
- Environment variables must be prefixed with `VITE_` to be accessible in the frontend
- Admin credentials are hardcoded in the application (no backend authentication required)
- Supabase is used as the backend database and API provider
- The same Supabase URL and anon key work for both development and production
