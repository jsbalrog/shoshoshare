import { Link, useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { CalendarCard } from "../components/calendar/CalendarCard";
import { LegendCard } from "../components/calendar/LegendCard";
import { CalendarDayDetailsCard } from "../components/calendar/CalendarDayDetailsCard";

export const meta = () => {
  return [
    { title: "ShoshoShare - Schedule Posts" },
    { name: "description", content: "Schedule and manage your social media posts" },
  ];
};

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

// Test data - can be removed once real data is implemented
const getTestPosts = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Create time objects for today's post
  const todayTime = new Date(today);
  todayTime.setHours(14, 0, 0, 0); // 2:00 PM

  return [
    { 
      id: 101, 
      title: "Behind the scenes at our office", 
      content: "Take a peek into our daily operations and team culture! #OfficeLife #CompanyCulture",
      platform: "Instagram",
      draft_date: new Date(yesterday.getTime() - 86400000), // 1 day before
      scheduled_date: yesterday,
      scheduled_time: new Date(yesterday.setHours(9, 0, 0, 0)), // 9:00 AM
      status: "published" // Since it's in the past
    },
    { 
      id: 102, 
      title: "New feature announcement coming soon!", 
      content: "We're excited to announce a major update to our platform. Stay tuned! 🚀 #ProductUpdate",
      platform: "Twitter",
      draft_date: new Date(today.getTime() - 3600000), // 1 hour before
      scheduled_date: today,
      scheduled_time: todayTime, // 2:00 PM
      status: "scheduled" // Future time today
    },
    {
      id: 103,
      title: "What's new in the latest version of our app",
      content: "Check out the latest updates and improvements to our app! #AppUpdate #ProductAnnouncement",
      platform: "Facebook",
      draft_date: new Date(today.getTime() + 3600000), // 1 hour after
      scheduled_date: tomorrow,
      scheduled_time: null,
      status: "draft" // Future time today
    }
  ];
};

export default function Schedule() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const posts = getTestPosts();

  // Get posts for a specific date
  const getPostsForDate = (dayNumber) => {
    if (!dayNumber) return [];
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    return posts.filter(post => {
      const postDate = new Date(post.scheduled_date);
      return postDate.getDate() === date.getDate() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getFullYear() === date.getFullYear();
    });
  };

  // Handle date selection
  const handleDateClick = (dayNumber) => {
    if (!dayNumber) return;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    setSelectedDate(date);
    // Navigate to create post with the selected date
    navigate(`/create?date=${date.toISOString()}`);
  };

  // Handle post selection
  const handlePostClick = (post, dayNumber) => {
    // Show post details
    let date;
    if (post.scheduled_date) {
      date = new Date(post.scheduled_date);
    } else {
      // For draft posts, use the calendar day date
      date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    }
    setSelectedDate(date);
    setCurrentDate(date);
  };

  // Handle month navigation
  const handleMonthChange = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta));
  };

  // Handle today button click
  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Check if a day is today
  const isToday = (dayNumber) => {
    if (!dayNumber) return false;
    const today = new Date();
    return dayNumber === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  // Check if a day is selected
  const isSelected = (dayNumber) => {
    if (!dayNumber || !selectedDate) return false;
    return dayNumber === selectedDate.getDate() &&
           currentDate.getMonth() === selectedDate.getMonth() &&
           currentDate.getFullYear() === selectedDate.getFullYear();
  };

  // Format month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };

  // Filter posts based on status
  const filteredPosts = posts.filter(post => {
    if (filterStatus === "all") return true;
    return post.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Plan and manage your social media content
              </p>
            </div>
            <Link to="/create">
              <Button>Create Post</Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <CalendarCard
              currentDate={currentDate}
              onDateClick={handleDateClick}
              onMonthChange={handleMonthChange}
              onTodayClick={handleTodayClick}
              getPostsForDate={getPostsForDate}
              isToday={isToday}
              isSelected={isSelected}
              formatMonthYear={formatMonthYear}
              onPostClick={handlePostClick}
            />
          </motion.div>
          {selectedDate && (
            <motion.div variants={itemVariants}>
              <CalendarDayDetailsCard
                selectedDate={selectedDate}
                posts={filteredPosts.filter(post => {
                  const postDate = new Date(post.scheduled_date);
                  return postDate.getDate() === selectedDate.getDate() &&
                         postDate.getMonth() === selectedDate.getMonth() &&
                         postDate.getFullYear() === selectedDate.getFullYear();
                })}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                onCreatePost={() => navigate(`/create?date=${selectedDate.toISOString()}`)}
                onPostClick={handlePostClick}
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <LegendCard />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 