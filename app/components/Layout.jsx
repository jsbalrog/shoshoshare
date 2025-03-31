import { Link, useLocation } from "@remix-run/react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const publicNavigation = [
  { name: "Login", href: "/login" },
  { name: "Sign up", href: "/signup" },
];

const privateNavigation = [
  { name: "Dashboard", href: "/" },
  { name: "Create Post", href: "/create" },
  { name: "Schedule", href: "/schedule" },
  { name: "Analytics", href: "/analytics" },
  { name: "Settings", href: "/settings" },
];

const sidebarVariants = {
  hidden: { x: -300 },
  visible: { x: 0 }
};

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
};

export default function Layout({ children, user }) {
  const location = useLocation();
  const navigation = user ? privateNavigation : publicNavigation;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <motion.h1 
            className="text-xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            ShoshoShare
          </motion.h1>
        </div>
        <nav className="mt-5 px-2 flex-1">
          <div className="space-y-1">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  custom={index}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}
            {user && (
              <motion.div
                custom={navigation.length}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <form action="/logout" method="post">
                  <button
                    type="submit"
                    className="w-full text-left group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </nav>

        {/* User Profile Section */}
        {user && (
          <motion.div
            className="border-t border-gray-200 dark:border-gray-700 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="pl-64"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <main>{children}</main>
      </motion.div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
}; 