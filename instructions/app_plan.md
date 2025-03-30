[# Product Requirements Document (PRD)

  

## Product: AI-Powered Social Media Scheduler SaaS

**Solo Developer Project (React/Remix/Node)**

**Deployment Platform:** Fly.io

**Deployment Automation:** GitHub Actions

**Stack:** Remix, Prisma, Tailwind, SQLite

---

## 1. Introduction

**Objective:**

Build a SaaS platform enabling small-to-medium businesses and solo entrepreneurs to effortlessly generate, schedule, automate, and analyze their social media content using AI.

  

**Target Audience:**

- Local businesses (Restaurants, Salons, Gyms, Realtors, etc.)

- Small Marketing Agencies

  

---

  

## 2. Product Scope

### Core Features:

- AI-powered Post Creation: AI-driven content suggestions based on business type, seasonality, and trending topics.

- Content Scheduler: Calendar interface for scheduling posts.

- Live Post Preview: Real-time preview of scheduled posts.

- Analytics Dashboard: Visualize post performance and engagement metrics.

- User Authentication & Billing: Secure user authentication and subscription management.

  

---


## 3. Technical Components

### Frontend (React/Remix/Tailwind):

- Remix for React server-side rendering and routing.

- Tailwind CSS for styling.

- Framer Motion animations.

  

### Backend (Remix):

- Remix actions/loaders.

- Authentication (Remix Auth + sessions).

- Prisma ORM.

- SQLite database using LiteFS.
  

### AI Integration:

- OpenAI's GPT models.

  

### Deployment (Fly.io):

- Fly.io hosting.

- SQLite on Fly.io (LiteFS).

  

---

  

## 4. Application Structure & Components

- Sidebar Navigation (Dashboard, Create Post, Schedule, Analytics, Settings)

- Dashboard (Overview, Recent Posts, Top Performing Posts)

- Post Creation (AI content generator, image upload)

- Scheduler (Calendar view, drag-and-drop)

- Analytics (Engagement metrics, post performance)

- Settings (Account, Billing, Notifications)

  

---

  

## 5. Database Schema (SQLite via Prisma)

- User Model (name, email, password, subscription status)

- Post Model (content, image, scheduled_at, status)

- Engagement Model (post_id, likes, comments, shares, views)

- Subscription Model (user_id, plan, active_until)

---

  

## 6. AI Integration Workflow

- OpenAI GPT API integration

- AI moderation (OpenAI Moderation API)

- Image generation (DALL-E API)

- Content generation (GPT-4o)
  

---

  

## 7. Deployment Pipeline

- Single branch ("master") to production via GitHub Actions.

- No lower environments.

  

---

  

## 8. Monitoring & Logging

- Fly.io monitoring.

- Optional Sentry.

  

---

  

## 9. Development Steps

1. **Initial Project Structure

  a. Set up Remix project.

  b. Set up Tailwind CSS.

  c. Set up basic routing (Dashboard, Scheduler, Analytics, Create Post, Settings).

  d. Configure Framer Motion for animations.

  e. Implement Shadcn UI components for charts and tables on the Analytics page.

  f. Create repository on GitHub and push initial project structure.

2. **CI/CD Setup (GitHub Actions & Fly.io)**

  a. Configure GitHub Actions workflow for automated deployment to Fly.io.

  b. Set Fly.io secrets and environment variables.

  c. Test deployment pipeline by pushing initial commits.
  

3. **Prisma and Database Setup**

  a. Install Prisma ORM and initialize schema. Verify schema design and models before proceeding.

  b. Connect SQLite database hosted on Fly.io with LiteFS.

  c. Create initial migrations for User, Post, Engagement, Subscription models.

  d. Test database connectivity and CRUD operations.
  

4. **Develop MVP Features**

  a. Implement user authentication with Remix Auth and secure sessions.

  b. Integrate OpenAI API for generating content and image generation.

  c. Build out more details of Post Creation page (AI content generator, image upload).

  d. Test AI content generation and image generation.

  d. Implement Scheduler with calendar view.

  e. Develop Analytics Dashboard (engagement metrics visualization).


1. **Launch and Iterate**

  a. Deploy MVP to production on Fly.io.

  b. Gather user feedback through direct engagement and analytics.

  c. Prioritize features/improvements based on feedback.

  d. Regularly deploy incremental updates.
