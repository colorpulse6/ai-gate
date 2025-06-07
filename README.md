# AI Gate - SaaS Starter

A full-stack TypeScript SaaS starter with Next.js frontend and Express backend.

## Features

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Express.js with TypeScript and Prisma ORM
- **Database**: PostgreSQL with Prisma
- **Authentication**: JWT with HTTP-only cookies
- **Payments**: Stripe integration for subscriptions
- **UI**: Modern, responsive design with shadcn/ui components
- **Real-time**: Analytics and subscription management

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (for payments)

### Setup

1. **Clone and install dependencies:**

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

2. **Environment Setup:**

```bash
# Frontend (.env.local)
cp .env.local.example .env.local

# Backend (backend/.env)
cp backend/.env.example backend/.env
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
