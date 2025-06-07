import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
      subscription: {
        create: {
          plan: "ENTERPRISE",
          status: "ACTIVE",
        },
      },
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create test user
  const testPassword = await bcrypt.hash("test123", 12);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: testPassword,
      name: "Test User",
      role: "USER",
      subscription: {
        create: {
          plan: "FREE",
          status: "ACTIVE",
        },
      },
    },
  });

  console.log("✅ Created test user:", testUser.email);

  // Create sample analytics data
  const analyticsEvents = [
    "llm_request",
    "api_call",
    "dashboard_view",
    "subscription_view",
    "profile_update",
  ];

  for (const event of analyticsEvents) {
    for (let i = 0; i < Math.floor(Math.random() * 10) + 1; i++) {
      await prisma.analytics.create({
        data: {
          userId: testUser.id,
          event,
          metadata: {
            timestamp: new Date(),
            source: "seed",
          },
        },
      });
    }
  }

  console.log("✅ Created sample analytics data");
  console.log("🎉 Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
