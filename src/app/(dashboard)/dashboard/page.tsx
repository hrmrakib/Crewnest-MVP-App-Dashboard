"use client";

import React from "react";
import { Users, List, Calendar, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import ComparisonChart from "@/components/dashboard/ComparisonChart";
import LatestBookings from "@/components/dashboard/LatestBookings";
import NewUsers from "@/components/dashboard/NewUsers";
import { useGetAdminOverviewQuery } from "@/redux/services/dashboardApi";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export default function DashboardOverviewPage() {
  const { data: overview, isLoading, isFetching } = useGetAdminOverviewQuery();

  const overviewData = React.useMemo(() => {
    if (!overview?.overview) return null;
    if (typeof overview.overview === "string") {
      try { return JSON.parse(overview.overview); } catch { return null; }
    }
    return overview.overview;
  }, [overview?.overview]);

  if (isLoading && !overview) {
    return <DashboardSkeleton />;
  }

  const totalUsers = overviewData?.total_users ?? "0";
  const activeListings = overviewData?.active_listings ?? "0";
  const totalBookings = overviewData?.total_bookings ?? "0";
  const rawRevenue = overviewData?.total_revenue ?? (overviewData as any)?.revenue;
  const revenue = rawRevenue !== undefined && rawRevenue !== null
    ? `$${Number(rawRevenue).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "$0.00";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Total Users"
          value={String(totalUsers)}
          isLoading={isFetching && !overview}
          icon={Users}
        />
        <StatCard
          label="Active Listing"
          value={String(activeListings)}
          isLoading={isFetching && !overview}
          icon={List}
        />
        <StatCard
          label="Total Bookings"
          value={String(totalBookings)}
          isLoading={isFetching && !overview}
          icon={Calendar}
        />
        <StatCard
          label="Revenue"
          value={revenue}
          isLoading={isFetching && !overview}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[350px]">
          <UserGrowthChart growthData={overview?.growth} />
        </div>
        <div className="lg:col-span-1 h-[350px]">
          <ComparisonChart rolesData={overview?.roles} />
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
