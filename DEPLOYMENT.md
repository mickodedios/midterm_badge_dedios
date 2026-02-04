# Netlify Deployment Guide

## Quick Deployment Steps

### Method 1: Drag and Drop (Easiest)

1. **Build the project:**
   ```bash
   cd community-help-desk
   npm install
   ng build --configuration production
   ```

2. **Locate build output:**
   - Navigate to `dist/community-help-desk/browser/` folder

3. **Deploy to Netlify:**
   - Go to https://app.netlify.com/drop
   - Drag and drop the entire `browser` folder
   - Wait for deployment to complete
   - Copy the provided URL

### Method 2: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd community-help-desk
   npm install
   ng build --configuration production
   netlify deploy --prod --dir=dist/community-help-desk/browser
   ```

4. **Copy the deployment URL**

### Method 3: GitHub Integration (Best for Updates)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com/
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository
   - Configure build settings:
     - **Build command:** `ng build --configuration production`
     - **Publish directory:** `dist/community-help-desk/browser`
   - Click "Deploy site"

## Configuration Files

### netlify.toml (Optional but Recommended)

Create this file in the root directory:

```toml
[build]
  publish = "dist/community-help-desk/browser"
  command = "ng build --configuration production"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### _redirects (Alternative to netlify.toml)

Create this file in `src/` folder:

```
/*    /index.html   200
```

## Troubleshooting

### Problem: 404 on page refresh

**Solution:** Add redirects configuration (see above)

### Problem: Build fails

**Solution:** 
- Check Node.js version (use v18+)
- Delete `node_modules` and run `npm install` again
- Verify all dependencies in package.json

### Problem: API not loading

**Solution:**
- Check browser console for CORS errors
- JSONPlaceholder API should work without issues
- Verify internet connection

## Environment Variables (if needed)

If you need environment variables:

1. **In Netlify Dashboard:**
   - Go to Site settings > Build & deploy > Environment
   - Add variables

2. **In Angular:**
   ```typescript
   // environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'https://jsonplaceholder.typicode.com'
   };
   ```

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All routes work (/home, /about, /services, /contact)
- [ ] Navigation works
- [ ] Data loads from API
- [ ] Search functionality works
- [ ] Form submission works
- [ ] Mobile responsive
- [ ] No console errors

## Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## Submission

After successful deployment:

1. Copy your Netlify URL (e.g., https://your-site-name.netlify.app)
2. Test all functionality
3. Submit the URL in your assignment

---

**Your Netlify URL:** _________________________

**Deployment Date:** _________________________

**Status:** ✅ Successfully Deployed
