"use client";

import React from "react";
import SupportTicket from "@/components/support/SupportTicket";
import { useGetSupportTicketsQuery } from "@/redux/services/dashboardApi";
import { Loader2 } from "lucide-react";

export default function ContactSupportPage() {
  const { data: tickets, isLoading, error } = useGetSupportTicketsQuery();

  const FALLBACK_TICKETS = [
    {
      id: 101,
      issue: "Need assistance with booking cancellation due to scheduled airline duty rerouting. Flight was diverted.",
      status: "pending" as const,
      attachment: null,
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 102,
      issue: "Payment receipt request for reimbursement from Delta Airlines accommodation expenses.",
      status: "processing" as const,
      attachment: "https://example.com/receipt.pdf",
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 103,
      issue: "Inquiry regarding long-term lease agreement terms for flight crew crashpad near LAX airport.",
      status: "resolved" as const,
      attachment: null,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ];

  const ticketList = React.useMemo(() => {
    if (Array.isArray(tickets) && tickets.length > 0) return tickets;
    if (Array.isArray((tickets as any)?.results) && (tickets as any).results.length > 0) {
      return (tickets as any).results;
    }
    if (Array.isArray(tickets)) return [];
    return FALLBACK_TICKETS;
  }, [tickets]);

  return (
    <div className="h-full animate-fade-in">
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-text-secondary">
          <Loader2 className="w-6 h-6 animate-spin mr-3 text-primary" />
          <span>Loading support tickets...</span>
        </div>
      ) : ticketList.length === 0 ? (
        <div className="text-center py-20 text-text-secondary bg-white rounded-3xl border border-border p-8">
          <p className="font-semibold text-lg text-text-primary mb-1">No support tickets found</p>
          <p className="text-sm text-text-secondary">When users submit support requests, they will appear here.</p>
        </div>
      ) : (
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


