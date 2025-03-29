import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarCard({
  currentDate,
  onDateClick,
  onMonthChange,
  onTodayClick,
  getPostsForDate,
  isToday,
  isSelected,
  formatMonthYear,
  onPostClick
}) {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const totalDays = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{formatMonthYear(currentDate)}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onMonthChange(-1)}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={onTodayClick}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMonthChange(1)}>
            Next
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: totalDays }).map((_, index) => {
            const dayNumber = index - firstDayOfMonth + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
            const posts = getPostsForDate(dayNumber);
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPastDate = date < today;
            
            return (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => !isPastDate && onDateClick(dayNumber)}
                onKeyDown={(e) => {
                  if (!isPastDate && (e.key === 'Enter' || e.key === ' ')) {
                    onDateClick(dayNumber);
                  }
                }}
                className={`aspect-square p-2 rounded-lg transition-all duration-200 ${
                  isCurrentMonth
                    ? isToday(dayNumber)
                      ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer"
                      : isSelected(dayNumber)
                      ? "bg-gray-100 dark:bg-gray-700 border-2 border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                      : isPastDate
                      ? "bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-75"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md cursor-pointer"
                    : "bg-gray-50 dark:bg-gray-900"
                }`}
              >
                {isCurrentMonth && (
                  <>
                    <div className={`text-sm ${
                      isToday(dayNumber)
                        ? "font-bold text-blue-600 dark:text-blue-400"
                        : isPastDate
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-900 dark:text-white"
                    }`}>
                      {dayNumber}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              onPostClick({ ...post, dayNumber });
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPostClick({ ...post, dayNumber });
                          }}
                          className="flex items-center gap-1 px-1 py-0.5 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 w-full"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              post.status === "scheduled"
                                ? "bg-blue-500"
                                : post.status === "published"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-300 break-words">
                            {post.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

CalendarCard.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
  onDateClick: PropTypes.func.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onTodayClick: PropTypes.func.isRequired,
  getPostsForDate: PropTypes.func.isRequired,
  isToday: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  formatMonthYear: PropTypes.func.isRequired,
  onPostClick: PropTypes.func.isRequired
}; 