"use client";

import React from "react";
import { Users, List, Calendar, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import ComparisonChart from "@/components/dashboard/ComparisonChart";
import LatestBookings from "@/components/dashboard/LatestBookings";
import NewUsers from "@/components/dashboard/NewUsers";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Users" value="5462" icon={Users} />
        <StatCard label="Active Listing" value="985" icon={List} />
        <StatCard label="Total Bookings" value="282" icon={Calendar} />
        <StatCard label="Revenue" value="$1282" icon={TrendingUp} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[350px]">
          <UserGrowthChart />
        </div>
        <div className="lg:col-span-1 h-[350px]">
          <ComparisonChart />
        </div>
      </div>

      {/* Tables & Lists Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <LatestBookings />
        </div>
        <div className="xl:col-span-1">
          <NewUsers />
        </div>
      </div>
    </div>
  );
}
