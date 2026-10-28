"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

/* ─── Types ───────────────────────────────────────────────── */
interface OtpInputProps {
  /** Number of digits (default 6) */
  length?: number;
  /** Called when all digits are filled */
  onComplete?: (otp: string) => void;
  /** Called on every value change (partial or complete) */
  onChange?: (otp: string) => void;
  /** Whether to disable all inputs */
  disabled?: boolean;
}

/**
 * 6-digit OTP input matching CrewNest mockup.
 *
 * Features:
 * - Auto-advance focus on digit entry
 * - Backspace navigates to previous field
 * - Full clipboard paste support
 * - Countdown resend timer
 * - Individual rounded-rect boxes per digit
 */
export default function OtpInput({
  length = 6,
  onComplete,
  onChange,
  disabled = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [countdown, setCountdown] = useState(60);
  const canResend = countdown <= 0;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Countdown Timer ─────────────────────────────────── */
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  /* ── Resend handler ──────────────────────────────────── */
  const handleResend = useCallback(() => {
    setCountdown(60);
    setOtp(Array(length).fill(""));
    inputRefs.current[0]?.focus();
  }, [length]);

  /* ── Digit change ────────────────────────────────────── */
  const handleChange = (index: number, value: string) => {
    if (value && !/^[0-9]+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange?.(otpString);

    if (otpString.length === length && !newOtp.includes("")) {
      onComplete?.(otpString);
    }

    /* Auto-advance to next input */
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ── Keyboard navigation ─────────────────────────────── */
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ── Paste support ───────────────────────────────────── */
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/[^0-9]/g, "")
      .slice(0, length);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < length) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    if (newOtp.join("").length === length && !newOtp.includes("")) {
      onComplete?.(newOtp.join(""));
    }
  };

  return (
    <div className="w-full">
      {/* OTP digit boxes */}
      <div className="flex justify-between items-center gap-2 sm:gap-3 mb-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="
              w-11 h-12 sm:w-14 sm:h-14
              rounded-xl
              border border-border-input
              bg-surface-alt
              text-center text-lg font-semibold text-text-primary
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            maxLength={2}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Resend countdown */}
      <div className="text-center text-sm text-text-secondary mb-6">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-primary font-medium hover:underline transition-colors"
          >
            Resend Code
          </button>
        ) : (
          <span>
            Resent code after{" "}
            <span className="font-semibold text-primary">{countdown}s</span>
          </span>
        )}
      </div>
    </div>
  );
}
