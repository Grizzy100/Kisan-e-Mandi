import { StatsCard } from "./StatsCard";
import { AnalyticsChart } from "./AnalyticsChart";
import { RecentActivity } from "./RecentActivity";
import { DealsCarousel } from "./DealsCarousel";
import {FarmerPost}  from "./FarmerPost";

export function DashboardContent() {
  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Deals Carousel */}
        <DealsCarousel />

        {/* Stats Cards */}
        <StatsCard />

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnalyticsChart />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Community Posts */}
        <FarmerPost />
      </div>
    </div>
  );
}
