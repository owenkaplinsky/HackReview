# CORS Troubleshooting Guide

## 🚨 Issue: CORS Policy Blocking Frontend Requests

### **Error Message:**

```
Access to fetch at 'https://crewjudge-server.onrender.com/api/schema' from origin 'https://crew-judge.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ **Fixes Applied:**

### 1. **Enhanced CORS Configuration**

- Added multiple origin variations for your frontend
- Added explicit HTTP methods
- Added `expose_headers` for better compatibility

### 2. **Added CORS Preflight Handler**

- Handles OPTIONS requests properly
- Ensures preflight requests are processed

### 3. **Added Test Endpoint**

- `/api/test` - Test backend connectivity
- `/api/health` - Check API status

## 🔍 **Testing Steps:**

### **Step 1: Test Backend Directly**

Visit these URLs in your browser:

- `https://crewjudge-server.onrender.com/` - Should show API info
- `https://crewjudge-server.onrender.com/api/test` - Should show test response
- `https://crewjudge-server.onrender.com/api/health` - Should show health status

### **Step 2: Test CORS from Browser Console**

Open browser console on `https://crew-judge.vercel.app` and run:

```javascript
fetch("https://crewjudge-server.onrender.com/api/test")
  .then((response) => response.json())
  .then((data) => console.log("CORS Test:", data))
  .catch((error) => console.error("CORS Error:", error));
```

### **Step 3: Check Network Tab**

1. Open DevTools → Network tab
2. Try making a request from your frontend
3. Look for the request to your backend
4. Check if CORS headers are present in the response

## 🚀 **Deployment Steps:**

1. **Commit and push** these changes to GitHub
2. **Redeploy on Render** - the CORS fixes will be applied
3. **Test the endpoints** using the URLs above
4. **Try your frontend again** - it should work now

## 🐛 **If Still Not Working:**

### **Check Render Logs:**

1. Go to your Render dashboard
2. Check the logs for any startup errors
3. Ensure the backend is running properly

### **Alternative CORS Configuration:**

If the issue persists, we can try a more permissive CORS setup:

```python
allow_origins=["*"]  # Only for testing - not recommended for production
```

The CORS configuration should now properly handle requests from your Vercel frontend!
