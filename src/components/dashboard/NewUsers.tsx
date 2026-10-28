"use client";

import React, { useMemo } from "react";

interface UserRow { id: number | string; name: string; time: string; role: string; avatar?: string; }

const MOCK_USERS: UserRow[] = [
  { id: 1, name: "Olivia Rhye", time: "Joined recently", role: "Landlord" },
  { id: 2, name: "Elias Vance", time: "Joined recently", role: "Renter" },
  { id: 3, name: "Sarah Chen", time: "Joined recently", role: "Landlord" },
  { id: 4, name: "Marcus O'Neil", time: "Joined recently", role: "Renter" },
];

interface NewUsersProps {
  newUsersData?: string;
}

export default function NewUsers({ newUsersData }: NewUsersProps) {
  const users: UserRow[] = useMemo(() => {
    if (!newUsersData) return MOCK_USERS;
    try {
      const parsed = JSON.parse(newUsersData);
      const arr = Array.isArray(parsed) ? parsed : parsed?.results ?? parsed?.users ?? [];
      if (arr.length === 0) return MOCK_USERS;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return arr.map((u: any) => ({
        id: u.id,
        name: u.full_name ?? u.name ?? u.email?.split("@")[0] ?? "User",
        time: u.created_at ? `Joined ${new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Joined recently",
        role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : "User",
        avatar: u.profile_picture ?? undefined,
      }));
    } catch { return MOCK_USERS; }
  }, [newUsersData]);

  return (
    <div className="bg-transparent mt-8">
      <h3 className="text-xl font-semibold text-text-primary mb-4">New Users</h3>
      <div className="bg-[#EAEFF5] rounded-2xl shadow-sm overflow-hidden p-6">
        <div className="space-y-6">
          {users.map((user, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
