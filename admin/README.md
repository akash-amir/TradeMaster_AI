# TradeMaster AI - Admin Panel

A comprehensive admin panel for managing the TradeMaster AI SaaS trading analysis platform.

## Features

### 🔐 Authentication
- Secure admin login with email/password
- Forgot password functionality
- Protected routes with automatic token validation
- Session management with auto-logout

### 📊 Dashboard Overview
- Real-time platform statistics
- User growth charts
- Revenue analytics
- System health monitoring
- Recent activity feed

### 👥 User Management
- View all user accounts with detailed information
- Search and filter users by status, plan, and activity
- Suspend/activate user accounts
- Reset user passwords
- Export user data to CSV
- View user activity logs and trading statistics

### 💳 Subscription Management
- Monitor all subscription plans and statuses
- Upgrade/downgrade user plans
- Cancel subscriptions with immediate or end-of-period options
- Track subscription revenue and churn rates
- Integration with Stripe for live billing data

### 💰 Payment Management
- Complete payment history with filtering
- Payment status tracking (succeeded, failed, pending, refunded)
- Process refunds directly from the admin panel
- Export payment data for accounting
- Monitor payment success rates and failure patterns

### 🔑 API Key Management
- View all user API keys and usage statistics
- Monitor API request volumes and patterns
- Revoke API keys for security or abuse
- Track high-usage accounts
- Set and enforce API rate limits

### 🤖 AI Feedback & Logs
- Monitor AI-generated feedback and analysis
- View trade feedback logs with confidence scores
- Flag inappropriate or problematic content
- Delete flagged feedback entries
- Track AI system performance and accuracy

### ⚙️ System Settings
- Configure platform-wide settings
- Enable/disable new user registrations
- Set maintenance mode
- Configure email notifications
- Manage API rate limits per plan
- Security and session management

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS with custom design system
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6
- **UI Components**: Radix UI primitives
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API server running on port 5000

### Installation

1. **Navigate to admin directory:**
   ```bash
   cd admin
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
   VITE_API_URL=http://localhost:5000/admin
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the admin panel:**
   Open http://localhost:3001 in your browser

### Default Admin Credentials
For development, use these credentials:
- Email: `admin@trademaster.ai`
- Password: `admin123`

## Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (buttons, cards, etc.)
│   │   ├── DashboardLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── use-toast.ts
│   ├── lib/                # Utilities and API client
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── OverviewPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── SubscriptionsPage.tsx
│   │   ├── PaymentsPage.tsx
│   │   ├── APIKeysPage.tsx
│   │   ├── FeedbackPage.tsx
│   │   └── SettingsPage.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## API Integration

The admin panel communicates with the backend API through the following endpoints:

### Authentication
- `POST /admin/auth/login` - Admin login
- `GET /admin/auth/profile` - Get admin profile
- `POST /admin/auth/forgot-password` - Password reset

### Dashboard & Stats
- `GET /admin/stats/dashboard` - Dashboard statistics
- `GET /admin/stats/user-growth` - User growth data
- `GET /admin/stats/revenue` - Revenue analytics

### User Management
- `GET /admin/users` - List users with pagination and filters
- `GET /admin/users/:id` - Get specific user details
- `PUT /admin/users/:id` - Update user information
- `POST /admin/users/:id/suspend` - Suspend user account
- `POST /admin/users/:id/activate` - Activate user account
- `POST /admin/users/:id/reset-password` - Reset user password

### Subscription Management
- `GET /admin/subscriptions` - List subscriptions
- `PUT /admin/subscriptions/:id` - Update subscription
- `POST /admin/subscriptions/:id/cancel` - Cancel subscription

### Payment Management
- `GET /admin/payments` - List payments with filters
- `POST /admin/payments/:id/refund` - Process refund

### API Key Management
- `GET /admin/api-keys` - List API keys
- `POST /admin/api-keys/:id/revoke` - Revoke API key
- `GET /admin/api-keys/:id/usage` - Get usage statistics

### Feedback & Logs
- `GET /admin/feedback` - List feedback logs
- `POST /admin/feedback/:id/flag` - Flag feedback
- `DELETE /admin/feedback/:id` - Delete feedback

### Settings
- `GET /admin/settings` - Get admin settings
- `PUT /admin/settings` - Update admin settings

## Security Features

- **JWT-based authentication** with automatic token refresh
- **Protected routes** that redirect to login if not authenticated
- **Role-based access control** (super_admin vs admin)
- **Session timeout** with configurable duration
- **Audit logging** for all admin actions
- **CSRF protection** through secure headers
- **Input validation** and sanitization

## Responsive Design

The admin panel is fully responsive and works on:
- **Desktop** (1200px+): Full sidebar navigation
- **Tablet** (768px-1199px): Collapsible sidebar
- **Mobile** (320px-767px): Mobile-optimized navigation

## Performance Optimizations

- **Code splitting** with React.lazy for route-based chunks
- **Query caching** with TanStack Query for efficient data fetching
- **Optimistic updates** for better user experience
- **Skeleton loading** states for smooth transitions
- **Debounced search** to reduce API calls
- **Pagination** for large datasets

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables for Production
```env
VITE_API_URL=https://api.trademaster.ai/admin
VITE_NODE_ENV=production
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Add TypeScript types for all new features
3. Include proper error handling and loading states
4. Test all CRUD operations thoroughly
5. Ensure responsive design on all screen sizes

## Support

For issues and questions:
- Check the browser console for errors
- Verify API endpoint connectivity
- Ensure proper authentication tokens
- Review network requests in developer tools

---

**TradeMaster AI Admin Panel** - Comprehensive platform management for the modern SaaS trading platform.