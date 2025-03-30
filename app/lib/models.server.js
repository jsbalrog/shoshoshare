import { db } from "./db.server";

// User Operations
export async function createUser({ email, name, password }) {
  return db.user.create({
    data: {
      email,
      name,
      password, // Note: In production, this should be hashed
    },
  });
}

export async function getUserById(id) {
  return db.user.findUnique({
    where: { id },
    include: {
      posts: true,
      subscriptions: true,
    },
  });
}

export async function getUserByEmail(email) {
  return db.user.findUnique({
    where: { email },
    include: {
      posts: true,
      subscriptions: true
    }
  });
}

export async function updateUser(id, data) {
  return db.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id) {
  return db.user.delete({
    where: { id },
  });
}

// Post Operations
export async function createPost({ title, content, platform, userId, status = "DRAFT" }) {
  return db.post.create({
    data: {
      title,
      content,
      platform,
      status,
      userId,
      draftDate: status === "DRAFT" ? new Date() : null,
      draftTime: status === "DRAFT" ? new Date() : null,
    },
    include: {
      user: true,
    },
  });
}

export async function getPostById(id) {
  return db.post.findUnique({
    where: { id },
    include: {
      user: true,
      engagements: true,
    },
  });
}

export async function getPostsByUserId(userId) {
  return db.post.findMany({
    where: { userId },
    include: {
      engagements: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updatePost(id, data) {
  return db.post.update({
    where: { id },
    data: {
      ...data,
      // Update relevant timestamps based on status change
      publishedDate: data.status === "PUBLISHED" ? new Date() : undefined,
      publishedTime: data.status === "PUBLISHED" ? new Date() : undefined,
      scheduledDate: data.status === "SCHEDULED" ? data.scheduledDate : undefined,
      scheduledTime: data.status === "SCHEDULED" ? data.scheduledTime : undefined,
    },
    include: {
      user: true,
    },
  });
}

export async function deletePost(id) {
  return db.post.delete({
    where: { id },
  });
}

// Engagement Operations
export async function createEngagement(postId, data) {
  return db.engagement.create({
    data: {
      postId,
      ...data,
    },
  });
}

export async function getEngagementByPostId(postId) {
  return db.engagement.findUnique({
    where: { postId },
  });
}

export async function updateEngagement(postId, data) {
  return db.engagement.update({
    where: { postId },
    data,
  });
}

// Subscription Operations
export async function createSubscription({ userId, plan, activeUntil }) {
  return db.subscription.create({
    data: {
      userId,
      plan,
      activeUntil,
    },
    include: {
      user: true,
    },
  });
}

export async function getSubscriptionByUserId(userId) {
  return db.subscription.findFirst({
    where: { userId },
    include: {
      user: true,
    },
  });
}

export async function updateSubscription(userId, data) {
  return db.subscription.update({
    where: { userId },
    data,
    include: {
      user: true,
    },
  });
}

export async function deleteSubscription(userId) {
  return db.subscription.delete({
    where: { userId },
  });
}

// Utility Functions
export async function getPostsByDate(date, userId) {
  // Create dates in the same year as the database (2025)
  const startOfDay = new Date(2025, date.getMonth(), date.getDate());
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(2025, date.getMonth(), date.getDate());
  endOfDay.setHours(23, 59, 59, 999);

  console.log("Searching for posts between:", {
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString(),
    userId
  });

  const posts = await db.post.findMany({
    where: {
      userId,
      OR: [
        { draftDate: { gte: startOfDay, lte: endOfDay } },
        { scheduledDate: { gte: startOfDay, lte: endOfDay } },
        { publishedDate: { gte: startOfDay, lte: endOfDay } }
      ]
    },
    include: {
      user: true,
      engagements: true
    },
    orderBy: {
      scheduledDate: 'asc'
    }
  });

  console.log("Found posts:", posts.map(p => ({
    title: p.title,
    status: p.status,
    draftDate: p.draftDate?.toISOString(),
    scheduledDate: p.scheduledDate?.toISOString(),
    publishedDate: p.publishedDate?.toISOString()
  })));

  return posts;
}

export async function getUpcomingPosts(userId) {
  const now = new Date();
  return db.post.findMany({
    where: {
      userId,
      status: "SCHEDULED",
      scheduledDate: {
        gte: now,
      },
    },
    include: {
      engagements: true,
    },
    orderBy: {
      scheduledDate: "asc",
    },
  });
}

export async function getDraftPosts(userId) {
  return db.post.findMany({
    where: {
      userId,
      status: "DRAFT",
    },
    include: {
      engagements: true,
    },
    orderBy: {
      draftDate: "desc",
    },
  });
} 