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

/* ─── Page Component ──────────────────────────────────────── */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Validate */
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    /* Mock send OTP flow */
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      addToast("OTP sent to your email successfully!", "success");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch {
      addToast("Failed to send OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
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
