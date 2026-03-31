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
        value: String(stats.activeListings || stats.activeCrops || 0),
        description: (stats.activeListings || stats.activeCrops) > 0 ? "Live in marketplace" : "No active crops",
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
        <div key={stat.title} className={`bg-white rounded-sm border border-gray-100 p-6 shadow-sm transition-all ${loading ? "animate-pulse" : ""}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</h3>
            <div className={`p-2.5 rounded-sm ${stat.bgColor} border border-white/50 shadow-sm`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{loading ? "—" : stat.value}</div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{loading ? "Loading..." : stat.description}</p>
        </div>
      ))}
    </div>
  )
}
