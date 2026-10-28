"use client";

import React, { useState, useCallback } from "react";
import { Search, Ban, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import UserDetailsModal from "./UserDetailsModal";
import {
  useGetDashboardUsersQuery,
  useUserActionMutation,
} from "@/redux/services/dashboardApi";
import type { DashboardUserList, UserStatus } from "@/redux/types/api.types";

const PAGE_SIZE = 10;

export default function UsersTable() {
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Suspend">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<DashboardUserList | null>(null);
  const [page, setPage] = useState(1);

  // Debounce search
  const handleSearch = useCallback((val: string) => {
    setSearchQuery(val);
    clearTimeout((window as any).__userSearchTimeout);
    (window as any).__userSearchTimeout = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  }, []);

  const statusMap: Record<"All" | "Active" | "Suspend", UserStatus | undefined> = {
    All: "all",
    Active: "active",
    Suspend: "suspend",
  };

  const { data: users, isLoading, isFetching } = useGetDashboardUsersQuery({
    search: debouncedSearch || undefined,
    status: statusMap[activeTab],
  });

  const [userAction, { isLoading: isActioning }] = useUserActionMutation();

  const handleSuspendToggle = async (user: DashboardUserList) => {
    try {
      await userAction({
        userId: user.id,
        data: { action: user.is_active ? "suspend" : "unsuspend" },
      }).unwrap();
    } catch (err) {
      console.error("Action failed", err);
    }
  };

  // Client-side pagination with safe array check
  const allUsers: DashboardUserList[] = React.useMemo(() => {
    if (Array.isArray(users)) return users;
    if (Array.isArray((users as any)?.results)) {
      return (users as any).results;
    }
    return [];
  }, [users]);

  const totalPages = Math.max(1, Math.ceil(allUsers.length / PAGE_SIZE));
  const paginatedUsers = allUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-[#EAEFF5] rounded-3xl p-6 md:p-8 flex flex-col shadow-sm min-h-[600px]">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        
        {/* Tabs */}
        <div className="flex items-center gap-6">
          {(["All", "Active", "Suspend"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={cn(
                "font-semibold text-base transition-colors",
                activeTab === tab ? "text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-secondary">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search Users" 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white border-none rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 bg-transparent overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left whitespace-nowrap min-w-[800px]">
            <thead className="text-sm font-semibold text-text-secondary bg-[#B8C5D3]/50">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Users</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Joining Date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 rounded-tr-2xl text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {(isLoading || isFetching) ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-text-secondary">
                    <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
                    Loading users...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-text-secondary">
                    {searchQuery.trim()
                      ? `No users found matching "${searchQuery}".`
                      : activeTab === "Suspend"
                      ? "No suspended users found."
                      : activeTab === "Active"
                      ? "No active users found."
                      : "No users found."}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, i) => (
                  <tr key={i} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                          <img
                            src={user.profile_picture || `https://i.pravatar.cc/150?u=${user.id}`}
                            alt={user.full_name ?? user.email}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{user.full_name ?? "—"}</p>
                          <p className="text-text-muted text-xs truncate max-w-[150px]">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-text-secondary">{user.email}</td>
                    <td className="px-4 py-4 text-text-secondary capitalize">{user.role}</td>
                    <td className="px-4 py-4 text-text-secondary">
                      {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "text-sm font-medium",
                        user.is_active ? "text-accent-green" : "text-red-500"
                      )}>
                        {user.is_active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-3 text-text-secondary">
                        <button
                          className={cn(
                            "hover:text-red-500 transition-colors",
                            isActioning && "opacity-50 pointer-events-none"
                          )}
                          title={user.is_active ? "Suspend User" : "Unsuspend User"}
                          onClick={() => handleSuspendToggle(user)}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button 
                          className="hover:text-primary transition-colors" 
                          title="View Details"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-text-secondary hover:text-primary shadow-sm disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full font-medium transition-colors",
                    page === pg ? "bg-primary text-white shadow-sm" : "text-text-secondary hover:bg-white"
                  )}
                >
                  {pg}
                </button>
              );
            })}
            
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-text-secondary hover:text-primary shadow-sm disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <UserDetailsModal 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
        user={selectedUser} 
      />
    </div>
  );
}
