"use client";

import React from "react";
import { ToastProvider } from "@/components/toast";

/**
 * Auth route group layout.
 * Wraps all authentication pages with the toast provider.
 * The visual layout (split panel) is handled by AuthLayout in each page.
 */
export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
