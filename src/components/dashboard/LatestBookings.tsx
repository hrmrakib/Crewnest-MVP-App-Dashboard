"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface BookingRow {
  id: number | string;
  user: string;
  tag: string;
  listing: string;
  amount: string;
  status: string;
}

const MOCK_BOOKINGS: BookingRow[] = [
  { id: 1, user: "Olivia Rhye", tag: "#12345", listing: "Oceans view pathouse", amount: "$1200", status: "Success" },
  { id: 2, user: "Elias Vance", tag: "#12346", listing: "The Aviator Suite", amount: "$900", status: "Pending" },
  { id: 3, user: "Marcus O'Neil", tag: "#12347", listing: "City Loft", amount: "$650", status: "Success" },
  { id: 4, user: "Sarah Chen", tag: "#12348", listing: "Mountain Retreat", amount: "$1450", status: "Success" },
  { id: 5, user: "James Wilson", tag: "#12349", listing: "Harbor View", amount: "$820", status: "Pending" },
];

interface LatestBookingsProps {
  bookingsData?: string;
}

export default function LatestBookings({ bookingsData }: LatestBookingsProps) {
  const bookings: BookingRow[] = useMemo(() => {
    if (!bookingsData) return MOCK_BOOKINGS;
    try {
      const parsed = JSON.parse(bookingsData);
      const arr = Array.isArray(parsed) ? parsed : parsed?.results ?? parsed?.bookings ?? [];
      if (arr.length === 0) return MOCK_BOOKINGS;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return arr.map((b: any) => ({
        id: b.id,
        user: b.renter?.full_name ?? b.renter?.email ?? b.renter_name ?? "Unknown",
        tag: `#${b.id}`,
        listing: b.listing_title ?? b.listing ?? "—",
        amount: b.total_amount ? `$${b.total_amount}` : "—",
        status:
          b.status === "confirmed" || b.status === "completed"
            ? "Success"
            : b.status === "cancelled"
            ? "Cancelled"
            : "Pending",
      }));
    } catch { return MOCK_BOOKINGS; }
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
              {bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        <img src={`https://i.pravatar.cc/150?u=${booking.id}`} alt={booking.user} className="w-full h-full object-cover" />
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
