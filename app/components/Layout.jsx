import { Link, useLocation } from "@remix-run/react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const navigation = [
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

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg"
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
        <nav className="mt-5 px-2">
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
          </div>
        </nav>
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
  children: PropTypes.node.isRequired
}; 