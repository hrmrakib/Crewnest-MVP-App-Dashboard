"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { GrowthData } from "@/redux/types/api.types";

const FALLBACK_MONTHLY = [
  { name: "Jan", uv: 280 }, { name: "Feb", uv: 750 }, { name: "Mar", uv: 280 },
  { name: "Apr", uv: 750 }, { name: "May", uv: 1100 }, { name: "Jun", uv: 1000 },
  { name: "Jul", uv: 600 }, { name: "Aug", uv: 280 }, { name: "Sep", uv: 950 },
  { name: "Oct", uv: 750 }, { name: "Nov", uv: 280 }, { name: "Dec", uv: 750 },
];

const FALLBACK_YEARLY = [
  { name: "2020", uv: 3000 }, { name: "2021", uv: 6000 },
  { name: "2022", uv: 8000 }, { name: "2023", uv: 9500 }, { name: "2024", uv: 11000 },
];

interface UserGrowthChartProps {
  growthData?: GrowthData | string;
  isLoading?: boolean;
}

export default function UserGrowthChart({ growthData, isLoading }: UserGrowthChartProps) {
  const [period, setPeriod] = useState<"Monthly" | "Yearly">("Monthly");

  const parsedGrowth: GrowthData | null = useMemo(() => {
    if (!growthData) return null;
    if (typeof growthData === "string") {
      try { return JSON.parse(growthData); } catch { return null; }
    }
    return growthData;
  }, [growthData]);

  const monthlyData = parsedGrowth?.monthly && parsedGrowth.monthly.length > 0
    ? parsedGrowth.monthly.map((item) => ({
        name: item.month ?? (item as any).name,
        uv: Number(item.count ?? (item as any).uv ?? 0),
      }))
    : FALLBACK_MONTHLY;

  const yearlyData = parsedGrowth?.yearly && parsedGrowth.yearly.length > 0
    ? parsedGrowth.yearly.map((item) => ({
        name: item.year ?? (item as any).name,
        uv: Number(item.count ?? (item as any).uv ?? 0),
      }))
    : FALLBACK_YEARLY;

  const data = period === "Monthly" ? monthlyData : yearlyData;

  return (
    <div className="bg-[#EAEFF5] rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">User Growth</h3>
        <div className="flex gap-4 text-sm font-medium">
          <button
            className={`pb-1 border-b-2 transition-colors ${
              period === "Monthly"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
            onClick={() => setPeriod("Monthly")}
          >
            Monthly
          </button>
          <button
            className={`pb-1 border-b-2 transition-colors ${
              period === "Yearly"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
            onClick={() => setPeriod("Yearly")}
          >
            Yearly
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-end justify-between gap-3 pt-6 pb-2 px-2 animate-pulse min-h-[250px]">
          {[35, 65, 30, 75, 95, 80, 55, 30, 85, 70, 35, 60].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                className="w-full bg-slate-300/70 rounded-t-md"
                style={{ height: `${height}%` }}
              />
              <div className="h-3 w-6 bg-slate-300/50 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B' }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B' }}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="uv" fill="#3B597B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
