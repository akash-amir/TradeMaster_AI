# 🧪 Backend Integration Testing Guide

Follow these steps to test the Trade Master AI backend integration with your frontend.

## 📋 Prerequisites

Before testing, ensure you have:
- ✅ Node.js installed
- ✅ Frontend dependencies installed (`npm install`)
- ✅ Backend dependencies installed (`cd backend && npm install`)
- ✅ Environment files configured

## 🚀 Step 1: Quick Backend Test (No External Services)

First, let's test if the backend can start without MongoDB/Redis:

### 1.1 Test Basic Backend Connectivity

```bash
# In the main directory, run the simple test
node simple-test.js
```

This will test if the backend is responding on port 5000.

### 1.2 If Backend is Not Running

Start the backend server:

```bash
# Open a new terminal
cd backend
npm start
```

If you see errors about MongoDB or Redis, that's normal for now. The basic API endpoints should still work.

## 🔧 Step 2: Frontend Integration Test

### 2.1 Check Frontend Configuration

Verify your `.env` file in the main directory contains:

```env
VITE_API_PROVIDER=backend
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_AI_FEATURES=true
```

### 2.2 Start Frontend with Backend Integration

```bash
# In the main directory
npm run dev
```

### 2.3 Test Frontend-Backend Connection

1. **Open the browser** and go to your frontend (usually `http://localhost:5173`)
2. **Open Developer Tools** (F12) and check the Console tab
3. **Look for API calls** - you should see requests to `localhost:5000/api`

## 🧪 Step 3: Manual Testing Scenarios

### 3.1 Test API Provider Switching

**Test Backend API:**
1. Ensure `.env` has `VITE_API_PROVIDER=backend`
2. Restart frontend (`npm run dev`)
3. Check browser console for API calls to `localhost:5000`

**Test Supabase Fallback:**
1. Change `.env` to `VITE_API_PROVIDER=supabase`
2. Restart frontend
3. Check browser console for API calls to Supabase

### 3.2 Test Trade Operations (Backend Mode)

With `VITE_API_PROVIDER=backend`:

1. **Try to add a trade** in the frontend
2. **Check browser console** for API calls
3. **Expected behavior:**
   - If backend is running: API calls to `localhost:5000/api/trades`
   - If authentication works: Trade should be created
   - If MongoDB is not connected: May get database errors (that's OK for testing)

### 3.3 Test Authentication Flow

1. **Try to register/login** (if your frontend has auth)
2. **Check browser console** for:
   - API calls to `/api/auth/register` or `/api/auth/login`
   - JWT tokens being stored in localStorage
   - Authentication headers in subsequent requests

## 🔍 Step 4: Advanced Testing (With Full Backend)

If you want to test the full AI features, you'll need:

### 4.1 Set Up MongoDB (Optional)

**Option A: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at mongodb.com
2. Get connection string
3. Update `MONGODB_URI` in `backend/.env`

### 4.2 Set Up Redis (Optional)

**Option A: Local Redis**
```bash
# Install Redis locally or use Docker
docker run -d -p 6379:6379 --name redis redis:latest
```

**Option B: Redis Cloud**
1. Create free account at redis.com
2. Get connection string
3. Update `REDIS_URL` in `backend/.env`

### 4.3 Set Up OpenRouter API (Optional)

1. Get API key from openrouter.ai
2. Update `OPENROUTER_API_KEY` in `backend/.env`

### 4.4 Run Full Integration Test

With all services running:

```bash
# Run the comprehensive test
node test-integration.js
```

## 📊 Expected Results

### ✅ Success Indicators

**Basic Integration (No External Services):**
- ✅ Frontend loads without errors
- ✅ API calls go to correct endpoint (backend vs supabase)
- ✅ Browser console shows API requests
- ✅ Configuration switching works

**Full Integration (With Services):**
- ✅ User registration/login works
- ✅ Trade creation/editing works
- ✅ AI analysis features available
- ✅ Statistics and insights populated

### ⚠️ Partial Success

- ✅ Frontend connects to backend
- ❌ Database operations fail (MongoDB not connected)
- ❌ AI features unavailable (OpenRouter not configured)
- **This is OK for testing the integration!**

### ❌ Integration Issues

- ❌ Frontend shows CORS errors
- ❌ API calls go to wrong endpoint
- ❌ Authentication doesn't work
- ❌ No API calls visible in console

## 🛠️ Troubleshooting

### Common Issues

**1. CORS Errors**
```
Access to XMLHttpRequest at 'http://localhost:5000/api' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:** Backend CORS is configured for `http://localhost:3000`. Update `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

**2. API Calls to Wrong Endpoint**
**Solution:** Check `.env` file and restart frontend

**3. Backend Not Starting**
**Solution:** Check `backend/.env` file has required variables

**4. Authentication Issues**
**Solution:** Check browser localStorage for JWT tokens

### Debug Commands

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check API documentation
curl http://localhost:5000/api

# Check system status
curl http://localhost:5000/api/status
```

## 🎯 Testing Checklist

- [ ] Backend starts without critical errors
- [ ] Frontend connects to backend API
- [ ] API provider switching works
- [ ] Trade operations call correct endpoints
- [ ] Authentication flow works (if applicable)
- [ ] Browser console shows no integration errors
- [ ] Configuration changes take effect after restart

## 🎉 Success!

If you can check most items above, your backend integration is working! 

**Next Steps:**
1. Set up external services (MongoDB, Redis) for full functionality
2. Configure OpenRouter API for AI features
3. Test AI analysis features with premium subscription
4. Deploy to production when ready

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check backend logs in `backend/logs/`
3. Verify environment variables
4. Test with simple-test.js first
5. Try switching back to Supabase mode as fallback
