"use client";

import React from "react";
import { Users, List, Calendar, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import ComparisonChart from "@/components/dashboard/ComparisonChart";
import LatestBookings from "@/components/dashboard/LatestBookings";
import NewUsers from "@/components/dashboard/NewUsers";
import { useGetAdminOverviewQuery } from "@/redux/services/dashboardApi";

export default function DashboardOverviewPage() {
  const { data: overview, isLoading } = useGetAdminOverviewQuery();

  // Parse JSON strings from the API
  const overviewData = React.useMemo(() => {
    if (!overview?.overview) return null;
    try { return JSON.parse(overview.overview); } catch { return null; }
  }, [overview?.overview]);

  const rolesData = React.useMemo(() => {
    if (!overview?.roles) return null;
    try { return JSON.parse(overview.roles); } catch { return null; }
  }, [overview?.roles]);

  const totalUsers = overviewData?.total_users ?? overviewData?.users ?? "—";
  const activeListings = overviewData?.active_listings ?? overviewData?.listings ?? "—";
  const totalBookings = overviewData?.total_bookings ?? overviewData?.bookings ?? "—";
  const revenue = overviewData?.revenue ?? overviewData?.total_revenue ?? "—";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Total Users"
          value={isLoading ? "..." : totalUsers}
          icon={Users}
        />
        <StatCard
          label="Active Listing"
          value={isLoading ? "..." : activeListings}
          icon={List}
        />
        <StatCard
          label="Total Bookings"
          value={isLoading ? "..." : totalBookings}
          icon={Calendar}
        />
        <StatCard
          label="Revenue"
          value={isLoading ? "..." : (revenue !== "—" ? `$${revenue}` : "—")}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[350px]">
          <UserGrowthChart growthData={overview?.growth} />
        </div>
        <div className="lg:col-span-1 h-[350px]">
          <ComparisonChart rolesData={rolesData} />
        </div>
      </div>

      {/* Tables & Lists Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <LatestBookings bookingsData={overview?.latest_bookings} />
        </div>
        <div className="xl:col-span-1">
          <NewUsers newUsersData={overview?.new_users} />
        </div>
      </div>
    </div>
  );
}
