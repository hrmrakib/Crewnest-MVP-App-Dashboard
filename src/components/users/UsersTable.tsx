"use client";

import React, { useState } from "react";
import { Search, Ban, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import UserDetailsModal from "./UserDetailsModal";

const mockUsers = [
  { id: 1, name: "Olivia Rhye", tag: "#12345", email: "Olivia123@gmail.com", role: "Renter", date: "Oct 12, 2025", status: "Active" },
  { id: 2, name: "Elias Vance", tag: "#12345", email: "elias@gmail.com", role: "Landlord", date: "Oct 12, 2025", status: "Suspend" },
  { id: 3, name: "Marcus O'Neil", tag: "#12345", email: "marcus@gmail.com", role: "Renter", date: "Oct 12, 2025", status: "Active" },
  { id: 4, name: "Sarah Chen", tag: "#12345", email: "sarah@gmail.com", role: "Renter", date: "Oct 12, 2025", status: "Active" },
  { id: 5, name: "James Wilson", tag: "#12346", email: "james@gmail.com", role: "Renter", date: "Oct 12, 2025", status: "Active" },
  { id: 6, name: "Aisha Patel", tag: "#12345", email: "aisha@gmail.com", role: "Renter", date: "Oct 12, 2025", status: "Active" },
  { id: 7, name: "David Kim", tag: "#12345", email: "david@gmail.com", role: "Renter", date: "Oct 12, 2025", status: "Active" },
];

export default function UsersTable() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Filter logic (mock)
  const filteredUsers = mockUsers.filter(user => {
    if (activeTab === "Active" && user.status !== "Active") return false;
    if (activeTab === "Suspend" && user.status !== "Suspend") return false;
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-[#EAEFF5] rounded-3xl p-6 md:p-8 flex flex-col shadow-sm min-h-[600px]">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        
        {/* Tabs */}
        <div className="flex items-center gap-6">
          {["All", "Active", "Suspend"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
                <th className="px-4 py-4 rounded-tl-2xl w-10">
                  <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                </th>
                <th className="px-4 py-4">Users</th>
                <th className="px-4 py-4">Gmail</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Joining Date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 rounded-tr-2xl text-center">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user, i) => (
                <tr key={i} className="hover:bg-white/40 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{user.name}</p>
                        <p className="text-text-muted text-xs">{user.tag}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-text-secondary">{user.email}</td>
                  <td className="px-4 py-4 text-text-secondary">{user.role}</td>
                  <td className="px-4 py-4 text-text-secondary">{user.date}</td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        user.status === "Active" ? "text-accent-green" : "text-red-500"
                      )}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3 text-text-secondary">
                      <button className="hover:text-red-500 transition-colors" title="Suspend User">
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-text-secondary hover:text-primary shadow-sm">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-medium shadow-sm">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-white font-medium transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-white font-medium transition-colors">3</button>
          <span className="text-text-secondary tracking-widest px-2">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-white font-medium transition-colors">8</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-white font-medium transition-colors">9</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-white font-medium transition-colors">10</button>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-text-secondary hover:text-primary shadow-sm">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
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
