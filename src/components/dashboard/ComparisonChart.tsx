"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Landlord", value: 700, color: "#112349" },
  { name: "Renter", value: 500, color: "#F59E0B" },
];

export default function ComparisonChart() {
  return (
    <div className="bg-[#EAEFF5] rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-text-primary mb-6">Comparison</h3>
      
      {/* Legend */}
      <div className="flex items-center gap-6 mb-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-text-secondary">
              {entry.name}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 relative min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "#1E293B" }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-text-secondary">Total</span>
          <span className="text-2xl font-bold text-text-primary">1200</span>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#CBD5E1]/50">
        <div className="text-primary font-medium text-sm">
          60% (700)
        </div>
        <div className="text-accent-amber font-medium text-sm">
          40% (500)
        </div>
      </div>
    </div>
  );
}
