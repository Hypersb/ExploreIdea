# 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR USERS                               │
│                    (Anywhere in the world)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │      VERCEL CDN (Global)      │
         │    ⚡ Fast Content Delivery   │
         └───────────────┬───────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React + Vite + Three.js                                 │  │
│  │  • 3D Image Gallery                                      │  │
│  │  • Interactive UI                                        │  │
│  │  • Search Interface                                      │  │
│  │  • Real-time Updates                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  URL: https://exploreidea.vercel.app                           │
│  Deploy: Auto on git push                                      │
│  Cost: FREE                                                    │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     │ HTTPS Requests
                     ▼
┌────────────────────────────────────────────────────────────────┐
│                    BACKEND (Render)                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  FastAPI + CLIP AI Model                                 │  │
│  │  • Image Search Endpoint                                 │  │
│  │  • AI Similarity Scoring                                 │  │
│  │  • Cache Layer                                           │  │
│  │  • Analytics                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  URL: https://exploreidea-backend.onrender.com                 │
│  Deploy: Auto on git push                                      │
│  Cost: FREE (with 15min sleep)                                 │
└────────────────┬──────────────┬────────────────────────────────┘
                 │              │
                 │              │ External API Calls
                 ▼              ▼
    ┌────────────────┐  ┌────────────────┐
    │  Unsplash API  │  │   Pexels API   │
    │  (Image Data)  │  │  (Image Data)  │
    └────────────────┘  └────────────────┘
         Free Tier          Free Tier
```

## Data Flow

### Search Request Flow

```
User Types Search
      ↓
Frontend (React)
      ↓
[HTTPS Request to Backend]
      ↓
Backend API (Render)
      ↓
CLIP Model Encoding
      ↓
Fetch Images from APIs
      ↓
Calculate Similarity
      ↓
Sort & Filter Results
      ↓
[Return JSON Response]
      ↓
Frontend Receives Data
      ↓
Render 3D Gallery
      ↓
User Sees Results ✨
```

### First Load Flow

```
User Visits URL
      ↓
Vercel CDN (Closest Edge)
      ↓
Download React App
      ↓
App Initializes
      ↓
Load 3D Components
      ↓
[Wake Up Backend]*
      ↓
Ready to Search! 🚀

*Note: Render free tier sleeps after 15min
First request may take 30s to wake up
```

## Environment Variables Flow

### Frontend (.env)
```
VITE_API_BASE_URL ──────┐
                        │
                        ▼
              Points to Backend URL
              (Render deployment URL)
```

### Backend (.env)
```
UNSPLASH_ACCESS_KEY ─────┐
PEXELS_API_KEY ──────────┼──► Used to fetch images
                         │
ALLOWED_ORIGINS ─────────┼──► CORS security
(Vercel URL)             │
                         │
CLIP_MODEL_NAME ─────────┴──► AI model config
```

## Deployment Workflow

```
┌──────────────┐
│   Developer   │
│  (You!)       │
└───────┬───────┘
        │
        │ 1. Write Code
        ▼
┌──────────────┐
│  Local Dev   │
│  Environment │
└───────┬───────┘
        │
        │ 2. Git Commit & Push
        ▼
┌──────────────┐
│   GitHub     │
│  Repository  │
└───┬─────┬────┘
    │     │
    │     │ 3. Webhook Trigger
    │     │
    ▼     ▼
┌────────┐  ┌────────┐
│ Vercel │  │ Render │
│ Build  │  │ Build  │
└───┬────┘  └───┬────┘
    │           │
    │ 4. Deploy │ 4. Deploy
    ▼           ▼
┌────────┐  ┌────────┐
│Frontend│  │Backend │
│ LIVE!  │  │ LIVE!  │
└────────┘  └────────┘
```

## Cost Breakdown

| Service | Free Tier | Paid Tier | What You Get |
|---------|-----------|-----------|--------------|
| **Vercel** | ✅ FREE | $20/mo | 100GB bandwidth, unlimited deployments |
| **Render** | ✅ FREE | $7/mo | 512MB RAM, sleeps after 15min inactivity |
| **Unsplash** | ✅ FREE | N/A | 50 requests/hour |
| **Pexels** | ✅ FREE | N/A | 200 requests/hour |
| **Domain** | ❌ $10-15/yr | - | Optional: Custom domain |
| **TOTAL** | **$0/mo** | ~$27/mo | For always-on + custom domain |

## Performance Expectations

### Free Tier
- ⚡ Frontend: Instant load (CDN)
- 🐌 Backend: 30s first request (cold start)
- ⚡ Backend: Fast after wake-up
- 😴 Backend: Sleeps after 15min idle

### Paid Tier ($7/mo Render Starter)
- ⚡ Frontend: Instant load (CDN)
- ⚡ Backend: Always fast (<500ms)
- 🔥 Backend: No sleep time
- 🚀 Better user experience

## Scaling Options

### Option 1: Current Setup (Free)
```
Vercel Free + Render Free
Perfect for: Portfolio, Demo, Low Traffic
Users: ~100/day
Cost: $0/month
```

### Option 2: Production Ready
```
Vercel Free + Render Starter
Perfect for: Real Users, Fast Response
Users: ~1,000/day
Cost: $7/month
```

### Option 3: High Performance
```
Vercel Pro + Render Standard
Perfect for: High Traffic, Analytics
Users: ~10,000/day
Cost: $32/month
```

### Option 4: Enterprise
```
Custom Infrastructure
Perfect for: Massive Scale
Users: Unlimited
Cost: Custom pricing
```

## Security Layers

```
┌─────────────────────────────────────┐
│  User Browser                        │
│  └─ HTTPS only                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Vercel Edge (CDN)                   │
│  └─ DDoS Protection                  │
│  └─ SSL/TLS Termination              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Backend (Render)                    │
│  └─ CORS Validation                  │
│  └─ Rate Limiting                    │
│  └─ Input Sanitization               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  External APIs                       │
│  └─ API Key Authentication           │
└─────────────────────────────────────┘
```

## Monitoring & Logs

### Where to Find Logs

**Frontend (Vercel):**
- Dashboard → Your Project → Deployments → View Logs
- Real-time function logs
- Build logs
- Error tracking

**Backend (Render):**
- Dashboard → Your Service → Logs tab
- Real-time application logs
- Startup logs
- Error traces

**Browser:**
- F12 → Console tab
- Network tab for API calls
- Performance monitoring

---

**This architecture gives you a production-ready, scalable application for FREE! 🎉**
