import { useState, useEffect, useCallback } from "react";
import { StatsCard } from "./StatsCard";
import EarningsChart from "./EarningsChart";
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
    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <div className="flex-1 bg-gray-50/30 overflow-auto py-8 px-4 font-inter">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Standardized Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Welcome back! Here's a snapshot of your marketplace performance.
          </p>
        </div>

        {/* Deals Carousel */}
        <DealsCarousel />

        {/* Stats Cards */}
        <StatsCard stats={stats} loading={loading} />

        {/* Charts and Activity */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EarningsChart />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity activities={stats?.recentActivity} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
