"use client";

import React from "react";
import { cn } from "@/lib/utils";

const bookings = [
  { id: 1, user: "Olivia Rhye", tag: "#12345", listing: "Oceans view pathouse", amount: "$1200", status: "Success" },
  { id: 2, user: "Olivia Rhye", tag: "#12345", listing: "Oceans view pathouse", amount: "$1200", status: "Pending" },
  { id: 3, user: "Olivia Rhye", tag: "#12345", listing: "Oceans view pathouse", amount: "$1200", status: "Success" },
  { id: 4, user: "Olivia Rhye", tag: "#12345", listing: "Oceans view pathouse", amount: "$1200", status: "Success" },
  { id: 5, user: "Olivia Rhye", tag: "#12345", listing: "Oceans view pathouse", amount: "$1200", status: "Success" },
];

export default function LatestBookings() {
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
                        booking.status === "Success" ? "text-accent-green" : "text-accent-amber"
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
