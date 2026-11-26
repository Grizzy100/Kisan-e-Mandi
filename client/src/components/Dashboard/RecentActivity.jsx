const bgColors = ["bg-green-100", "bg-blue-100", "bg-purple-100", "bg-orange-100", "bg-pink-100"];
const textColors = ["text-green-700", "text-blue-700", "text-purple-700", "text-orange-700", "text-pink-700"];

const formatRelativeTime = (dateValue) => {
  if (!dateValue) return "Just now";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return "Just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export function RecentActivity({ activities, loading }) {
  const items = activities && activities.length > 0 ? activities : [];

  return (
    <div className="bg-white rounded-sm border border-gray-100 p-6 shadow-sm flex flex-col font-inter h-full">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Recent Activity</h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Latest community updates</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
          Syncing...
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
          No activity
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((activity, index) => {
            const title = activity.user || activity.name || "Unknown";
            const initials = title
              .split(" ")
              .filter(Boolean)
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "U";
            
            const bg = bgColors[index % bgColors.length];
            const text = textColors[index % textColors.length];

            return (
              <div key={activity._id || index} className="flex items-center gap-4 group transition-all">
                <div className="relative shrink-0">
                  {activity.avatar ? (
                    <img src={activity.avatar} alt={title} className="w-10 h-10 rounded-sm object-cover border border-gray-50 shadow-sm" />
                  ) : (
                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${bg} border border-white/50 shadow-sm`}>
                      <span className={`text-xs font-black ${text}`}>{initials}</span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border border-gray-50 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">{title}</p>
                  <p className="text-[11px] text-gray-500 truncate font-medium leading-tight">{activity.action || activity.description || ""}</p>
                </div>
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-tighter whitespace-nowrap">
                  {activity.time || formatRelativeTime(activity.date)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
