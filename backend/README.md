# Trade Master AI Backend

A comprehensive, AI-powered backend for the Trade Master trading strategy tracker. Built with Node.js, Express, MongoDB, Redis, and integrated with OpenRouter's Qwen3 AI model for intelligent trade analysis.

## 🚀 Features

- **RESTful API** for trade management and user authentication
- **AI-Powered Analysis** using OpenRouter Qwen3 for trade insights
- **Queue System** with BullMQ and Redis for scalable AI processing
- **Automated Analysis** with cron jobs for periodic trade evaluation
- **Subscription Management** with tiered access to AI features
- **Comprehensive Logging** with Winston for monitoring and debugging
- **Security** with JWT authentication, rate limiting, and data validation
- **Production Ready** with error handling, graceful shutdown, and monitoring

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/          # Database and Redis connections
│   ├── middleware/      # Authentication, validation, error handling
│   ├── models/          # MongoDB schemas (User, Trade)
│   ├── routes/          # API endpoints
│   ├── services/        # AI service, queue management, cron jobs
│   ├── utils/           # Logger and utilities
│   └── server.js        # Main application entry point
├── logs/                # Application logs (auto-generated)
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** 5.0+ (local or cloud)
- **Redis** 6.0+ for queue management
- **OpenRouter API Key** for AI analysis

## 🛠️ Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/trademaster
   
   # Redis
   REDIS_URL=redis://localhost:6379
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # OpenRouter AI
   OPENROUTER_API_KEY=your-openrouter-api-key
   OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct
   
   # Server
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start required services:**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Start Redis (if running locally)
   redis-server
   ```

5. **Run the application:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Trades
- `GET /api/trades` - Get user trades (with filtering & pagination)
- `GET /api/trades/:id` - Get specific trade
- `POST /api/trades` - Create new trade
- `PUT /api/trades/:id` - Update trade
- `DELETE /api/trades/:id` - Delete trade
- `POST /api/trades/:id/analyze` - Generate AI analysis for trade
- `GET /api/trades/stats/summary` - Get trading statistics

### AI Analysis
- `GET /api/ai/overall-insight` - Generate overall trading insight
- `GET /api/ai/analysis-history` - Get AI analysis history
- `GET /api/ai/usage-stats` - Get AI usage statistics
- `POST /api/ai/batch-analyze` - Queue batch AI analysis (Professional)
- `GET /api/ai/insights/patterns` - Get trading pattern insights

### System
- `GET /api/health` - Health check
- `GET /api/status` - Detailed service status
- `GET /api/` - API documentation

## 🎯 Subscription Tiers

### Free Tier
- Basic trade logging
- Manual trade entry and management
- Basic statistics

### Premium Tier
- Individual trade AI analysis
- Overall trading insights
- Pattern recognition
- 50 AI analyses per month

### Professional Tier
- Batch AI analysis
- Advanced insights
- Priority processing
- 5000 AI analyses per month

## 🤖 AI Analysis Features

### Trade Analysis
- **Entry Quality**: Analysis of entry timing and market conditions
- **Risk Assessment**: Evaluation of position sizing and risk management
- **Market Context**: Understanding of market trends and sentiment
- **Performance Metrics**: Detailed P&L and efficiency analysis
- **Improvement Suggestions**: Actionable recommendations

### Overall Insights
- **Performance Trends**: Analysis of trading performance over time
- **Pattern Recognition**: Identification of successful and unsuccessful patterns
- **Risk Management**: Assessment of overall risk management practices
- **Strategy Effectiveness**: Evaluation of different trading strategies
- **Personalized Recommendations**: Tailored advice based on trading history

## 🔄 Queue System

The backend uses BullMQ with Redis for scalable AI processing:

- **Trade Analysis Jobs**: Individual trade analysis requests
- **Overall Insight Jobs**: Portfolio-level analysis
- **Batch Processing**: Multiple trades analyzed together
- **Priority Queues**: Premium users get priority processing
- **Retry Logic**: Automatic retry for failed AI requests
- **Rate Limiting**: Subscription-based usage limits

## ⏰ Automated Tasks

Cron jobs handle automated analysis and maintenance:

- **Periodic Trade Analysis**: Every 30 minutes for new trades
- **Usage Statistics Update**: Hourly user statistics refresh
- **Data Cleanup**: Daily cleanup of old temporary data
- **Weekly Insights**: Sunday morning insights for active users

## 📊 Logging and Monitoring

Winston logger provides comprehensive logging:

- **API Requests**: All HTTP requests and responses
- **AI Operations**: AI analysis requests and responses
- **Queue Jobs**: Job processing status and errors
- **Cron Jobs**: Scheduled task execution logs
- **System Events**: Database connections, errors, and warnings

Log files are automatically rotated daily and stored in the `logs/` directory.

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **Data Sanitization**: MongoDB injection prevention
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers and CSP
- **API Key Security**: Secure handling of external API keys

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database URLs
3. Set secure JWT secrets
4. Configure proper CORS origins
5. Set up SSL certificates

### Process Management
```bash
# Using PM2 for production
npm install -g pm2
pm2 start src/server.js --name "trademaster-api"
pm2 startup
pm2 save
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage

# API testing with provided Postman collection
# Import: postman/TradeMaster-API.postman_collection.json
```

## 📈 Performance Optimization

- **Database Indexing**: Optimized MongoDB queries
- **Redis Caching**: Cached frequently accessed data
- **Queue Processing**: Distributed AI processing
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip response compression
- **Memory Management**: Proper resource cleanup

## 🔧 Configuration

Key environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/trademaster` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | Required |
| `OPENROUTER_API_KEY` | OpenRouter API key | Required |
| `PORT` | Server port | `5000` |
| `ENABLE_CRON` | Enable cron jobs | `true` |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit per window | `100` |
| `AI_ANALYSIS_TIMEOUT` | AI request timeout (ms) | `30000` |

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity

2. **Redis Connection Failed**
   - Ensure Redis server is running
   - Verify Redis URL configuration
   - Check Redis authentication

3. **AI Analysis Failing**
   - Verify OpenRouter API key
   - Check API key permissions
   - Monitor rate limits

4. **Queue Jobs Not Processing**
   - Check Redis connection
   - Verify queue worker is running
   - Monitor queue dashboard

### Debug Mode
```bash
# Enable debug logging
DEBUG=trademaster:* npm run dev
```

## 📞 Support

For issues and questions:
- Check the logs in `logs/` directory
- Review API documentation at `/api`
- Monitor system status at `/api/status`
- Check queue status in Redis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Trade Master AI Backend** - Empowering traders with AI-driven insights and comprehensive trade management.
