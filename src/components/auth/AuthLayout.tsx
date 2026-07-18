"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

/* ─── Types ───────────────────────────────────────────────── */
interface AuthLayoutProps {
  /** Icon component rendered in the left/top branding panel */
  icon: React.ReactNode;
  /** Large title below the icon */
  title: string;
  /** Subtitle / description text */
  subtitle: string;
  /** Back-arrow link href — if omitted the arrow is hidden */
  backHref?: string;
  /** Form-side content */
  children: React.ReactNode;
}

/**
 * Split-panel authentication layout matching the CrewNest mockups.
 *
 * Desktop  → left branding panel + right form panel side-by-side
 * Mobile   → compact branding on top + form below (single column)
 */
export default function AuthLayout({
  icon,
  title,
  subtitle,
  backHref,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-surface-auth">
      {/* ── Top Bar ────────────────────────────────────────── */}
      <header className="w-full px-5 sm:px-8 py-4 flex items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="text-text-primary hover:text-primary transition-colors p-1 -ml-1 rounded-lg hover:bg-white/50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        ) : (
          /* Spacer so logo stays consistent */
          <div className="w-5" />
        )}

        {/* CrewNest brand */}
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold text-text-primary tracking-tight">
            CrewNest
          </span>
        </div>
      </header>

      {/* Divider */}
      <div className="w-full border-t border-border" />

      {/* ── Main Content ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ── Left / Top Branding Panel ───────────────────── */}
        <div
          className="
            w-full lg:w-1/2
            flex flex-col items-center justify-center
            px-6 py-10 lg:py-0
            bg-surface-auth
          "
        >
          {/* Icon with subtle float animation */}
          <div className="animate-float mb-5">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-card border border-white/80">
              {icon}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl lg:text-2xl font-bold text-text-primary text-center mb-2 animate-fade-in">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-text-secondary text-center max-w-xs leading-relaxed animate-fade-in">
            {subtitle}
          </p>
        </div>

        {/* ── Right / Bottom Form Panel ───────────────────── */}
        <div
          className="
            w-full lg:w-1/2
            flex items-start lg:items-center justify-center
            p-5 sm:p-8 lg:p-12
            bg-white lg:bg-white
            rounded-t-3xl lg:rounded-none
            -mt-4 lg:mt-0
            min-h-[50vh] lg:min-h-0
          "
        >
          <div className="w-full max-w-md animate-slide-in-right">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
