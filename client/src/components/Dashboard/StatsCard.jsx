import { MdTrendingUp, MdAttachMoney, MdGrass, MdLandscape } from "react-icons/md"

const stats = [
  {
    title: "Total Sales",
    value: "$12,450.89",
    description: "+15.2% from last month",
    icon: MdAttachMoney,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Active Crops",
    value: "8",
    description: "Corn, Wheat, Soybeans",
    icon: MdGrass,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Orders This Month",
    value: "23",
    description: "+12% from last month",
    icon: MdTrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Acres Planted",
    value: "150",
    description: "85% of total farmland",
    icon: MdLandscape,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

export function StatsCard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <p className="text-xs text-gray-500">{stat.description}</p>
        </div>
      ))}
    </div>
  )
}
