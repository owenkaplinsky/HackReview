# Render Deployment Guide

## 🚨 Fixed Requirements Issues

The pip issues were caused by:

1. **Python 3.13 compatibility** - You're using Python 3.13 locally, but Render uses Python 3.9-3.11
2. **Pydantic compilation** - Newer pydantic versions require Rust compilation
3. **Version conflicts** - The updated versions had compatibility issues

## ✅ Solution Applied

1. **Reverted to stable versions** that work on Render
2. **Added `runtime.txt`** to specify Python 3.11.7 for Render
3. **Removed problematic dependencies** that require compilation

## 📋 Current Requirements (Fixed)

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-dotenv==1.0.0
requests==2.31.0
pydantic==2.6.1
python-multipart==0.0.6
gunicorn==21.2.0
```

## 🚀 Render Deployment Steps

1. **Connect your GitHub repository** to Render
2. **Set these environment variables** in Render dashboard:

   ```
   SCHEMA_API_URL=your_schema_api_url_here
   SCHEMA_API_TOKEN=your_schema_api_token_here
   ELIGIBILITY_API_URL=your_eligibility_api_url_here
   ELIGIBILITY_API_TOKEN=your_eligibility_api_token_here
   GRADER_API_URL=your_grader_api_url_here
   GRADER_API_TOKEN=your_grader_api_token_here
   ```

3. **Build Settings** (try these in order):

   **Option 1 (Recommended for Render)**:

   - **Build Command**: `pip install --upgrade pip && pip install -r requirements-render.txt`
   - **Start Command**: `python main.py`
   - **Python Version**: Will use Python 3.11.7 (from runtime.txt)

   **Option 2 (If Option 1 fails)**:

   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Python Version**: Will use Python 3.11.7 (from runtime.txt)

   **Option 3 (Backup)**:

   - **Build Command**: `pip install --upgrade pip && pip install -r requirements-minimal.txt`
   - **Start Command**: `python main.py`
   - **Python Version**: Will use Python 3.11.7 (from runtime.txt)

   **Option 4 (Last resort)**:

   - **Build Command**: `pip install --upgrade pip setuptools wheel && pip install -r requirements-minimal.txt --no-cache-dir`
   - **Start Command**: `python main.py`

4. **Deploy!**

## 🔍 Verification

After deployment, check:

- `https://crewjudge-server.onrender.com/api/health` - Should return health status
- `https://crewjudge-server.onrender.com/` - Should return API info

## 🐛 If Build Still Fails

If you still get build errors, try these Render build settings:

- **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
- **Start Command**: `python main.py`

The issue was with the newer package versions requiring Rust compilation, which isn't available on Render's build environment.
