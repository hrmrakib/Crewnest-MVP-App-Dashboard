"use client";

import React from "react";
import SupportTicket from "@/components/support/SupportTicket";
import { useGetSupportTicketsQuery } from "@/redux/services/dashboardApi";
import type { SupportTicket as SupportTicketType } from "@/redux/types/api.types";
import { Loader2, MessageSquare } from "lucide-react";

export default function ContactSupportPage() {
  const { data: tickets, isLoading, error } = useGetSupportTicketsQuery();

  const ticketList: SupportTicketType[] = React.useMemo(() => {
    if (Array.isArray(tickets)) return tickets;
    if (Array.isArray((tickets as any)?.data)) return (tickets as any).data;
    if (Array.isArray((tickets as any)?.results)) return (tickets as any).results;
    return [];
  }, [tickets]);

  return (
    <div className="h-full animate-fade-in flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#112349] text-white flex items-center justify-center shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Contact Support</h1>
            <p className="text-xs text-text-secondary">
              {isLoading
                ? "Loading tickets..."
                : `Total: ${ticketList.length} Ticket${ticketList.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between">
          <span>
            {(error as any)?.data?.message ??
              (error as any)?.message ??
              "Failed to load support tickets. Please ensure you are authenticated."}
          </span>
          <a
            href="/login"
            className="font-medium underline ml-3 hover:text-amber-900 shrink-0"
          >
            Sign In
          </a>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#EAEFF5] rounded-3xl p-6 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-300" />
                <div className="h-4 w-32 bg-slate-300 rounded" />
              </div>
              <div className="h-4 w-40 bg-slate-300 rounded" />
              <div className="h-16 w-full bg-slate-300/60 rounded-xl" />
            </div>
          ))}
        </div>
      ) : ticketList.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20 text-text-secondary bg-[#EAEFF5] rounded-3xl border border-transparent p-8 flex flex-col items-center justify-center my-auto">
          <div className="w-16 h-16 rounded-2xl bg-white text-text-secondary flex items-center justify-center mb-4 shadow-sm">
            <MessageSquare className="w-8 h-8 opacity-40" />
          </div>
          <p className="font-semibold text-lg text-text-primary mb-1">
            No support tickets found
          </p>
          <p className="text-sm text-text-secondary max-w-sm">
            When users or landlords submit support requests, they will appear here.
          </p>
        </div>
      ) : (
        /* Support Ticket Cards */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          {ticketList.map((ticket) => (
            <SupportTicket
              key={ticket.id}
              id={ticket.id}
              issue={ticket.issue}
              status={ticket.status}
              attachment={ticket.attachment}
              createdAt={ticket.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
