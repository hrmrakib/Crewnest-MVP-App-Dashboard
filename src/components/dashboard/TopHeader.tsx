"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

const mockNotifications = [
  { id: 1, text: "New user registered successfully", time: "2024-03-09 - 10:30 AM" },
  { id: 2, text: "New user registered successfully", time: "2024-03-09 - 10:30 AM" },
  { id: 3, text: "New user registered successfully", time: "2024-03-09 - 10:30 AM" },
  { id: 4, text: "New user registered successfully", time: "2024-03-09 - 10:30 AM" },
  { id: 5, text: "New user registered successfully", time: "2024-03-09 - 10:30 AM" },
  { id: 6, text: "New user registered successfully", time: "2024-03-09 - 10:30 AM" },
];

export default function TopHeader({ onOpenMobileMenu }: TopHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Dynamic titles based on pathname
  let title = "Platform Overviews";
  let subtitle = "Real-time performance metrics and system health.";

  if (pathname === "/users") {
    title = "User Management";
    subtitle = "Total - 1024";
  } else if (pathname === "/faq") {
    title = "FAQ";
    subtitle = "Edit or Add New";
  } else if (pathname === "/policy") {
    title = "Legacy & Policy";
    subtitle = "Edit or Add New";
  } else if (pathname === "/support") {
    title = "Contact Support";
    subtitle = "Some support requests have come to you. Please reply to them.";
  }

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-4 py-4 px-6 md:px-10 bg-transparent">
      {/* Left side: Title and Subtitle */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 rounded-lg bg-white shadow-sm border border-border hover:bg-surface-hover"
          onClick={onOpenMobileMenu}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
          <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center self-end lg:self-auto gap-4 md:gap-6">
        
        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="font-semibold text-text-primary hidden sm:block">Aiden Max</span>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
              <img src="https://i.pravatar.cc/150?u=aiden" alt="Aiden Max" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-primary rounded-xl shadow-lg py-2 z-50 animate-fade-in-scale origin-top-right border border-primary-light">
              <div className="px-4 py-2 text-sm text-white border-b border-primary-light mb-1 flex justify-between items-center">
                <span>Name<br/><span className="font-semibold text-white/90">Aiden Max</span></span>
                <span className="text-white">✓</span>
              </div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-primary-light transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Change Profile Picture
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-primary-light transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Change Profile Name
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-primary-light transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Change Password
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-border text-text-secondary hover:text-primary transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#112349] border border-[#1d3361] rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in-scale">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#253f76]">
                <h3 className="text-white font-semibold">Notification</h3>
                <button className="text-sm text-blue-200 hover:text-white transition-colors">Refresh</button>
              </div>
              
              {/* List */}
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="flex items-start justify-between gap-3 p-3 hover:bg-[#1a3060] rounded-xl transition-colors group border-b border-[#253f76] last:border-0">
                    <div>
                      <p className="text-sm text-white font-medium mb-1">{notif.text}</p>
                      <p className="text-xs text-blue-200/70 flex items-center gap-1">
                        <span className="w-3 h-3 border border-blue-200/70 rounded-full flex items-center justify-center text-[8px]">L</span> 
                        {notif.time}
                      </p>
                    </div>
                    <button className="text-blue-200/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
