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
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLogoutUserMutation } from "@/redux/services/authApi";
import { logout as logoutAction } from "@/redux/features/auth/authSlice";

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
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (href: string) => pathname === href;

  const handleOpenLogout = () => {
    onCloseMobile();
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      if (refreshToken) {
        await logoutUser({ refresh: refreshToken }).unwrap();
      } else {
        dispatch(logoutAction());
      }
    } catch {
      dispatch(logoutAction());
    } finally {
      setShowLogoutModal(false);
      window.location.href = "/login";
    }
  };

  const sidebarContent = (
    <div className='flex flex-col h-full bg-[#E5E9F4] text-text-primary'>
      {/* Logo */}
      <div className='h-24 flex items-center justify-center pt-4'>
        <Link
          href='/dashboard'
          className='flex flex-col items-center gap-1'
          onClick={onCloseMobile}
        >
          <div className='text-primary'>
            {/* SVG Logo approximating the House with Wings */}
            <svg
              width='40'
              height='40'
              viewBox='0 0 48 48'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M24 6L6 20H12V38H20V26H28V38H36V20H42L24 6Z' />
              <path d='M12 16L4 8L10 2L24 16H12Z' />
            </svg>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className='flex-1 mt-6'>
        <ul className='space-y-1'>
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
                      : "text-text-secondary hover:bg-white/50 border-l-4 border-transparent",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      active ? "text-text-primary" : "text-text-secondary",
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className='p-8'>
        <button
          type='button'
          className='flex items-center gap-4 text-text-secondary hover:text-red-600 transition-colors cursor-pointer group w-full'
          onClick={handleOpenLogout}
        >
          <LogOut className='w-5 h-5 group-hover:text-red-600 transition-colors' />
          <span className='font-medium'>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden'
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-60 shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile Close Button */}
        <button
          className='lg:hidden absolute top-4 right-4 p-2 text-text-primary hover:bg-black/5 rounded-lg z-50'
          onClick={onCloseMobile}
        >
          <X className='w-5 h-5' />
        </button>
        {sidebarContent}
      </aside>

      {/* Logout Warning Confirmation Modal */}
      {showLogoutModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm transition-opacity animate-fade-in'
            onClick={() => {
              if (!isLoggingOut) setShowLogoutModal(false);
            }}
          />

          {/* Modal Container */}
          <div className='relative bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-border animate-fade-in-scale flex flex-col items-center text-center z-10'>
            {/* Close Button */}
            <button
              type='button'
              onClick={() => setShowLogoutModal(false)}
              disabled={isLoggingOut}
              className='absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50'
              aria-label='Close'
            >
              <X className='w-5 h-5' />
            </button>

            {/* Warning Icon Badge */}
            <div className='w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-200 shadow-xs'>
              <AlertTriangle className='w-8 h-8' />
            </div>

            {/* Title & Description */}
            <h3 className='text-xl font-bold text-text-primary mb-2'>
              Confirm Logout
            </h3>
            <p className='text-sm text-text-secondary leading-relaxed mb-6'>
              Are you sure you want to log out of CrewNest Dashboard? You will need to sign in again to access the dashboard.
            </p>

            {/* Action Buttons */}
            <div className='flex items-center gap-3 w-full'>
              <button
                type='button'
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                className='flex-1 px-5 py-2.5 rounded-xl border border-gray-300 text-text-primary hover:bg-slate-50 font-medium transition-colors disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={isLoggingOut}
                onClick={handleConfirmLogout}
                className='flex-1 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50'
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className='w-4 h-4' />
                    <span>Yes, Log Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
