const bgColors = ["bg-green-100", "bg-blue-100", "bg-purple-100", "bg-orange-100", "bg-pink-100"];
const textColors = ["text-green-700", "text-blue-700", "text-purple-700", "text-orange-700", "text-pink-700"];

export function RecentActivity({ activities, loading }) {
  const items = activities && activities.length > 0 ? activities : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-500">Latest posts and community updates</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Loading activity...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">No recent activity yet</div>
      ) : (
        <div className="space-y-4">
          {items.map((activity, index) => {
            const initials = (activity.user || "U")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            const bg = bgColors[index % bgColors.length];
            const text = textColors[index % textColors.length];

            return (
              <div key={activity._id || index} className="flex items-center gap-4">
                {activity.avatar ? (
                  <img src={activity.avatar} alt={activity.user} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg}`}>
                    <span className={`text-sm font-medium ${text}`}>{initials}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.user || "Unknown"}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.action || activity.description || ""}</p>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {activity.time || ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
