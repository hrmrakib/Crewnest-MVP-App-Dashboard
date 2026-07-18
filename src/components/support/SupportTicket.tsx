"use client";

import React from "react";
import { CornerUpRight, Trash2, Clock, ArrowDown } from "lucide-react";

interface SupportTicketProps {
  id: number;
  name: string;
  email: string;
  avatar: string;
  timestamp: string;
  title: string;
  description: string;
  attachmentName?: string;
}

export default function SupportTicket({
  name,
  email,
  avatar,
  timestamp,
  title,
  description,
  attachmentName,
}: SupportTicketProps) {
  return (
    <div className="bg-[#EAEFF5] rounded-3xl p-6 shadow-sm border border-transparent hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={avatar} 
            alt={name} 
            className="w-10 h-10 rounded-full object-cover bg-white"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-[#112349] text-white text-sm font-medium px-4 py-1.5 rounded-md">
              {name}
            </span>
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="text-sm font-medium">{email}</span>
              <button className="hover:text-primary transition-colors p-1" title="Reply">
                <CornerUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <button className="text-red-400 hover:text-red-500 transition-colors p-1" title="Delete Request">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-2 text-text-secondary text-sm mb-4">
        <Clock className="w-4 h-4" />
        <span>{timestamp}</span>
      </div>

      {/* Content */}
      <div className="mb-6 space-y-2">
        <h4 className="font-bold text-text-primary text-lg">{title}</h4>
        <p className="text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>

      {/* Attachment */}
      {attachmentName && (
        <button className="inline-flex flex-col items-center justify-center bg-white border border-border px-6 py-3 rounded-2xl hover:bg-surface-hover transition-colors shadow-sm group">
          <ArrowDown className="w-5 h-5 text-text-primary group-hover:text-primary transition-colors mb-1" />
          <span className="text-xs font-medium text-text-secondary">{attachmentName}</span>
        </button>
      )}
    </div>
  );
}
