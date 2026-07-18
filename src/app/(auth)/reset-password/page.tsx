"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";
import { useToast } from "@/components/toast";

/* ─── SVG icon for the left branding panel ────────────────── */
function KeySearchIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      {/* Magnifying glass */}
      <circle
        cx="22"
        cy="22"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <line
        x1="29.5"
        y1="29.5"
        x2="38"
        y2="38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Key inside */}
      <circle cx="22" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
      <line
        x1="22"
        y1="22"
        x2="22"
        y2="28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="22"
        y1="26"
        x2="25"
        y2="26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Form validation ─────────────────────────────────────── */
interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

function validateForm(password: string, confirmPassword: string): FormErrors {
  const errors: FormErrors = {};

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

/* ─── Inner content (needs useSearchParams) ───────────────── */
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { addToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Validate */
    const formErrors = validateForm(password, confirmPassword);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    if (!token) {
      addToast("Reset token is missing. Please try again.", "error");
      router.push("/forgot-password");
      return;
    }

    /* Mock reset password flow */
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addToast("Password updated successfully! Please log in.", "success");
      router.push("/login");
    } catch {
      addToast("Failed to update password. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={<KeySearchIcon />}
      title="One More Step"
      subtitle="Create a strong password to secure your account."
      backHref="/verify-otp"
    >
      {/* Form heading */}
      <h2 className="text-2xl font-bold text-text-primary mb-8">
        New Password
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          type="password"
          label="Create Password"
          icon={<Lock className="w-5 h-5" />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          autoComplete="new-password"
        />

        <InputField
          type="password"
          label="Confirm Password"
          icon={<Lock className="w-5 h-5" />}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="mt-4">
          <AuthButton type="submit" isLoading={isLoading}>
            Update Password
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
}

/* ─── Page (wrapped in Suspense for useSearchParams) ──────── */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-surface-auth">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
