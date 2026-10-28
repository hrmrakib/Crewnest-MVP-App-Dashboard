"use client";

import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" aria-busy="true" aria-label="Loading dashboard metrics">
      {/* ─── Top Metrics Cards Skeleton ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#EAEFF5] rounded-2xl p-5 sm:p-6 flex items-start justify-between shadow-sm animate-pulse"
          >
            <div className="space-y-2.5 flex-1">
              <div className="h-4 w-24 bg-slate-300/70 rounded-md" />
              <div className="h-8 w-20 bg-slate-300/90 rounded-lg" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-300/60 shrink-0" />
          </div>
        ))}
      </div>

      {/* ─── Charts Section Skeleton ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Bar Chart Skeleton */}
        <div className="lg:col-span-2 h-[350px] bg-[#EAEFF5] rounded-2xl p-6 shadow-sm flex flex-col animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-5 w-32 bg-slate-300/80 rounded-md" />
            <div className="flex gap-4">
              <div className="h-4 w-16 bg-slate-300/80 rounded-md" />
              <div className="h-4 w-16 bg-slate-300/50 rounded-md" />
            </div>
          </div>
          {/* Simulated Bars */}
          <div className="flex-1 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {[35, 65, 30, 75, 95, 80, 55, 30, 85, 70, 35, 60].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-slate-300/70 rounded-t-md transition-all"
                  style={{ height: `${height}%` }}
                />
                <div className="h-3 w-6 bg-slate-300/50 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Donut Chart Skeleton */}
        <div className="lg:col-span-1 h-[350px] bg-[#EAEFF5] rounded-2xl p-6 shadow-sm flex flex-col justify-between animate-pulse">
          <div>
            <div className="h-5 w-28 bg-slate-300/80 rounded-md mb-4" />
            <div className="flex items-center gap-6 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300/80" />
                <div className="h-3 w-14 bg-slate-300/70 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300/80" />
                <div className="h-3 w-14 bg-slate-300/70 rounded-md" />
              </div>
            </div>
          </div>

          {/* Donut Center */}
          <div className="flex items-center justify-center my-auto">
            <div className="w-36 h-36 rounded-full border-[14px] border-slate-300/70 border-t-slate-300/90 flex flex-col items-center justify-center">
              <div className="h-3 w-10 bg-slate-300/50 rounded mb-1" />
              <div className="h-6 w-12 bg-slate-300/80 rounded-md" />
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-[#CBD5E1]/50">
            <div className="h-4 w-20 bg-slate-300/70 rounded-md" />
            <div className="h-4 w-20 bg-slate-300/70 rounded-md" />
          </div>
        </div>
      </div>

      {/* ─── Tables & Lists Section Skeleton ────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Latest Bookings Table Skeleton */}
        <div className="xl:col-span-2">
          <div className="h-6 w-36 bg-slate-300/80 rounded-md mb-4 animate-pulse" />
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border p-4 animate-pulse space-y-4">
            <div className="h-11 bg-[#B8C5D3]/40 rounded-xl" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-3 w-1/3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                    <div className="h-3 w-14 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-4 w-28 bg-slate-200 rounded hidden sm:block" />
                <div className="h-4 w-16 bg-slate-200 rounded" />
                <div className="h-6 w-16 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* New Users List Skeleton */}
        <div className="xl:col-span-1">
          <div className="h-6 w-28 bg-slate-300/80 rounded-md mb-4 animate-pulse" />
          <div className="bg-[#EAEFF5] rounded-2xl shadow-sm p-6 space-y-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-300/70 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-slate-300/80 rounded" />
                    <div className="h-3 w-16 bg-slate-300/50 rounded" />
                  </div>
                </div>
                <div className="h-4 w-14 bg-slate-300/70 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
