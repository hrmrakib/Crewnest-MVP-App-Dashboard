"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import AuthButton from "@/components/auth/AuthButton";
import { useToast } from "@/components/toast";
import { useLoginMutation } from "@/redux/services/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import type { ApiErrorResponse } from "@/redux/types/auth.types";

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
  general?: string;
}

function validateForm(email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Please enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}

/* ─── Page Component ──────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset any stale tokens upon navigating to login page
  useEffect(() => {
    dispatch(logout());
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Client-side validation */
    const formErrors = validateForm(email, password);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    // Ensure no stale tokens exist before login
    dispatch(logout());
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }

    try {
      const response = await login({
        email: email.trim(),
        password,
      }).unwrap();

      const successMessage =
        response.message || "Logged in successfully! Welcome to CrewNest.";
      addToast(successMessage, "success");
      router.push("/dashboard");
    } catch (err: unknown) {
      const apiErr = err as {
        status?: number;
        data?: ApiErrorResponse;
      };

      const serverErrors = apiErr.data?.errors as any;

      const detailError =
        typeof serverErrors?.detail === "string"
          ? serverErrors.detail
          : Array.isArray(serverErrors?.messages) && serverErrors.messages[0]?.message
          ? serverErrors.messages[0].message
          : typeof apiErr.data?.detail === "string"
          ? apiErr.data.detail
          : undefined;

      const nonFieldError =
        serverErrors?.non_field_errors?.[0] ||
        (typeof serverErrors?.non_field_errors === "string"
          ? serverErrors.non_field_errors
          : undefined) ||
        detailError;

      const emailError =
        serverErrors?.email?.[0] ||
        (typeof serverErrors?.email === "string" ? serverErrors.email : undefined);

      const passwordError =
        serverErrors?.password?.[0] ||
        (typeof serverErrors?.password === "string"
          ? serverErrors.password
          : undefined);

      // Handle token_not_valid gracefully
      let generalMessage =
        nonFieldError ||
        apiErr.data?.message ||
        "Invalid email or password. Please try again.";

      if (
        generalMessage.toLowerCase().includes("token not valid") ||
        generalMessage.toLowerCase().includes("token is invalid")
      ) {
        generalMessage = "Your session expired. Please log in with your credentials.";
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
        }
      }

      setErrors({
        email: emailError,
        password: passwordError,
        general: generalMessage,
      });

      addToast(generalMessage, "error");
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

      {/* General error message box if server error occurs */}
      {errors.general && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-start gap-2 animate-fade-in">
          <span className="font-semibold">Error:</span>
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          type="email"
          label="Personal Email"
          icon={<Mail className="w-5 h-5" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email || errors.general) {
              setErrors((prev) => ({
                ...prev,
                email: undefined,
                general: undefined,
              }));
            }
          }}
          error={errors.email}
          autoComplete="email"
        />

        <InputField
          type="password"
          label="Password"
          icon={<Lock className="w-5 h-5" />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password || errors.general) {
              setErrors((prev) => ({
                ...prev,
                password: undefined,
                general: undefined,
              }));
            }
          }}
          error={errors.password}
          autoComplete="current-password"
        />

        {/* Forgot password link */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-primary hover:underline font-medium transition-colors cursor-pointer"
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
