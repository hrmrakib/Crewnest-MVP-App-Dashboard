"use client";

import React, { useMemo } from "react";
import { getMediaUrl } from "@/lib/utils";
import type { NewUserItem } from "@/redux/types/api.types";

interface UserRow {
  id: number | string;
  name: string;
  time: string;
  role: string;
  avatar?: string;
}

interface NewUsersProps {
  newUsersData?: NewUserItem[] | string | null;
  isLoading?: boolean;
}

export default function NewUsers({ newUsersData, isLoading }: NewUsersProps) {
  const users: UserRow[] = useMemo(() => {
    if (!newUsersData) return [];
    try {
      const arr: any[] = typeof newUsersData === "string"
        ? JSON.parse(newUsersData)
        : newUsersData;

      const list = Array.isArray(arr) ? arr : (arr as any)?.results ?? (arr as any)?.users ?? [];
      if (!Array.isArray(list) || list.length === 0) return [];

      return list.map((u: any) => {
        const rawDate = u.joined_date ?? u.created_at;
        const formattedDate = rawDate
          ? `Joined ${new Date(rawDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
          : "Joined recently";

        const profilePic = u.profile_pic ?? u.profile_picture;

        return {
          id: u.id,
          name: u.name ?? u.full_name ?? u.email?.split("@")[0] ?? "User",
          time: formattedDate,
          role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : "User",
          avatar: profilePic ? getMediaUrl(profilePic) : undefined,
        };
      });
    } catch {
      return [];
    }
  }, [newUsersData]);

  return (
    <div className="bg-transparent mt-8">
      <h3 className="text-xl font-semibold text-text-primary mb-4">New Users</h3>
      <div className="bg-[#EAEFF5] rounded-2xl shadow-sm overflow-hidden p-6">
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-300/70 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-slate-300/80 rounded" />
                    <div className="h-3 w-16 bg-slate-300/50 rounded" />
                  </div>
                </div>
                <div className="h-4 w-14 bg-slate-300/70 rounded-full" />
              </div>
            ))
          ) : users.length === 0 ? (
            <p className="text-center text-text-secondary py-8">No new users found.</p>
          ) : (
            users.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    <img
                      src={user.avatar || `https://i.pravatar.cc/150?u=user${user.id}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{user.name}</p>
                    <p className="text-text-muted text-xs">{user.time}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-text-secondary">
                  {user.role}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
