# 🚀 Deployment Guide - Explore Ida

Deploy your AI-powered image search engine to the cloud for free!

## Overview

- **Frontend:** Vercel (Free tier)
- **Backend:** Render (Free tier)
- **Total Cost:** $0/month
- **Setup Time:** 10 minutes

---

## 📦 Part 1: Deploy Backend to Render

### Step 1: Prepare Your Code

1. Make sure all changes are committed to GitHub:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub

### Step 3: Deploy Backend

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `exploreidea-backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

4. **Add Environment Variables:**
   - `UNSPLASH_ACCESS_KEY` = your_unsplash_key
   - `PEXELS_API_KEY` = your_pexels_key
   - `ENVIRONMENT` = production
   - `DEBUG` = false
   - `CLIP_MODEL_NAME` = ViT-B/32
   - `DEVICE` = cpu

5. Click "Create Web Service"

6. Wait 5-10 minutes for deployment
   - First deploy takes longer (downloading CLIP model)
   - You'll see: "Your service is live 🎉"

7. **Copy your backend URL:**
   - Example: `https://exploreidea-backend.onrender.com`

### Step 4: Test Backend

Visit: `https://your-backend-url.onrender.com/docs`

You should see the API documentation!

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update Environment Variable

1. Update `frontend/.env.production`:
```bash
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

Or create it if it doesn't exist.

### Step 2: Commit Changes

```bash
git add .
git commit -m "Add production environment variables"
git push origin main
```

### Step 3: Deploy to Vercel

#### Option A: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click "Deploy with Vercel" button above
2. Import your GitHub repository
3. Configure:
   - **Project Name:** `exploreidea`
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variable:**
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.onrender.com`

5. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy frontend
cd frontend
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name? exploreidea
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add VITE_API_BASE_URL production
# Enter: https://your-backend-url.onrender.com
```

### Step 4: Get Your Live URL

Vercel will provide a URL like:
- `https://exploreidea.vercel.app`
- Or your custom domain

---

## ✅ Part 3: Verify Deployment

### Test Your Live App

1. Visit your Vercel URL
2. Try searching for "Eiffel Tower"
3. Check 3D gallery works
4. Test favorites functionality
5. View analytics dashboard

### Common Issues

#### ❌ "Failed to fetch" error
- Check backend is running on Render
- Verify VITE_API_BASE_URL is correct
- Check CORS settings in backend

#### ❌ Backend timeout on first request
- Render free tier spins down after 15 min inactivity
- First request after sleep takes ~30 seconds
- Subsequent requests are fast

#### ❌ CLIP model loading fails
- Increase Render instance memory (upgrade plan)
- Or use smaller model: `ViT-B/16`

---

## 🎯 Part 4: Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `exploreidea.com`)
4. Update DNS records as shown
5. SSL certificate auto-generated

### Add Custom Domain to Render

1. Go to your Render service
2. Click "Settings" → "Custom Domains"
3. Add domain (e.g., `api.exploreidea.com`)
4. Update DNS records
5. Update frontend env variable with new URL

---

## 📊 Monitoring & Analytics

### Render Dashboard
- View logs: Render dashboard → Your service → Logs
- Monitor usage: Dashboard → Metrics
- Free tier: 750 hours/month

### Vercel Analytics
- Enable Vercel Analytics (free)
- View traffic, performance, errors
- Settings → Analytics → Enable

---

## 🔄 Automatic Deployments

### GitHub Integration

Both Render and Vercel support auto-deployment:

1. **Backend (Render):** 
   - Auto-deploys on push to `main` branch
   - Configure in Render dashboard

2. **Frontend (Vercel):**
   - Auto-deploys on push to `main` branch
   - Preview deployments for pull requests

### Deployment Branches

```bash
# Production
git push origin main  # Auto-deploys to production

# Preview
git checkout -b feature/new-feature
git push origin feature/new-feature  # Creates preview deployment
```

---

## 💰 Upgrade Options

### Free Tier Limitations

**Render Free:**
- Spins down after 15 min inactivity
- 512 MB RAM
- Shared CPU

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited deployments
- No sleep time

### Paid Upgrades

**Render Starter ($7/mo):**
- Always on (no spin down)
- 512 MB RAM
- Faster response times

**Vercel Pro ($20/mo):**
- Analytics
- Team collaboration
- Priority support

---

## 🔐 Security Best Practices

1. **Environment Variables:**
   - Never commit API keys to GitHub
   - Use platform environment variables
   - Rotate keys periodically

2. **CORS Configuration:**
   - Update backend CORS to allow only your Vercel domain
   - Remove `*` wildcard in production

3. **Rate Limiting:**
   - Backend already has rate limiting
   - Monitor for abuse in Render logs

---

## 📝 Deployment Checklist

Before deploying:
- [ ] All code committed to GitHub
- [ ] API keys obtained (Unsplash, Pexels)
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] Environment variables prepared

After deploying:
- [ ] Backend deployed and live
- [ ] Frontend deployed and live
- [ ] Environment variables configured
- [ ] Test search functionality
- [ ] Test 3D features
- [ ] Verify CORS working
- [ ] Check mobile responsiveness

---

## 🆘 Getting Help

### Resources
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Issues](https://github.com/yourusername/exploreidea/issues)

### Troubleshooting
1. Check Render logs for backend errors
2. Check Vercel deployment logs
3. Verify environment variables
4. Test API endpoints directly

---

## 🎉 You're Live!

Congratulations! Your AI-powered image search engine is now live and accessible worldwide!

**Share your project:**
- Add to your portfolio
- Share on LinkedIn
- Tweet about it
- Add to your resume

**Example URLs:**
- Frontend: `https://exploreidea.vercel.app`
- Backend: `https://exploreidea-backend.onrender.com`
- API Docs: `https://exploreidea-backend.onrender.com/docs`

---

**Pro Tip:** Add a `README.md` badge to show your site is live!

```markdown
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://exploreidea.vercel.app)
[![API Status](https://img.shields.io/badge/api-online-success)](https://exploreidea-backend.onrender.com/health)
```

Happy deploying! 🚀
