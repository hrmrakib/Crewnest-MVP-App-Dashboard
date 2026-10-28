"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Trash2, Loader2, RotateCw } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAdminNotificationsQuery,
  useDeleteAdminNotificationMutation,
  useClearAllAdminNotificationsMutation,
} from "@/redux/services/dashboardApi";

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

export default function TopHeader({ onOpenMobileMenu }: TopHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  // Notifications API
  const {
    data: notifications,
    isLoading: loadingNotifs,
    isFetching: fetchingNotifs,
    refetch: refetchNotifs,
  } = useGetAdminNotificationsQuery(undefined, {
    pollingInterval: 60000, // Poll every 60s
  });
  const [deleteNotif] = useDeleteAdminNotificationMutation();
  const [clearAllNotifs, { isLoading: isClearing }] = useClearAllAdminNotificationsMutation();

  const notifList = React.useMemo(() => {
    if (Array.isArray(notifications)) return notifications;
    if (Array.isArray((notifications as any)?.results)) return (notifications as any).results;
    return [];
  }, [notifications]);
  const hasUnread = notifList.length > 0;

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Admin";
  const displayAvatar =
    user?.profile_picture ||
    `https://i.pravatar.cc/150?u=${encodeURIComponent(user?.email || "admin")}`;

  // Dynamic titles based on pathname
  let title = "Platform Overviews";
  let subtitle = "Real-time performance metrics and system health.";

  if (pathname === "/users") {
    title = "User Management";
    subtitle = "View, manage, and monitor all registered platform users.";
  } else if (pathname === "/faq") {
    title = "FAQ Management";
    subtitle = "Manage frequently asked questions for Renters and Landlords.";
  } else if (pathname === "/policy") {
    title = "Legal & Policies";
    subtitle = "Edit About Us, Privacy Policy, and Terms & Conditions.";
  } else if (pathname === "/support") {
    title = "Contact Support";
    subtitle = "View and manage incoming user support requests.";
  }

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteNotif = async (id: number) => {
    try {
      await deleteNotif(id).unwrap();
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifs().unwrap();
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  return (
    <header className="flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-4 py-4 px-6 md:px-10 bg-transparent">
      {/* Left side: Title and Subtitle */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 rounded-lg bg-white shadow-sm border border-border hover:bg-surface-hover"
          onClick={onOpenMobileMenu}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
          <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center self-end lg:self-auto gap-4 md:gap-6">
        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="font-semibold text-text-primary hidden sm:block">{displayName}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
              <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-primary rounded-xl shadow-lg py-2 z-50 animate-fade-in-scale origin-top-right border border-primary-light">
              <div className="px-4 py-2 text-sm text-white border-b border-primary-light mb-1">
                <span className="text-xs text-white/70 block">Signed in as</span>
                <span className="font-semibold text-white truncate block">{displayName}</span>
                {user?.email && (
                  <span className="text-xs text-white/70 block truncate">{user.email}</span>
                )}
              </div>
              <div className="px-4 py-2 text-xs text-white/60">
                Role: {user?.role || "Super Admin"}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-border text-text-secondary hover:text-primary transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#112349] border border-[#1d3361] rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in-scale">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#253f76]">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  {notifList.length > 0 && (
                    <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                      {notifList.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => refetchNotifs()}
                    disabled={fetchingNotifs}
                    className="text-xs text-blue-200 hover:text-white transition-colors flex items-center gap-1"
                    title="Refresh"
                  >
                    <RotateCw
                      className={`w-3.5 h-3.5 ${fetchingNotifs ? "animate-spin" : ""}`}
                    />
                    <span>Refresh</span>
                  </button>
                  {notifList.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      disabled={isClearing}
                      className="text-xs text-red-300 hover:text-red-200 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
                {loadingNotifs ? (
                  <div className="flex items-center justify-center py-8 text-blue-200/70 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Loading notifications...</span>
                  </div>
                ) : notifList.length === 0 ? (
                  <div className="text-center py-8 text-blue-200/70 text-sm">
                    No new notifications
                  </div>
                ) : (
                  notifList.map((notif) => {
                    const formattedTime = new Date(notif.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={notif.id}
                        className="flex items-start justify-between gap-3 p-3 hover:bg-[#1a3060] rounded-xl transition-colors group border-b border-[#253f76] last:border-0"
                      >
                        <div className="flex-1 pr-2">
                          <p className="text-sm text-white font-medium mb-0.5">{notif.title}</p>
                          <p className="text-xs text-blue-200/80 mb-1 leading-snug">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-blue-200/60">{formattedTime}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteNotif(notif.id)}
                          className="text-blue-200/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

