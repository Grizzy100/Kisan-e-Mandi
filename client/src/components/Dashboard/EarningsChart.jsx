import React, { useState, useEffect, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../api/axios";
import { MdTrendingUp, MdCalendarToday, MdRefresh } from "react-icons/md";

/**
 * A generic bar chart for analytics.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {string} title - The title of the chart.
 * @param {string} description - The sub-description.
 * @param {string} dataKey - The key in the data objects to plot (e.g., 'earnings' or 'spending').
 */
export default function EarningsChart({ 
  endpoint = "/analytics/earnings", 
  title = "Revenue Analytics", 
  description = "Tracking your verified financial metrics across the platform.", 
  dataKey = "earnings" 
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  const ranges = [
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "3m", label: "3 Months" },
  ];

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${endpoint}?range=${range}`);
      setData(res.data);
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range, endpoint]);

  const totalValue = useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr[dataKey] || 0), 0);
  }, [data, dataKey]);

  return (
    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden flex flex-col font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch border-b border-gray-100">
        <div className="flex-1 flex flex-col justify-center gap-1 px-6 py-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{title}</h3>
            <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded-sm border border-emerald-100 flex items-center gap-1 uppercase tracking-tighter">
              <MdTrendingUp className="w-3 h-3" />
              {range}
            </span>
          </div>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">{description}</p>
        </div>

        <div className="flex bg-gray-50/50 sm:border-l border-gray-100">
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 px-6 py-4 transition-all border-b sm:border-b-0 border-gray-100 last:border-r-0 ${
                range === r.id 
                ? "bg-white text-emerald-700 shadow-[inset_0_-2px_0_0_#10b981] border border-gray-100" 
                : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
              }`}
            >
              <span className="text-[8px] font-black uppercase tracking-widest leading-none">
                {r.label}
              </span>
              <span className={`text-lg font-black leading-none tracking-tighter mt-1 ${range === r.id ? "text-emerald-700" : "text-gray-400"}`}>
                {range === r.id ? `₹${totalValue.toLocaleString()}` : "•••"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Body */}
      <div className="p-6">
        {loading ? (
          <div className="h-[280px] w-full flex items-center justify-center bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[280px] w-full flex items-center justify-center bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
            <div className="text-center">
               <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">No Activity</h4>
            </div>
          </div>
        ) : (
          <div className="w-full min-h-[280px]" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                  tickMargin={12}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 4 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-900 border border-gray-800 p-3 rounded-sm shadow-2xl pointer-events-none">
                          <p className="text-[8px] uppercase font-black text-gray-500 tracking-widest mb-1">
                             {new Date(payload[0].payload.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}
                          </p>
                          <p className="text-lg font-black text-white tracking-tighter leading-none">
                            ₹{payload[0].value.toLocaleString()} 
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey={dataKey} 
                  fill="url(#colorValue)" 
                  radius={[2, 2, 0, 0]} 
                  barSize={range === '7d' ? 32 : range === '30d' ? 12 : 8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                Optimized Feed
            </p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="p-1.5 bg-white border border-gray-100 rounded-sm text-gray-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
        >
          <MdRefresh className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
