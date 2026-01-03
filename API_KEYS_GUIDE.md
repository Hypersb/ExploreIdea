# 🔑 API Keys Configuration Guide

## Required API Keys

Explore Ida uses two image APIs to provide diverse, high-quality results:

1. **Unsplash** - Professional photography
2. **Pexels** - Stock photos and videos

Both are **FREE** with generous limits!

---

## 1️⃣ Unsplash API Setup

### Step 1: Create Account
1. Visit: https://unsplash.com/developers
2. Click **"Register as a developer"**
3. Create account or login

### Step 2: Create Application
1. Click **"Your apps"** in top menu
2. Click **"New Application"**
3. Accept terms and conditions
4. Fill in application details:
   - **Application name**: `Explore Ida Development`
   - **Description**: `AI-powered visual search engine for learning`
5. Click **"Create application"**

### Step 3: Get API Key
1. Scroll to **"Keys"** section
2. Copy your **Access Key**
3. Keep this secure!

### Rate Limits (Free Tier)
- **50 requests per hour** (Demo mode)
- **5,000 requests per month**
- Upgrade to Production for 5,000/hour

### Add to .env
```bash
UNSPLASH_ACCESS_KEY=your_access_key_here
```

---

## 2️⃣ Pexels API Setup

### Step 1: Create Account
1. Visit: https://www.pexels.com/api/
2. Click **"Get Started"**
3. Sign up with email or Google

### Step 2: Get API Key
1. After login, you'll see your API key immediately
2. Or go to: https://www.pexels.com/api/
3. Copy your **API Key**

### Rate Limits (Free Tier)
- **200 requests per hour**
- **20,000 requests per month**
- No credit card required!

### Add to .env
```bash
PEXELS_API_KEY=your_api_key_here
```

---

## 📝 Complete .env Configuration

### Backend (.env location: `backend/.env`)

```bash
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
ENVIRONMENT=development

# ⭐ REQUIRED: Add your API keys here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
UNSPLASH_SECRET_KEY=your_unsplash_secret_key_here
PEXELS_API_KEY=your_pexels_api_key_here

# Database (Optional - works without these)
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=exploreidea
REDIS_URL=redis://localhost:6379

# CLIP Model Configuration
CLIP_MODEL_NAME=ViT-B/32
DEVICE=cpu  # Change to 'cuda' if you have NVIDIA GPU

# Security
SECRET_KEY=change-this-to-a-random-secret-key-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS - Add your frontend URL
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Cache Configuration
CACHE_TTL=3600
MAX_CACHE_SIZE=1000

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

### Frontend (.env location: `frontend/.env`)

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=Explore Ida
VITE_APP_VERSION=1.0.0
```

---

## ✅ Testing Your API Keys

### Test Backend Setup

1. **Start the backend**:
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

2. **Check health endpoint**:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Explore Ida",
  "clip_model": "ViT-B/32"
}
```

3. **Test search endpoint**:
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "golden gate bridge", "limit": 5}'
```

### Test in Browser

1. Visit: http://localhost:8000/docs
2. Try the `/api/search` endpoint
3. Use the interactive Swagger UI

---

## 🚨 Troubleshooting

### "Invalid API Key" Error

**Unsplash:**
- Check key copied correctly (no extra spaces)
- Verify application is in "Demo" mode
- Keys are case-sensitive

**Pexels:**
- Ensure key is from https://www.pexels.com/api/
- Check for typos
- Verify account is active

### "Rate Limit Exceeded"

**Solution:**
- Wait an hour for limits to reset
- Implement caching (Redis) to reduce API calls
- Use multiple API keys (create separate accounts)
- Upgrade to paid tier if needed

### "No results found"

**Check:**
1. API keys are correctly set in `.env`
2. Backend is reading `.env` file
3. Internet connection is working
4. API services are operational (check status pages)

### Backend not reading .env

```bash
# Verify .env file location
ls backend/.env

# Check if python-dotenv is installed
pip show python-dotenv

# Reinstall if needed
pip install python-dotenv
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep API keys in `.env` files
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate keys if exposed
- Use separate keys for dev/prod

### ❌ DON'T:
- Commit API keys to GitHub
- Share keys publicly
- Use production keys in development
- Hard-code keys in source files

---

## 📊 API Usage Monitoring

### Unsplash
- Dashboard: https://unsplash.com/developers
- View: Applications → Your App → Statistics

### Pexels
- Dashboard: https://www.pexels.com/api/
- Check usage in your account

---

## 🎯 Production Configuration

When deploying to production:

### Environment Variables (Vercel/Render)

**Render (Backend):**
```
Environment → Add Environment Variable
UNSPLASH_ACCESS_KEY = your_key
PEXELS_API_KEY = your_key
DEVICE = cpu
ALLOWED_ORIGINS = https://yourapp.vercel.app
```

**Vercel (Frontend):**
```
Settings → Environment Variables
VITE_API_BASE_URL = https://your-backend.onrender.com
```

### Upgrade to Production (Optional)

**Unsplash Production:**
- Apply at: https://unsplash.com/developers
- Guidelines: https://unsplash.com/documentation#guidelines
- Benefits: 5,000 requests/hour

---

## 🆓 Free Tier Summary

| API | Free Requests | Monthly Limit | Notes |
|-----|--------------|---------------|-------|
| Unsplash | 50/hour | 5,000/month | Upgrade available |
| Pexels | 200/hour | 20,000/month | Very generous |

**Total**: Up to 250 searches/hour for FREE! 🎉

---

## 💡 Tips for Development

### Reduce API Calls
1. **Enable Redis caching**: Stores results for 1 hour
2. **Limit results**: Start with `limit: 10` instead of 20
3. **Mock data**: Use sample data for UI development

### Test Without APIs
Create mock data in `backend/app/services/mock_data.py`:
```python
MOCK_IMAGES = [
    {
        "id": "mock_1",
        "url": "https://via.placeholder.com/800",
        "thumbnail_url": "https://via.placeholder.com/400",
        "metadata": {
            "title": "Test Image",
            "photographer": "Mock Photographer",
            "source": "mock"
        }
    }
]
```

---

## 📞 Support

### Unsplash Support
- Docs: https://unsplash.com/documentation
- Community: https://unsplash.com/developers

### Pexels Support
- Docs: https://www.pexels.com/api/documentation/
- Support: help@pexels.com

---

## ✨ You're All Set!

Once you've added your API keys:

1. ✅ Backend `.env` configured
2. ✅ Frontend `.env` configured
3. ✅ API keys tested
4. ✅ Ready to run!

**Next Step**: Run `start.bat` (Windows) or `./start.sh` (Mac/Linux)

Happy searching! 🚀
