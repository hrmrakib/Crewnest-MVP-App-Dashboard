"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { RolesData } from "@/redux/types/api.types";

const COLORS = { landlord: "#112349", renter: "#F59E0B" };

interface ComparisonChartProps {
  rolesData?: RolesData | Record<string, any> | null;
  isLoading?: boolean;
}

export default function ComparisonChart({ rolesData, isLoading }: ComparisonChartProps) {
  const landlordCount = typeof rolesData?.landlord === "object"
    ? Number(rolesData.landlord?.count ?? 0)
    : (typeof rolesData?.landlord === "number" ? rolesData.landlord : 0);

  const renterCount = typeof rolesData?.renter === "object"
    ? Number(rolesData.renter?.count ?? 0)
    : (typeof rolesData?.renter === "number" ? rolesData.renter : 0);

  const hasData = Boolean(
    rolesData && (rolesData.landlord !== undefined || rolesData.renter !== undefined)
  );

  const data = useMemo(() => {
    if (hasData) {
      return [
        { name: "Landlord", value: landlordCount, color: COLORS.landlord },
        { name: "Renter", value: renterCount, color: COLORS.renter },
      ];
    }
    return [
      { name: "Landlord", value: 1, color: COLORS.landlord },
      { name: "Renter", value: 1, color: COLORS.renter },
    ];
  }, [hasData, landlordCount, renterCount]);

  const total = landlordCount + renterCount;

  const landlordPct = typeof rolesData?.landlord === "object" && rolesData.landlord?.percentage !== undefined
    ? Math.round(rolesData.landlord.percentage)
    : (total > 0 ? Math.round((landlordCount / total) * 100) : 0);

  const renterPct = typeof rolesData?.renter === "object" && rolesData.renter?.percentage !== undefined
    ? Math.round(rolesData.renter.percentage)
    : (total > 0 ? Math.round((renterCount / total) * 100) : 0);

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
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center my-auto min-h-[200px] animate-pulse">
          <div className="w-36 h-36 rounded-full border-[14px] border-slate-300/70 border-t-slate-300/90 flex flex-col items-center justify-center">
            <div className="h-3 w-10 bg-slate-300/50 rounded mb-1" />
            <div className="h-6 w-12 bg-slate-300/80 rounded-md" />
          </div>
        </div>
      ) : (
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
            <span className="text-2xl font-bold text-text-primary">{total}</span>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#CBD5E1]/50">
        <div className="text-primary font-medium text-sm">
          {landlordPct}% ({data[0].value})
        </div>
        <div className="text-accent-amber font-medium text-sm">
          {renterPct}% ({data[1].value})
        </div>
      </div>
    </div>
  );
}
