import { useState } from "react";
import { Link, useNavigate, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { CalendarCard } from "../components/calendar/CalendarCard";
import { CalendarDayDetailsCard } from "../components/calendar/CalendarDayDetailsCard";
import { LegendCard } from "../components/calendar/LegendCard";
import { getUserByEmail } from "../lib/models.server";
import { db } from "../lib/db.server";

export const meta = () => {
  return [
    { title: "ShoshoShare - Schedule" },
    { name: "description", content: "Schedule your social media posts" },
  ];
};

export async function loader() {
  // Temporarily use the first user until we implement authentication
  const user = await getUserByEmail("test@example.com");
  console.log("Found user:", user);
  
  let posts = [];
  if (user) {
    // Get all posts for the user
    posts = await db.post.findMany({
      where: { userId: user.id },
      include: {
        user: true,
        engagements: true
      },
      orderBy: {
        scheduledDate: 'asc'
      }
    });
    console.log("Found posts:", posts);
  }

  return { posts };
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

export default function Schedule() {
  const navigate = useNavigate();
  const { posts: initialPosts } = useLoaderData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Get posts for a specific date
  const getPostsForDate = (dayNumber) => {
    if (!dayNumber) return [];
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    return initialPosts.filter(post => {
      const postDate = new Date(post.draftDate || post.scheduledDate || post.publishedDate);
      return postDate.getDate() === date.getDate() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getFullYear() === date.getFullYear();
    });
  };

  const handleDateClick = (dayNumber) => {
    if (!dayNumber) return;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    setSelectedDate(date);
    navigate(`/schedule?date=${date.toISOString()}`);
  };

  const handleMonthChange = (months) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + months);
    setCurrentDate(newDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handlePostClick = (post) => {
    navigate(`/edit/${post.id}`);
  };

  const handleCreatePost = () => {
    if (selectedDate) {
      navigate(`/create?date=${selectedDate.toISOString()}`);
    } else {
      navigate("/create");
    }
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const isToday = (dayNumber) => {
    const today = new Date();
    return (
      dayNumber === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (dayNumber) => {
    if (!selectedDate) return false;
    return (
      dayNumber === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

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
                posts={getPostsForDate(selectedDate.getDate())}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                onCreatePost={handleCreatePost}
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