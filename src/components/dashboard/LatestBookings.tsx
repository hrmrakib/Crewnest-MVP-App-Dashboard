"use client";

import React, { useMemo } from "react";
import { cn, getMediaUrl } from "@/lib/utils";
import type { LatestBookingItem } from "@/redux/types/api.types";

interface BookingRow {
  id: number | string;
  user: string;
  avatar?: string;
  tag: string;
  listing: string;
  amount: string;
  status: string;
}

interface LatestBookingsProps {
  bookingsData?: LatestBookingItem[] | string | null;
  isLoading?: boolean;
}

export default function LatestBookings({ bookingsData, isLoading }: LatestBookingsProps) {
  const bookings: BookingRow[] = useMemo(() => {
    if (!bookingsData) return [];
    try {
      const arr: any[] = typeof bookingsData === "string"
        ? JSON.parse(bookingsData)
        : bookingsData;

      const list = Array.isArray(arr) ? arr : (arr as any)?.results ?? (arr as any)?.bookings ?? [];
      if (!Array.isArray(list) || list.length === 0) return [];

      return list.map((b: any) => {
        const userName = typeof b.user === "object"
          ? b.user?.name ?? b.user?.full_name ?? "User"
          : b.renter?.full_name ?? b.renter?.email ?? b.renter_name ?? b.user ?? "Unknown";

        const profilePic = typeof b.user === "object"
          ? b.user?.profile_pic
          : b.profile_pic;

        const rawAmount = b.amount ?? b.total_amount;
        const formattedAmount = rawAmount !== undefined && rawAmount !== null
          ? (typeof rawAmount === "string" && rawAmount.startsWith("$") ? rawAmount : `$${rawAmount}`)
          : "—";

        const statusLabel =
          b.status === "confirmed" || b.status === "completed"
            ? "Success"
            : b.status === "cancelled"
            ? "Cancelled"
            : "Pending";

        return {
          id: b.id,
          user: userName,
          avatar: profilePic ? getMediaUrl(profilePic) : undefined,
          tag: `#${b.id}`,
          listing: b.listing_title ?? b.listing ?? "—",
          amount: formattedAmount,
          status: statusLabel,
        };
      });
    } catch {
      return [];
    }
  }, [bookingsData]);

  return (
    <div className="bg-transparent mt-8">
      <h3 className="text-xl font-semibold text-text-primary mb-4">Latest Bookings</h3>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-sm font-medium text-text-secondary bg-[#B8C5D3]/50">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Users</th>
                <th className="px-6 py-4">Listing</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 rounded-tr-2xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-4 w-24 bg-slate-200 rounded" />
                          <div className="h-3 w-14 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-200 rounded-full" /></td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-secondary">
                    No recent bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking, index) => (
                  <tr key={index} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                          <img
                            src={booking.avatar || `https://i.pravatar.cc/150?u=${booking.id}`}
                            alt={booking.user}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{booking.user}</p>
                          <p className="text-text-muted text-xs">{booking.tag}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{booking.listing}</td>
                    <td className="px-6 py-4 font-medium text-text-primary">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          booking.status === "Success"
                            ? "text-accent-green"
                            : booking.status === "Cancelled"
                            ? "text-red-500"
                            : "text-accent-amber"
                        )}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
