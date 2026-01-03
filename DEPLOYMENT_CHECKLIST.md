# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment.

## Pre-Deployment

### Code Preparation
- [ ] All features tested locally
- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] 3D features working properly
- [ ] Search returns results
- [ ] Favorites functionality works
- [ ] Analytics dashboard loads

### Git & GitHub
- [ ] Code committed to GitHub
- [ ] Repository is public (or Vercel/Render have access)
- [ ] All sensitive files in .gitignore
- [ ] .env files not committed
- [ ] README.md updated

### API Keys
- [ ] Unsplash API key obtained
- [ ] Pexels API key obtained
- [ ] Keys tested locally
- [ ] Keys ready to add to Render

## Backend Deployment (Render)

### Initial Setup
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] New Web Service created
- [ ] Repository selected

### Configuration
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Python version set to 3.11
- [ ] Root directory: `backend` (if needed)

### Environment Variables
- [ ] `UNSPLASH_ACCESS_KEY` added
- [ ] `PEXELS_API_KEY` added
- [ ] `ENVIRONMENT=production` set
- [ ] `DEBUG=false` set
- [ ] `CLIP_MODEL_NAME=ViT-B/32` set
- [ ] `DEVICE=cpu` set
- [ ] `ALLOWED_ORIGINS` set to your Vercel URL

### Verification
- [ ] Deployment succeeded
- [ ] Backend URL copied
- [ ] Health check endpoint works: `/health`
- [ ] API docs accessible: `/docs`
- [ ] Test search endpoint

## Frontend Deployment (Vercel)

### Initial Setup
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] New Project created
- [ ] Repository imported

### Configuration
- [ ] Framework: Vite detected
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Environment Variables
- [ ] `VITE_API_BASE_URL` set to Render backend URL
- [ ] Example: `https://exploreidea-backend.onrender.com`

### Verification
- [ ] Deployment succeeded
- [ ] Frontend URL works
- [ ] Can access homepage
- [ ] 3D hero displays
- [ ] Search bar visible

## Post-Deployment Testing

### Functionality Tests
- [ ] Homepage loads with 3D hero
- [ ] Search for "Eiffel Tower" returns results
- [ ] Images display in 3D gallery
- [ ] Can toggle between 2D/3D views
- [ ] Can drag/rotate 3D gallery
- [ ] Can zoom in/out with scroll
- [ ] Click image opens modal
- [ ] Can favorite images
- [ ] Favorites page works
- [ ] Analytics dashboard loads
- [ ] All links work
- [ ] Mobile responsive

### Performance Tests
- [ ] First search completes (may take 30s on Render free tier)
- [ ] Subsequent searches are fast
- [ ] 3D animations smooth
- [ ] No console errors
- [ ] Images load properly

### API Tests
- [ ] Backend health check: `[your-backend-url]/health`
- [ ] API docs accessible: `[your-backend-url]/docs`
- [ ] CORS working (no CORS errors in console)
- [ ] Search endpoint returns data
- [ ] All endpoints responding

## Optional Enhancements

### Custom Domain
- [ ] Domain purchased
- [ ] Domain added to Vercel
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Subdomain for API (api.yourdomain.com)
- [ ] Backend ALLOWED_ORIGINS updated

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Render dashboard bookmarked
- [ ] Error tracking set up
- [ ] Uptime monitoring (optional)

### Documentation
- [ ] README.md updated with live URLs
- [ ] Deployment badges added
- [ ] Screenshots added
- [ ] Demo video recorded (optional)

### Portfolio
- [ ] Added to portfolio website
- [ ] LinkedIn post created
- [ ] GitHub profile updated
- [ ] Resume updated

## Troubleshooting

### If Backend Fails
- [ ] Check Render logs
- [ ] Verify environment variables
- [ ] Check CLIP model is downloading
- [ ] Ensure sufficient memory (512MB on free tier)

### If Frontend Fails
- [ ] Check Vercel deployment logs
- [ ] Verify VITE_API_BASE_URL is correct
- [ ] Check build command succeeded
- [ ] Test locally with production build: `npm run build && npm run preview`

### If Search Fails
- [ ] Check browser console for errors
- [ ] Verify backend is running
- [ ] Test backend endpoint directly
- [ ] Check CORS configuration
- [ ] Verify API keys are valid

### If 3D Doesn't Load
- [ ] Check browser console for Three.js errors
- [ ] Verify all dependencies installed
- [ ] Test on different browser
- [ ] Check WebGL support

## Success Criteria

Your deployment is successful when:
- ✅ Frontend loads at Vercel URL
- ✅ Backend responds at Render URL
- ✅ Search returns image results
- ✅ 3D gallery displays and is interactive
- ✅ All pages navigate correctly
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Fast loading times

## Final Steps

After successful deployment:
1. [ ] Share your project URL
2. [ ] Add to GitHub README
3. [ ] Create a demo video
4. [ ] Post on social media
5. [ ] Add to resume/portfolio
6. [ ] Star your own repo 😄

---

**Congratulations! Your AI-powered 3D image search engine is now live! 🎉**

Share it at:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.onrender.com`
- API Docs: `https://your-backend.onrender.com/docs`
