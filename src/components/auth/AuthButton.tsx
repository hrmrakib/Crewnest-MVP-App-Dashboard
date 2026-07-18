"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ───────────────────────────────────────────────── */
interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shows a spinner and disables the button */
  isLoading?: boolean;
}

/**
 * Primary action button for auth pages.
 *
 * Deep navy (#112349) rounded pill shape matching CrewNest mockups.
 * Supports loading spinner state and disabled styling.
 */
export default function AuthButton({
  children,
  className,
  isLoading,
  disabled,
  ...props
}: AuthButtonProps) {
  return (
    <button
      className={cn(
        "w-full bg-primary hover:bg-primary-light text-white rounded-full",
        "py-3.5 px-6 text-sm font-semibold tracking-wide",
        "transition-all duration-200",
        "flex items-center justify-center gap-2",
        "shadow-md hover:shadow-lg",
        "active:scale-[0.98]",
        (isLoading || disabled) && "opacity-70 cursor-not-allowed",
        className,
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
