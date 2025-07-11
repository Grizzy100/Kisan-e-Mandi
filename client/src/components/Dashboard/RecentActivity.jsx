const activities = [
  {
    user: "Green Valley Co-op",
    amount: "+$2,450.00",
    initials: "GV",
    product: "Organic Corn - 500 bushels",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    user: "Farm Fresh Markets",
    amount: "+$1,200.00",
    initials: "FF",
    product: "Soybeans - 200 bushels",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    user: "Local Grocery Chain",
    amount: "+$850.00",
    initials: "LG",
    product: "Fresh Vegetables",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    user: "Organic Foods Inc",
    amount: "+$3,100.00",
    initials: "OF",
    product: "Organic Wheat - 300 bushels",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  {
    user: "Regional Distributor",
    amount: "+$1,850.00",
    initials: "RD",
    product: "Mixed Grain - 250 bushels",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
]

export function RecentActivity() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
        <p className="text-sm text-gray-500">Your latest crop sales and orders.</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor}`}>
              <span className={`text-sm font-medium ${activity.textColor}`}>{activity.initials}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.user}</p>
              <p className="text-sm text-gray-500">{activity.product}</p>
            </div>
            <div className="text-sm font-medium text-gray-900">{activity.amount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
