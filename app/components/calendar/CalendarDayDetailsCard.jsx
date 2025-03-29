import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "@remix-run/react";

export function CalendarDayDetailsCard({
  selectedDate,
  posts,
  filterStatus,
  onFilterChange,
  onCreatePost
}) {
  const navigate = useNavigate();
  const isPastDate = selectedDate < new Date().setHours(0, 0, 0, 0);

  const handlePostClick = (post) => {
    const isPastPost = post.scheduled_date && new Date(post.scheduled_date) < new Date();
    if (!isPastPost) {
      navigate(`/edit/${post.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Posts for {selectedDate.toLocaleDateString()}
          </CardTitle>
          {!isPastDate && (
            <Button onClick={onCreatePost}>
              Create Post
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "scheduled" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("scheduled")}
            >
              Scheduled
            </Button>
            <Button
              variant={filterStatus === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("published")}
            >
              Published
            </Button>
            <Button
              variant={filterStatus === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("draft")}
            >
              Draft
            </Button>
          </div>
          {posts.length > 0 ? (
            <div className="space-y-2">
              {posts.map((post) => {
                const isPastPost = post.scheduled_date && new Date(post.scheduled_date) < new Date();
                return (
                  <div
                    key={post.id}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (!isPastPost && (e.key === 'Enter' || e.key === ' ')) {
                        handlePostClick(post);
                      }
                    }}
                    className={`flex flex-col gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 transition-colors duration-200 ${
                      isPastPost 
                        ? "opacity-75 cursor-not-allowed" 
                        : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          post.status === "scheduled"
                            ? "bg-blue-500"
                            : post.status === "published"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {post.platform}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {post.content}
                    </p>

                    {post.scheduled_date && post.scheduled_time && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Scheduled for {new Date(post.scheduled_date).toLocaleDateString()} at {new Date(post.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                No posts scheduled for this date
              </p>
              {!isPastDate && (
                <Button onClick={onCreatePost} variant="outline">
                  Create New Post
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

CalendarDayDetailsCard.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      draft_date: PropTypes.instanceOf(Date).isRequired,
      scheduled_date: PropTypes.instanceOf(Date),
      scheduled_time: PropTypes.instanceOf(Date),
      status: PropTypes.oneOf(["draft", "scheduled", "published"]).isRequired
    })
  ).isRequired,
  filterStatus: PropTypes.oneOf(["all", "draft", "scheduled", "published"]).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onCreatePost: PropTypes.func.isRequired
}; 