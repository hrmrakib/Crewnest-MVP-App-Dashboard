"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpInput from "@/components/auth/OtpInput";
import AuthButton from "@/components/auth/AuthButton";
import { useToast } from "@/components/toast";

/* ─── SVG icon for the left branding panel ────────────────── */
function PhoneOtpIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      {/* Phone body */}
      <rect
        x="14"
        y="6"
        width="20"
        height="36"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      {/* Screen */}
      <rect
        x="17"
        y="12"
        width="14"
        height="18"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* OTP dots */}
      <circle cx="20" cy="20" r="1.5" fill="currentColor" />
      <circle cx="24" cy="20" r="1.5" fill="currentColor" />
      <circle cx="28" cy="20" r="1.5" fill="currentColor" />
      {/* Home button */}
      <line
        x1="21"
        y1="38"
        x2="27"
        y2="38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

import { useVerifyForgotPasswordMutation } from "@/redux/services/authApi";
import type { ApiErrorResponse } from "@/redux/types/auth.types";

/* ─── Inner content (needs useSearchParams) ───────────────── */
function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { addToast } = useToast();
  const [verifyForgotPassword, { isLoading }] = useVerifyForgotPasswordMutation();

  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (!email) {
      addToast("Email not found. Please try again.", "error");
      router.push("/forgot-password");
      return;
    }

    try {
      const response = await verifyForgotPassword({
        email,
        otp_code: otpValue,
      }).unwrap();

      const message = response.message || "OTP verified successfully!";
      addToast(message, "success");
      const tokenParam = response.token || response.access || otpValue;
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(
          tokenParam
        )}`
      );
    } catch (err: unknown) {
      const apiErr = err as {
        status?: number;
        data?: ApiErrorResponse;
      };

      const serverErrors = apiErr.data?.errors;
      const nonFieldError =
        serverErrors?.non_field_errors?.[0] ||
        (typeof serverErrors?.non_field_errors === "string"
          ? serverErrors.non_field_errors
          : undefined);

      const otpError =
        serverErrors?.otp_code?.[0] ||
        (typeof serverErrors?.otp_code === "string"
          ? serverErrors.otp_code
          : undefined);

      const generalMessage =
        otpError ||
        nonFieldError ||
        apiErr.data?.message ||
        apiErr.data?.detail ||
        "Invalid OTP. Please check the code and try again.";

      setError(generalMessage);
      addToast(generalMessage, "error");
    }
  };

  return (
    <AuthLayout
      icon={<PhoneOtpIcon />}
      title="One More Step"
      subtitle="We've sent a 6-digit verification code to your email address. Enter the code below to continue."
      backHref="/forgot-password"
    >
      {/* Form heading */}
      <h2 className="text-2xl font-bold text-text-primary mb-8">
        Verify OTP
      </h2>

      <div>
        <OtpInput
          length={6}
          onComplete={(otp) => {
            setOtpValue(otp);
            setError("");
          }}
          onChange={(otp) => {
            setOtpValue(otp);
            if (error) setError("");
          }}
          disabled={isLoading}
        />

        {error && (
          <p className="text-xs text-red-500 text-center mb-4 animate-fade-in">
            {error}
          </p>
        )}

        <AuthButton
          type="button"
          onClick={handleVerify}
          isLoading={isLoading}
          disabled={otpValue.length !== 6}
        >
          Verify Now
        </AuthButton>
      </div>
    </AuthLayout>
  );
}

/* ─── Page (wrapped in Suspense for useSearchParams) ──────── */
export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-surface-auth">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
