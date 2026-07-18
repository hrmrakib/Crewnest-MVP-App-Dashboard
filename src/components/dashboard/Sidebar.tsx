"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Info,
  MessageSquare,
  Shield,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "FAQ", href: "/faq", icon: Info },
  { label: "Contact Support", href: "/support", icon: MessageSquare },
  { label: "Legacy & Policy", href: "/policy", icon: Shield },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#E5E9F4] text-text-primary">
      {/* Logo */}
      <div className="h-24 flex items-center justify-center pt-4">
        <Link href="/dashboard" className="flex flex-col items-center gap-1" onClick={onCloseMobile}>
          <div className="text-primary">
            {/* SVG Logo approximating the House with Wings */}
            <svg width="40" height="40" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 6L6 20H12V38H20V26H28V38H36V20H42L24 6Z" />
              <path d="M12 16L4 8L10 2L24 16H12Z" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center gap-4 px-8 py-3 transition-colors",
                    active
                      ? "bg-white border-l-4 border-primary text-text-primary font-medium"
                      : "text-text-secondary hover:bg-white/50 border-l-4 border-transparent"
                  )}
                >
                  <Icon className={cn("w-5 h-5", active ? "text-text-primary" : "text-text-secondary")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-8">
        <button
          className="flex items-center gap-4 text-text-secondary hover:text-text-primary transition-colors"
          onClick={() => {
            onCloseMobile();
            window.location.href = "/login";
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[240px] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Close Button */}
        <button
          className="lg:hidden absolute top-4 right-4 p-2 text-text-primary hover:bg-black/5 rounded-lg z-50"
          onClick={onCloseMobile}
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
