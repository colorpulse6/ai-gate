# AI Gate - Full-Stack SaaS Starter

## Project Overview

This is a complete full-stack TypeScript SaaS starter project with:

- **Backend**: Node.js + Express + PostgreSQL + Prisma
- **Frontend**: Next.js 15 + Tailwind CSS + shadcn/ui
- **Authentication**: JWT with HTTP-only cookies
- **Payments**: Stripe integration
- **Analytics**: Built-in usage tracking

## Architecture

### Backend (`/backend`)

- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints
- **Services**: Business logic and external integrations
- **Middleware**: Authentication, error handling, validation
- **Database**: Prisma ORM with PostgreSQL

### Frontend (`/src`)

- **App Router**: Next.js 13+ app directory structure
- **Components**: Reusable UI components with shadcn/ui
- **Layout**: Dashboard layout with sidebar navigation
- **Pages**: Authentication, dashboard, analytics, billing, settings

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### Environment Setup

1. **Backend Environment** (`/backend/.env`):

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/ai_gate_db"
JWT_SECRET="your-super-secret-jwt-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

2. **Frontend Environment** (`/.env.local`):

```bash
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Database Setup

1. Create PostgreSQL database
2. Update DATABASE_URL in backend/.env
3. Run migrations: `cd backend && npm run db:migrate`
4. Seed database: `cd backend && npm run db:seed`

### Development

1. **Start Backend**:

```bash
cd backend
npm install
npm run dev
```

2. **Start Frontend**:

```bash
npm install
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Subscriptions

- `GET /api/subscriptions` - Get user subscription
- `POST /api/subscriptions/checkout` - Create checkout session
- `POST /api/subscriptions/cancel` - Cancel subscription
- `POST /api/subscriptions/webhook` - Stripe webhook

### Analytics

- `POST /api/analytics/track` - Track analytics event
- `GET /api/analytics/stats` - Get analytics stats
- `GET /api/analytics/usage` - Get usage data

## Database Schema

### User

- id, email, password, name, role
- Subscription relationship
- Analytics events

### Subscription

- id, userId, stripeSubscriptionId
- plan, status, billing cycle
- Current period dates

### Analytics

- id, userId, eventType, metadata
- Timestamp tracking
- Usage aggregation

## Frontend Components

### Layout

- `DashboardLayout` - Main app layout with sidebar
- Responsive design with mobile navigation

### Pages

- `/dashboard` - Main dashboard with analytics overview
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/analytics` - Detailed analytics view
- `/billing` - Subscription management
- `/settings` - User profile and settings

## Development Guidelines

### Adding New Features

1. **Backend**:

   - Add model to Prisma schema if needed
   - Create service in `/backend/src/services`
   - Create controller in `/backend/src/controllers`
   - Add routes in `/backend/src/routes`
   - Add middleware if needed

2. **Frontend**:
   - Create component in `/src/components`
   - Add page in `/src/app`
   - Update navigation in layout
   - Add API integration

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for code formatting
- Write descriptive commit messages

### Security

- JWT tokens stored in HTTP-only cookies
- CORS configured for frontend domain
- Helmet for security headers
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints

### Testing

- Add unit tests for services
- Add integration tests for API endpoints
- Add E2E tests for critical user flows

## Deployment

### Backend

- Build: `npm run build`
- Start: `npm start`
- Environment variables in production
- Database migrations: `npm run db:migrate`

### Frontend

- Build: `npm run build`
- Deploy to Vercel/Netlify
- Update CORS origins in backend

## Next Steps

1. Set up real database and configure environment variables
2. Implement frontend API integration
3. Add form validation and error handling
4. Set up Stripe webhook endpoints
5. Add comprehensive testing
6. Configure CI/CD pipeline
7. Add monitoring and logging
8. Implement email notifications
9. Add admin dashboard
10. Optimize performance and caching

## Useful Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## Technologies Used

- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Lucide React
- **Authentication**: JWT, bcrypt
- **Payments**: Stripe
- **Charts**: Recharts
- **Development**: ESLint, Prettier, nodemon
- **Database**: PostgreSQL with Prisma ORM

## Support

For questions or issues, please refer to the documentation or create an issue in the repository.
