"use client";

import React, { useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ───────────────────────────────────────────────── */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Lucide icon or any React node rendered on the left */
  icon?: React.ReactNode;
  /** Floating label text (replaces placeholder visually) */
  label: string;
  /** Validation error message — shows below the field */
  error?: string;
}

/**
 * Floating-label input field matching CrewNest mockup style.
 *
 * Features:
 * - Left icon
 * - Floating label that lifts on focus / when value is present
 * - Bottom-border-only visual style
 * - Password toggle (eye icon) when type="password"
 * - Error state with red underline + message
 */
export default function InputField({
  className,
  icon,
  label,
  error,
  type,
  value,
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === "password";
  const inputId = useId();

  /* The label floats when the field is focused or has a value */
  const hasValue = value !== undefined && value !== "";
  const isFloating = isFocused || hasValue;

  return (
    <div className="w-full mb-5">
      <div
        className={cn(
          "relative flex items-center border-b-2 transition-colors duration-200 group",
          error
            ? "border-red-400"
            : isFocused
              ? "border-primary"
              : "border-border-input",
        )}
      >
        {/* Left icon */}
        {icon && (
          <div
            className={cn(
              "shrink-0 mr-3 transition-colors duration-200",
              error
                ? "text-red-400"
                : isFocused
                  ? "text-primary"
                  : "text-text-muted",
            )}
          >
            {icon}
          </div>
        )}

        {/* Input + floating label wrapper */}
        <div className="relative flex-1 py-3">
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-0 transition-all duration-200 pointer-events-none origin-left",
              isFloating
                ? "top-0 text-xs scale-90 text-text-secondary"
                : "top-1/2 -translate-y-1/2 text-sm text-text-muted",
            )}
          >
            {label}
          </label>

          <input
            id={inputId}
            type={isPassword && showPassword ? "text" : type}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-transparent",
              isFloating ? "pt-3" : "pt-0",
              isPassword && "pr-8",
              className,
            )}
            {...props}
          />
        </div>

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="shrink-0 ml-2 p-1 text-text-muted hover:text-text-secondary transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
