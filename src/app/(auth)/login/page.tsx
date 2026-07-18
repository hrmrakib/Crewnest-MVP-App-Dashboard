"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";
import { useToast } from "@/components/toast";

/* ─── SVG icon for the left branding panel ────────────────── */
function HouseIcon() {
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
        d="M8 22L24 8L40 22V40C40 41.1046 39.1046 42 38 42H10C8.89543 42 8 41.1046 8 40V22Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 42V28H30V42"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 24L24 4L44 24"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Form validation ─────────────────────────────────────── */
interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validateForm(
  email: string,
  password: string,
  confirmPassword: string,
): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email";
  }

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

/* ─── Page Component ──────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Validate */
    const formErrors = validateForm(email, password, confirmPassword);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    /* Mock login flow */
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addToast("Logged in successfully! Welcome to CrewNest.", "success");
      router.push("/dashboard");
    } catch {
      addToast("Login failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={<HouseIcon />}
      title="CrewNest Log In"
      subtitle="Welcome back. Access your dashboard and manage your CrewNest Platform."
      backHref="/"
    >
      {/* Form heading */}
      <h2 className="text-2xl font-bold text-text-primary mb-8">Log In</h2>

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          type="email"
          label="Personal Email"
          icon={<Mail className="w-5 h-5" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          autoComplete="email"
        />

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

        {/* Forgot password link */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-primary hover:underline font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          Log In
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
