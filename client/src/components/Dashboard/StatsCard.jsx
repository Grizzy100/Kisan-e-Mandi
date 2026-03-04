import { MdTrendingUp, MdAttachMoney, MdGrass, MdLandscape } from "react-icons/md"

const defaultStats = [
  { title: "Total Sales", value: "₹0", description: "No sales data yet", icon: MdAttachMoney, color: "text-green-600", bgColor: "bg-green-100" },
  { title: "Active Crops", value: "0", description: "No crops listed", icon: MdGrass, color: "text-blue-600", bgColor: "bg-blue-100" },
  { title: "Total Posts", value: "0", description: "No posts yet", icon: MdTrendingUp, color: "text-purple-600", bgColor: "bg-purple-100" },
  { title: "Pending Approval", value: "0", description: "All clear", icon: MdLandscape, color: "text-orange-600", bgColor: "bg-orange-100" },
]

export function StatsCard({ stats, loading }) {
  const cards = stats
    ? [
        {
          title: "Total Sales",
          value: `₹${(stats.totalSales || 0).toLocaleString("en-IN")}`,
          description: stats.totalSales > 0 ? "From approved listings" : "No sales yet",
          icon: MdAttachMoney, color: "text-green-600", bgColor: "bg-green-100",
        },
        {
          title: "Active Crops",
          value: String(stats.activeCrops || 0),
          description: stats.activeCrops > 0 ? "Currently listed" : "No active crops",
          icon: MdGrass, color: "text-blue-600", bgColor: "bg-blue-100",
        },
        {
          title: "Total Posts",
          value: String(stats.totalPosts || 0),
          description: `${stats.approvedPosts || 0} approved`,
          icon: MdTrendingUp, color: "text-purple-600", bgColor: "bg-purple-100",
        },
        {
          title: "Pending Approval",
          value: String(stats.pendingPosts || 0),
          description: stats.pendingPosts > 0 ? "Awaiting review" : "All clear",
          icon: MdLandscape, color: "text-orange-600", bgColor: "bg-orange-100",
        },
      ]
    : defaultStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <div key={stat.title} className={`bg-white rounded-lg border border-gray-200 p-6 ${loading ? "animate-pulse" : ""}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{loading ? "—" : stat.value}</div>
          <p className="text-xs text-gray-500">{loading ? "Loading..." : stat.description}</p>
        </div>
      ))}
    </div>
  )
}
