# Explore Ida - Setup Guide

## Quick Start

### Option 1: Docker (Recommended)

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Get API keys from [Unsplash](https://unsplash.com/developers) and [Pexels](https://www.pexels.com/api/)

2. **Setup Environment Variables**
   ```bash
   # Copy and edit .env files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit backend/.env with your API keys
   ```

3. **Run with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Access the Application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. **Create Virtual Environment**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Install MongoDB and Redis** (Optional - cache will be disabled if not available)
   - MongoDB: https://www.mongodb.com/try/download/community
   - Redis: https://redis.io/download

5. **Run Backend**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

#### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   ```

3. **Run Frontend**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Open http://localhost:5173

## API Keys Setup

### Unsplash API
1. Go to https://unsplash.com/developers
2. Create a new application
3. Copy the Access Key
4. Add to `backend/.env`:
   ```
   UNSPLASH_ACCESS_KEY=your_access_key_here
   ```

### Pexels API
1. Go to https://www.pexels.com/api/
2. Sign up and get your API key
3. Add to `backend/.env`:
   ```
   PEXELS_API_KEY=your_api_key_here
   ```

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Run Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Deployment

### Deploy to Vercel (Frontend)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel Dashboard

### Deploy to Render (Backend)

1. **Create New Web Service** on Render
2. **Connect GitHub Repository**
3. **Configure Build Settings**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Add Environment Variables** in Render Dashboard

### Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create exploreidea-api
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   git init
   heroku git:remote -a exploreidea-api
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

4. **Set Config Vars**
   ```bash
   heroku config:set UNSPLASH_ACCESS_KEY=your_key
   heroku config:set PEXELS_API_KEY=your_key
   ```

## Troubleshooting

### CLIP Model Download Issues
If CLIP model fails to download:
```bash
# Manually download model
python -c "import clip; clip.load('ViT-B/32')"
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Try connecting without MongoDB (cache will be disabled)

### Redis Connection Issues
- Ensure Redis is running
- Check connection string in `.env`
- Application will work without Redis (no caching)

## Performance Optimization

### Enable GPU Support (Optional)
If you have NVIDIA GPU:
```bash
# Install PyTorch with CUDA
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118

# Set device in .env
DEVICE=cuda
```

### Optimize Image Loading
- Use CDN for image hosting
- Enable lazy loading
- Implement image compression

## Security Checklist

- [ ] Change default SECRET_KEY in production
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS in production
- [ ] Set up rate limiting
- [ ] Implement user authentication
- [ ] Validate and sanitize all inputs
- [ ] Use CORS properly

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: your.email@example.com
- Documentation: Full docs in README.md

## License

MIT License - See LICENSE file
