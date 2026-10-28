"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  isLoading?: boolean;
}

export default function StatCard({ label, value, icon: Icon, isLoading }: StatCardProps) {
  return (
    <div className="bg-[#EAEFF5] rounded-2xl p-5 sm:p-6 flex items-start justify-between shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        {isLoading ? (
          <div className="h-9 w-20 bg-slate-300/80 rounded-lg animate-pulse my-0.5" />
        ) : (
          <p className="text-3xl font-semibold text-text-primary">{value}</p>
        )}
      </div>
      <div className="text-text-primary p-1">
        <Icon className="w-5 h-5 stroke-[2.5]" />
      </div>
    </div>
  );
}
