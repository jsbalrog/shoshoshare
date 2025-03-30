import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function CalendarDayDetailsCard({
  selectedDate,
  posts,
  filterStatus,
  onFilterChange,
  onCreatePost,
  onPostClick
}) {
  const isPastDate = selectedDate < new Date().setHours(0, 0, 0, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardTitle>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="all">All Posts</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
            {!isPastDate && (
              <Button onClick={onCreatePost}>Create Post</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No posts for this day
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onPostClick(post)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onPostClick(post);
                    }
                  }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
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
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {post.platform}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {post.status === "SCHEDULED"
                      ? post.scheduledTime?.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : post.status === "PUBLISHED"
                      ? post.publishedTime?.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : "Draft"}
                  </div>
                </div>
              ))}
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
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["DRAFT", "SCHEDULED", "PUBLISHED"]).isRequired,
      draftDate: PropTypes.instanceOf(Date),
      draftTime: PropTypes.instanceOf(Date),
      scheduledDate: PropTypes.instanceOf(Date),
      scheduledTime: PropTypes.instanceOf(Date),
      publishedDate: PropTypes.instanceOf(Date),
      publishedTime: PropTypes.instanceOf(Date),
      createdAt: PropTypes.instanceOf(Date).isRequired,
      updatedAt: PropTypes.instanceOf(Date).isRequired,
      userId: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      engagements: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          postId: PropTypes.string.isRequired,
          likes: PropTypes.number.isRequired,
          comments: PropTypes.number.isRequired,
          shares: PropTypes.number.isRequired,
          views: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  filterStatus: PropTypes.oneOf(["all", "draft", "scheduled", "published"]).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onCreatePost: PropTypes.func.isRequired,
  onPostClick: PropTypes.func.isRequired,
}; 