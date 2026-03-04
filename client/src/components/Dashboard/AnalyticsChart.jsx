const fallbackData = [
  { name: "Jan", total: 0 }, { name: "Feb", total: 0 }, { name: "Mar", total: 0 },
  { name: "Apr", total: 0 }, { name: "May", total: 0 }, { name: "Jun", total: 0 },
  { name: "Jul", total: 0 }, { name: "Aug", total: 0 }, { name: "Sep", total: 0 },
  { name: "Oct", total: 0 }, { name: "Nov", total: 0 }, { name: "Dec", total: 0 },
]

export function AnalyticsChart({ monthlyData, loading }) {
  const data = monthlyData && monthlyData.length > 0 ? monthlyData : fallbackData;
  const maxValue = Math.max(...data.map((item) => item.total), 1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Activity Overview</h3>
        <p className="text-sm text-gray-500">Posts and activity for the current year</p>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-gray-400">Loading chart...</div>
      ) : (
        <div className="h-80 flex items-end justify-between gap-2 px-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs text-gray-500 font-medium">
                {item.total > 0 ? item.total : ""}
              </span>
              <div
                className="w-full bg-green-600 rounded-t-md min-h-1 transition-all duration-300 hover:opacity-80"
                style={{ height: `${(item.total / maxValue) * 230}px` }}
              />
              <span className="text-xs text-gray-500">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
