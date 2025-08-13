# Backend Integration Guide

This guide will help you integrate the new Trade Master AI backend with your existing frontend.

## 🚀 Quick Setup

### 1. Frontend Environment Configuration

Create a `.env` file in your frontend root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` to configure the backend:

```env
# Use the new backend API
VITE_API_PROVIDER=backend
VITE_API_URL=http://localhost:5000/api

# Enable AI features
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_SUBSCRIPTION_FEATURES=true
```

### 2. Install Required Dependencies

The integration requires axios for API communication:

```bash
npm install axios
```

### 3. Start the Backend

Navigate to the backend directory and start the server:

```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with MongoDB, Redis, JWT secret, and OpenRouter API key
npm run dev
```

### 4. Start the Frontend

In the frontend directory:

```bash
npm run dev
```

## 🔄 API Provider Switching

The integration includes a configuration system that allows you to switch between the new backend and existing Supabase:

### Use Backend API (Recommended)
```env
VITE_API_PROVIDER=backend
VITE_API_URL=http://localhost:5000/api
```

### Use Supabase API (Fallback)
```env
VITE_API_PROVIDER=supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

## 🎯 New Features Available

When using the backend API, you get access to:

### AI-Powered Analysis
- **Individual Trade Analysis**: Get AI insights for specific trades
- **Overall Trading Insights**: Portfolio-level analysis and recommendations
- **Pattern Recognition**: Identify successful trading patterns
- **Risk Assessment**: AI-powered risk evaluation

### Subscription Management
- **Free Tier**: Basic trade logging
- **Premium Tier**: AI analysis for individual trades (50/month)
- **Professional Tier**: Full AI features including batch analysis (5000/month)

### Advanced Features
- **Queue Processing**: Background AI analysis
- **Usage Tracking**: Monitor AI analysis usage
- **Trading Statistics**: Comprehensive performance metrics
- **Automated Analysis**: Periodic AI analysis for new trades

## 🔧 Integration Components

### API Client
- **Location**: `src/integrations/backend/client.ts`
- **Features**: JWT authentication, error handling, request/response interceptors

### Hooks
- **Authentication**: `src/hooks/useBackendAuth.ts`
- **Trades**: `src/hooks/useBackendTrades.ts`
- **AI Analysis**: `src/hooks/useBackendAI.ts`
- **Unified**: `src/hooks/useTrades.ts` (auto-switches based on config)

### Types
- **Location**: `src/integrations/backend/types.ts`
- **Features**: Complete TypeScript definitions for all API responses

### Configuration
- **Location**: `src/config/api.ts`
- **Features**: Centralized API provider switching and feature flags

## 🧪 Testing the Integration

### 1. Test Authentication
```typescript
import { useBackendAuth } from '@/hooks/useBackendAuth';

const { login, register, user, isAuthenticated } = useBackendAuth();

// Test login
const success = await login({ email: 'test@example.com', password: 'password' });
```

### 2. Test Trade Operations
```typescript
import { useBackendTrades } from '@/hooks/useBackendTrades';

const { addTrade, updateTrade, deleteTrade, analyzeTrade } = useBackendTrades();

// Test trade creation
const success = await addTrade({
  tradePair: 'EUR/USD',
  tradeType: 'buy',
  entryPrice: 1.0850,
  positionSize: 10000,
  timeframe: '1h'
});
```

### 3. Test AI Analysis
```typescript
import { useBackendAI } from '@/hooks/useBackendAI';

const { generateOverallInsight, getUsageStats } = useBackendAI();

// Test AI analysis
const insight = await generateOverallInsight(5, true);
```

## 🔄 Migration from Supabase

### Automatic Compatibility
The integration maintains compatibility with your existing components:

1. **Form Data Conversion**: Automatically converts between frontend form data and backend API format
2. **Field Mapping**: Maps frontend fields (asset → tradePair, positionType → tradeType, etc.)
3. **Price Scaling**: Handles the existing price scaling workaround when using Supabase
4. **Error Handling**: Consistent error handling across both APIs

### Component Updates
Your existing components will work with minimal changes:

```typescript
// Before (Supabase)
import { useTrades } from '@/dashboard/hooks/useTrades';

// After (Backend) - Same interface!
import { useTrades } from '@/hooks/useTrades';
```

## 🚨 Troubleshooting

### Backend Connection Issues
1. Ensure backend is running on port 5000
2. Check CORS configuration in backend
3. Verify API URL in frontend .env

### Authentication Issues
1. Check JWT secret configuration
2. Verify token storage in localStorage
3. Check browser network tab for 401 errors

### AI Analysis Issues
1. Verify OpenRouter API key in backend .env
2. Check subscription plan in user profile
3. Monitor backend logs for AI service errors

### Database Issues
1. Ensure MongoDB is running and accessible
2. Check Redis connection for queue processing
3. Verify database connection strings

## 📊 Monitoring

### Backend Monitoring
- **Health Check**: `GET /api/health`
- **System Status**: `GET /api/status`
- **Logs**: Check `backend/logs/` directory

### Frontend Monitoring
- **Console Logs**: Check browser console for API errors
- **Network Tab**: Monitor API requests and responses
- **Local Storage**: Check for authentication tokens

## 🎉 Success Indicators

You'll know the integration is working when:

1. ✅ Frontend connects to backend API successfully
2. ✅ User registration and login work
3. ✅ Trade creation, updating, and deletion work
4. ✅ AI analysis features are available (Premium+ users)
5. ✅ Statistics and insights are populated
6. ✅ No console errors related to API calls

## 🔄 Rollback Plan

If you need to rollback to Supabase:

1. Change environment variable:
   ```env
   VITE_API_PROVIDER=supabase
   ```

2. Restart the frontend - it will automatically use Supabase again

## 🆘 Support

If you encounter issues:

1. Check the backend logs in `backend/logs/`
2. Monitor browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure all required services (MongoDB, Redis) are running

The integration is designed to be seamless and maintain full compatibility with your existing frontend while adding powerful AI capabilities!
