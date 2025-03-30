import { PrismaClient } from "@prisma/client";
import process from "process";

const prisma = new PrismaClient();

async function seed() {
  // Clean up existing data
  await prisma.engagement.deleteMany();
  await prisma.post.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const user1 = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      password: "password123", // In production, this should be hashed
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "demo@example.com",
      name: "Demo User",
      password: "password123", // In production, this should be hashed
    },
  });

  // Create subscriptions
  await prisma.subscription.create({
    data: {
      userId: user1.id,
      plan: "PRO",
      activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  await prisma.subscription.create({
    data: {
      userId: user2.id,
      plan: "FREE",
      activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  // Create posts for user1
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Draft post
  await prisma.post.create({
    data: {
      title: "Draft Post",
      content: "This is a draft post content",
      platform: "Twitter",
      status: "DRAFT",
      userId: user1.id,
      draftDate: today,
      draftTime: today,
    },
  });

  // Scheduled post
  await prisma.post.create({
    data: {
      title: "Scheduled Post",
      content: "This is a scheduled post content",
      platform: "Facebook",
      status: "SCHEDULED",
      userId: user1.id,
      scheduledDate: tomorrow,
      scheduledTime: new Date(tomorrow.setHours(14, 0, 0, 0)), // 2 PM tomorrow
    },
  });

  // Published post
  await prisma.post.create({
    data: {
      title: "Published Post",
      content: "This is a published post content",
      platform: "Instagram",
      status: "PUBLISHED",
      userId: user1.id,
      publishedDate: yesterday,
      publishedTime: new Date(yesterday.setHours(10, 0, 0, 0)), // 10 AM yesterday
    },
  });

  // Create posts for user2
  await prisma.post.create({
    data: {
      title: "User 2 Draft",
      content: "This is user 2's draft post",
      platform: "LinkedIn",
      status: "DRAFT",
      userId: user2.id,
      draftDate: today,
      draftTime: today,
    },
  });

  // Create engagements for published post
  const publishedPost = await prisma.post.findFirst({
    where: { title: "Published Post" },
  });

  await prisma.engagement.create({
    data: {
      postId: publishedPost.id,
      likes: 42,
      comments: 7,
      shares: 3,
      views: 156,
    },
  });

  console.log("Seed data created successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 