import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { requireUserId } from "../services/auth.server";
import { db } from "../lib/db.server";
import { useLoaderData } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "ShoshoShare - Dashboard" },
    { name: "description", content: "Your social media management dashboard" },
  ];
};

export async function loader({ request }) {
  const userId = await requireUserId(request);
  
  // Get all posts for the user
  const posts = await db.post.findMany({
    where: { userId },
    include: {
      engagements: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Calculate statistics
  const totalPosts = posts.length;
  const scheduledPosts = posts.filter(post => post.status === "SCHEDULED").length;
  const publishedPosts = posts.filter(post => post.status === "PUBLISHED").length;
  const draftPosts = posts.filter(post => post.status === "DRAFT").length;

  // Get recent posts (last 5)
  const recentPosts = posts.slice(0, 5);

  return { 
    totalPosts,
    scheduledPosts,
    publishedPosts,
    draftPosts,
    recentPosts
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Dashboard() {
  const { totalPosts, scheduledPosts, publishedPosts, draftPosts, recentPosts } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
          suppressHydrationWarning
        >
          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Posts</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{totalPosts}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Scheduled Posts</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{scheduledPosts}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Published Posts</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{publishedPosts}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Draft Posts</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">{draftPosts}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Posts */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Posts</h3>
              <div className="mt-5">
                {recentPosts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No posts yet. Create your first post!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              post.status === "SCHEDULED"
                                ? "bg-blue-500"
                                : post.status === "PUBLISHED"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {post.platform} • {post.status.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {post.status === "SCHEDULED"
                            ? post.scheduledDate?.toLocaleDateString()
                            : post.status === "PUBLISHED"
                            ? post.publishedDate?.toLocaleDateString()
                            : "Draft"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link
                  to="/create"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create New Post
                </Link>
                <Link
                  to="/schedule"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Schedule Posts
                </Link>
                <Link
                  to="/analytics"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  View Analytics
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 