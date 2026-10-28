"use client";

import React, { useState, useMemo } from "react";
import { X, MapPin, Calendar, Edit2, Trash2, Loader2, DollarSign, Home, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAdminUserDetailQuery } from "@/redux/services/dashboardApi";
import type { DashboardUserList, AdminUserList, UserRole } from "@/redux/types/api.types";

export interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: (DashboardUserList & Partial<AdminUserList>) | null;
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
}: UserDetailsModalProps) {
  const userId = user?.id || "";
  const { data: userDetail, isLoading } = useGetAdminUserDetailQuery(userId, {
    skip: !isOpen || !userId,
  });

  const isLandlord =
    user?.role === "landlord" ||
    userDetail?.role === "landlord" ||
    (user as any)?.role === "Landlord";

  const [activeTab, setActiveTab] = useState<string>(isLandlord ? "Listings" : "Ongoing");

  // Parse recent bookings / listings from API
  const recentBookings = useMemo(() => {
    if (!userDetail?.recent_bookings) return [];
    if (Array.isArray(userDetail.recent_bookings)) return userDetail.recent_bookings;
    if (typeof userDetail.recent_bookings === "string") {
      try {
        const parsed = JSON.parse(userDetail.recent_bookings);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [userDetail?.recent_bookings]);

  if (!isOpen || !user) return null;

  const displayName =
    userDetail?.name ||
    user.full_name ||
    (user as any).name ||
    user.email?.split("@")[0] ||
    "User";

  const displayAvatar =
    userDetail?.profile_pic ||
    user.profile_picture ||
    (user as any).profile_pic ||
    `https://i.pravatar.cc/150?u=${encodeURIComponent(user.id || user.email || "user")}`;

  const displayEmail = userDetail?.personal_email || user.email || "No email provided";
  const displayRole = (userDetail?.role || user.role || "renter").toLowerCase();
  const formattedRole = displayRole.charAt(0).toUpperCase() + displayRole.slice(1);

  const rawJoiningDate = userDetail?.joining_date || user.created_at || (user as any).joining_date;
  const formattedJoinDate = rawJoiningDate
    ? new Date(rawJoiningDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  // Parse stats
  const totalBookings = userDetail?.total_bookings ?? "0";
  const totalAmount = userDetail?.total_amount
    ? userDetail.total_amount.startsWith("$")
      ? userDetail.total_amount
      : `$${userDetail.total_amount}`
    : "$0";
  const platformFee = userDetail?.platform_fee
    ? userDetail.platform_fee.startsWith("$")
      ? userDetail.platform_fee
      : `$${userDetail.platform_fee}`
    : "$0";
  const totalListing = userDetail?.total_listing ?? "0";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in-scale">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:px-8 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">User Details</h2>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary ml-2" />}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md bg-gray-100">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">{displayName}</h3>
                <span className="inline-block bg-primary/10 text-primary font-semibold text-xs px-2.5 py-0.5 rounded-full mt-0.5 capitalize">
                  {formattedRole}
                </span>
                <div className="text-sm text-text-secondary mt-2 space-y-0.5">
                  <p>
                    <span className="text-text-muted">User ID:</span>{" "}
                    <span className="font-mono text-xs">{user.id}</span>
                  </p>
                  <p>
                    <span className="text-text-muted">Email:</span> {displayEmail}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-text-muted">Status:</span>{" "}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                        user.is_active !== false
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          user.is_active !== false ? "bg-emerald-500" : "bg-red-500"
                        )}
                      />
                      {user.is_active !== false ? "Active" : "Suspended"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="text-sm text-text-secondary md:text-right bg-[#EAEFF5] px-4 py-2 rounded-xl self-start">
              Member since {formattedJoinDate}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#EAEFF5] p-5 rounded-2xl">
              <p className="text-sm text-text-secondary font-medium mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-text-primary">{totalBookings}</p>
            </div>
            <div className="bg-[#EAEFF5] p-5 rounded-2xl">
              <p className="text-sm text-text-secondary font-medium mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-text-primary">{totalAmount}</p>
            </div>
            <div className="bg-[#EAEFF5] p-5 rounded-2xl">
              <p className="text-sm text-text-secondary font-medium mb-1">Platform Fee</p>
              <p className="text-2xl font-bold text-text-primary">{platformFee}</p>
            </div>
            {isLandlord && (
              <div className="bg-[#EAEFF5] p-5 rounded-2xl">
                <p className="text-sm text-text-secondary font-medium mb-1">Total Listings</p>
                <p className="text-2xl font-bold text-text-primary">{totalListing}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mb-6">
            <h4 className="text-lg font-semibold text-text-primary">Recent Activity</h4>
            {isLandlord ? (
              <button
                onClick={() => setActiveTab("Listings")}
                className={cn(
                  "text-sm font-semibold transition-colors px-3 py-1 rounded-full",
                  activeTab === "Listings"
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                Listings
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium">
                {["Ongoing", "Upcoming", "Completed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3.5 py-1 rounded-full transition-colors",
                      activeTab === tab
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:bg-surface-hover"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cards Grid */}
          {recentBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBookings.map((item: any, idx: number) => {
                const itemTitle = item.title || item.listing_title || `Booking #${item.id || idx + 1}`;
                const itemPrice = item.price || item.total_amount || "$99";
                const itemImg =
                  item.image ||
                  item.listing_image ||
                  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80";

                return (
                  <div
                    key={item.id || idx}
                    className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-44 bg-gray-200">
                      <img
                        src={itemImg}
                        alt={itemTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-semibold text-text-primary shadow-sm">
                        {item.status || (isLandlord ? "Active" : activeTab)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h5 className="font-semibold text-text-primary truncate">{itemTitle}</h5>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {item.location || item.city || "Available"}
                        </span>
                        <span className="text-base font-bold text-primary">{itemPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#F4F7FC] rounded-2xl border border-border/50 text-text-secondary">
              <p className="font-medium text-sm">No recent activity recorded for this user.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

