"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dataMonthly = [
  { name: "Jan", uv: 280 },
  { name: "Feb", uv: 750 },
  { name: "March", uv: 280 },
  { name: "April", uv: 750 },
  { name: "May", uv: 1100 },
  { name: "June", uv: 1000 },
  { name: "July", uv: 600 },
  { name: "Aug", uv: 280 },
  { name: "Sep", uv: 950 },
  { name: "Oct", uv: 750 },
  { name: "Nov", uv: 280 },
  { name: "Dec", uv: 750 },
];

const dataYearly = [
  { name: "2019", uv: 4000 },
  { name: "2020", uv: 3000 },
  { name: "2021", uv: 6000 },
  { name: "2022", uv: 8000 },
  { name: "2023", uv: 9500 },
];

export default function UserGrowthChart() {
  const [period, setPeriod] = useState<"Monthly" | "Yearly">("Monthly");
  const data = period === "Monthly" ? dataMonthly : dataYearly;

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
              domain={[0, 1200]}
              ticks={[200, 400, 600, 800, 1000, 1200]}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="uv" fill="#3B597B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
