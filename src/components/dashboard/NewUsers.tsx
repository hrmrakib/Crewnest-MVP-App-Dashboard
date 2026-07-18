"use client";

import React from "react";

const users = [
  { id: 1, name: "Olivia Rhye", time: "Join 2 mnt ago", role: "Landlord" },
  { id: 2, name: "Olivia Rhye", time: "Join 2 mnt ago", role: "Renter" },
  { id: 3, name: "Olivia Rhye", time: "Join 2 mnt ago", role: "Landlord" },
  { id: 4, name: "Olivia Rhye", time: "Join 2 mnt ago", role: "Landlord" },
];

export default function NewUsers() {
  return (
    <div className="bg-transparent mt-8">
      <h3 className="text-xl font-semibold text-text-primary mb-4">New Users</h3>
      <div className="bg-[#EAEFF5] rounded-2xl shadow-sm overflow-hidden p-6">
        <div className="space-y-6">
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <img src={`https://i.pravatar.cc/150?u=user${user.id}`} alt={user.name} className="w-full h-full object-cover" />
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
