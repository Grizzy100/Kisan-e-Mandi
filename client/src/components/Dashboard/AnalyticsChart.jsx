const data = [
  { name: "Jan", total: 2400 },
  { name: "Feb", total: 1398 },
  { name: "Mar", total: 9800 },
  { name: "Apr", total: 3908 },
  { name: "May", total: 4800 },
  { name: "Jun", total: 3800 },
  { name: "Jul", total: 4300 },
  { name: "Aug", total: 2400 },
  { name: "Sep", total: 2400 },
  { name: "Oct", total: 1398 },
  { name: "Nov", total: 9800 },
  { name: "Dec", total: 3908 },
]

export function AnalyticsChart() {
  const maxValue = Math.max(...data.map((item) => item.total))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Sales Overview</h3>
        <p className="text-sm text-gray-500">Crop sales revenue for the current year</p>
      </div>

      <div className="h-80 flex items-end justify-between gap-2 px-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-full bg-green-600 rounded-t-md min-h-1 transition-all duration-300 hover:opacity-80"
              style={{
                height: `${(item.total / maxValue) * 250}px`,
              }}
            />
            <span className="text-xs text-gray-500">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
