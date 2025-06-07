# AI Gate - Full-Stack TypeScript SaaS Starter

A complete full-st### 3. Database Setup

```bash
# Generate Prisma client
cd backend
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

### 4. Development

**Start the development servers:**

```bash
# Terminal 1: Start backend (API server on port 3001)
cd backend
npm run dev

# Terminal 2: Start frontend (Next.js on port 3000)
npm run dev
```

**Or use VS Code tasks:**
- `Ctrl+Shift+P` → "Tasks: Run Task"
- Select "Start Backend Dev" and "Start Frontend Dev"

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555 (run `npm run db:studio` in backend)

## 📁 Project Structure

```
├── src/                    # Frontend (Next.js)
│   ├── app/               # App router pages
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API client
│   └── types/            # TypeScript type definitions
├── backend/              # Backend (Express + Prisma)
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API route definitions
│   │   ├── services/     # Business logic
│   │   └── types/        # Backend type definitions
│   └── prisma/           # Database schema and migrations
└── public/               # Static assets
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🔐 Authentication Flow

1. **Registration**: Users sign up with email/password
2. **Login**: JWT token issued and stored in HTTP-only cookie
3. **Protected Routes**: Frontend routes protected by authentication context
4. **API Authorization**: Backend endpoints secured with JWT middleware

## 💳 Stripe Integration

The application includes complete Stripe integration:

- **Subscription Plans**: Free, Basic, Pro, Enterprise
- **Payment Processing**: Secure checkout sessions
- **Webhook Handling**: Real-time subscription updates
- **Usage Tracking**: Monitor API usage and limits
- **Billing Management**: Upgrade, downgrade, cancel subscriptions

## 📊 Features Overview

### Dashboard
- User analytics and usage statistics
- Subscription status and billing information
- API key management

### Authentication
- Secure JWT-based authentication
- Protected routes and API endpoints
- User registration and login

### Billing
- Subscription plan comparison
- Stripe checkout integration
- Usage tracking and limits
- Billing history

### Settings
- Profile management
- Password changes
- API key generation and management

## 🚀 Deployment

### Database
1. Set up PostgreSQL database (Railway, Supabase, etc.)
2. Update `DATABASE_URL` in production environment

### Backend
1. Deploy to Vercel, Railway, or similar platform
2. Set environment variables
3. Run database migrations in production

### Frontend
1. Deploy to Vercel (recommended for Next.js)
2. Set production environment variables
3. Configure custom domain if needed

## 🛠️ Development Tips

- Use VS Code tasks for quick development server management
- Prisma Studio for easy database management
- Environment variables are required for full functionality
- Stripe webhooks need HTTPS in production

## 📝 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/aigate
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.eScript SaaS starter with Next.js frontend, Express backend, PostgreSQL database, and Stripe payments.

## 🚀 Features

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Express.js with TypeScript and Prisma ORM
- **Database**: PostgreSQL with Prisma migrations
- **Authentication**: JWT with HTTP-only cookies and protected routes
- **Payments**: Complete Stripe integration for subscriptions
- **UI**: Modern, responsive dashboard with shadcn/ui components
- **Analytics**: User activity tracking and analytics
- **Subscription Management**: Plan upgrades, downgrades, and cancellation
- **Profile Management**: User settings and API key management

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Stripe account for payments
- Git for version control

## 🛠️ Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/colorpulse6/ai-gate.git
cd ai-gate

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Environment Configuration

**Frontend Environment (`.env.local`):**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
# ... other variables
```

**Backend Environment (`backend/.env`):**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your values:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/aigate_dev
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_your_key
# ... other variables
```

3. **Database Setup:**

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. **Start Development:**

```bash
# Terminal 1: Start backend (from backend folder)
npm run dev

# Terminal 2: Start frontend (from root folder)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
