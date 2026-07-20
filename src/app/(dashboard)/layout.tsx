"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopHeader from "@/components/dashboard/TopHeader";
import { ToastProvider } from "@/components/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ToastProvider>
      <div className='min-h-dvh flex bg-[#F4F7FC]'>
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className='flex-1 flex flex-col min-h-screen overflow-x-hidden'>
          {/* Top Header */}
          <TopHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          {/* Page Content */}
          <div className='flex-1 p-4 md:p-6 lg:px-10 pb-10'>{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
