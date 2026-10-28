"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";
import { useToast } from "@/components/toast";

/* ─── SVG icon for the left branding panel ────────────────── */
function KeyIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M30 18C30 14.6863 27.3137 12 24 12C20.6863 12 18 14.6863 18 18C18 21.3137 20.6863 24 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24 24V38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24 32H30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24 38H28"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="24"
        cy="18"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

import { useForgotPasswordMutation } from "@/redux/services/authApi";
import type { ApiErrorResponse } from "@/redux/types/auth.types";

/* ─── Page Component ──────────────────────────────────────── */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Validate */
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email");
      return;
    }

    try {
      const response = await forgotPassword({ email: email.trim() }).unwrap();
      const message = response.message || "OTP sent to your email successfully!";
      addToast(message, "success");
      router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
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

      const emailError =
        serverErrors?.email?.[0] ||
        (typeof serverErrors?.email === "string" ? serverErrors.email : undefined);

      const generalMessage =
        emailError ||
        nonFieldError ||
        apiErr.data?.message ||
        apiErr.data?.detail ||
        "Failed to send OTP. Please check your email.";

      setError(generalMessage);
      addToast(generalMessage, "error");
    }
  };

  return (
    <AuthLayout
      icon={<KeyIcon />}
      title="Reset Your Password"
      subtitle="Welcome back. Access your dashboard and manage your CrewNest Platform."
      backHref="/login"
    >
      {/* Form heading */}
      <h2 className="text-2xl font-bold text-text-primary mb-8">
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          type="email"
          label="Personal Email"
          icon={<Mail className="w-5 h-5" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoComplete="email"
        />

        <div className="mt-6">
          <AuthButton type="submit" isLoading={isLoading}>
            Send OTP
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
}
