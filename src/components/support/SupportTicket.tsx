"use client";

import React, { useState } from "react";
import { CornerUpRight, Clock, FileText, ExternalLink, CheckCircle, Clock3, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupportTicketStatus } from "@/redux/types/api.types";
import { useUpdateTicketStatusMutation } from "@/redux/services/dashboardApi";

interface SupportTicketProps {
  id: number;
  issue: string;
  status: SupportTicketStatus;
  attachment: string | null;
  createdAt: string;
  name?: string;
  email?: string;
  avatar?: string;
}

const statusConfig: Record<
  SupportTicketStatus,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-100 border-amber-300 text-amber-800",
    text: "text-amber-700",
    icon: Clock3,
  },
  processing: {
    label: "Processing",
    bg: "bg-blue-100 border-blue-300 text-blue-800",
    text: "text-blue-700",
    icon: AlertCircle,
  },
  resolved: {
    label: "Resolved",
    bg: "bg-emerald-100 border-emerald-300 text-emerald-800",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
};

export default function SupportTicket({
  id,
  issue,
  status,
  attachment,
  createdAt,
  name,
  email,
  avatar,
}: SupportTicketProps) {
  const [updateStatus, { isLoading: isUpdating }] = useUpdateTicketStatusMutation();
  const [currentStatus, setCurrentStatus] = useState<SupportTicketStatus>(status);

  const displayName = name || `Ticket #${id}`;
  const displayEmail = email || `support-user-${id}@crewnest.app`;
  const displayAvatar = avatar || `https://i.pravatar.cc/150?u=ticket-${id}`;

  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleStatusChange = async (newStatus: SupportTicketStatus) => {
    setCurrentStatus(newStatus);
    try {
      await updateStatus({ id, data: { status: newStatus } }).unwrap();
    } catch (err) {
      console.error("Failed to update status", err);
      setCurrentStatus(status); // rollback on error
    }
  };

  const attachmentName = attachment ? attachment.split("/").pop() || "Attachment" : null;

  return (
    <div className="bg-[#EAEFF5] rounded-3xl p-6 shadow-sm border border-transparent hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover bg-white shrink-0"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#112349] text-white text-sm font-medium px-4 py-1.5 rounded-md">
                {displayName}
              </span>
              <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                <span>{displayEmail}</span>
                <a
                  href={`mailto:${displayEmail}?subject=Regarding Support Ticket %23${id}`}
                  className="hover:text-primary transition-colors p-1"
                  title="Reply by email"
                >
                  <CornerUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Status selector badge */}
          <div className="relative">
            <select
              value={currentStatus}
              disabled={isUpdating}
              onChange={(e) => handleStatusChange(e.target.value as SupportTicketStatus)}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-all disabled:opacity-50",
                statusConfig[currentStatus]?.bg || "bg-gray-100 text-gray-800"
              )}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-text-secondary text-xs mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h4 className="font-bold text-text-primary text-base mb-1">Issue Description</h4>
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
            {issue}
          </p>
        </div>
      </div>

      {/* Attachment */}
      {attachment && (
        <div className="pt-2 border-t border-black/5 mt-2">
          <a
            href={attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-xl hover:bg-surface-hover transition-colors shadow-sm text-xs font-medium text-text-primary group"
          >
            <FileText className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="truncate max-w-[200px]">{attachmentName}</span>
            <ExternalLink className="w-3.5 h-3.5 text-text-secondary ml-1" />
          </a>
        </div>
      )}
    </div>
  );
}

