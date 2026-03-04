import { useState, useEffect, useCallback } from "react";
import { StatsCard } from "./StatsCard";
import { AnalyticsChart } from "./AnalyticsChart";
import { RecentActivity } from "./RecentActivity";
import { DealsCarousel } from "./DealsCarousel";
import { getDashboardStats } from "../../api/postAPI";

export function DashboardContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Poll every 30 seconds — so Pending Approval count updates when admin approves a post
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Deals Carousel */}
        <DealsCarousel />

        {/* Stats Cards — Total Posts, Pending Approval, Total Sales, Active Crops */}
        <StatsCard stats={stats} loading={loading} />

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnalyticsChart monthlyData={stats?.monthlyData} loading={loading} />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity activities={stats?.recentActivity} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
