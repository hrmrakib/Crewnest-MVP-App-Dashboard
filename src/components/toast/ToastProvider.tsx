"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

/* ─── Types ───────────────────────────────────────────────── */
type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  /** Timestamp when the toast was created (for progress bar) */
  createdAt: number;
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant) => void;
}

/* ─── Context ─────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null);

/** Auto-dismiss duration in milliseconds */
const TOAST_DURATION = 4000;

/* ─── Variant config ──────────────────────────────────────── */
const variantConfig: Record<
  ToastVariant,
  { icon: React.ElementType; bg: string; border: string; text: string; progress: string }
> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    progress: "bg-emerald-500",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    progress: "bg-red-500",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    progress: "bg-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    progress: "bg-amber-500",
  },
};

/* ─── Single Toast Component ──────────────────────────────── */
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const config = variantConfig[toast.variant];
  const Icon = config.icon;
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  /** Start the auto-dismiss timer */
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, TOAST_DURATION);

    return () => clearTimeout(timerRef.current);
  }, [toast.id, onDismiss]);

  const handleClose = () => {
    clearTimeout(timerRef.current);
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      role="alert"
      className={`
        relative overflow-hidden rounded-xl border shadow-lg
        ${config.bg} ${config.border}
        ${isExiting ? "animate-toast-out" : "animate-toast-in"}
        min-w-[320px] max-w-[420px]
      `}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.text}`} />
        <p className={`text-sm font-medium flex-1 ${config.text}`}>
          {toast.message}
        </p>
        <button
          onClick={handleClose}
          className={`shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors ${config.text}`}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-black/5">
        <div
          className={`h-full ${config.progress} rounded-full`}
          style={{
            animation: `shrinkWidth ${TOAST_DURATION}ms linear forwards`,
          }}
        />
      </div>

      {/* Inline keyframes for the progress bar */}
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/* ─── Provider ────────────────────────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, message, variant, createdAt: Date.now() }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext value={{ addToast }}>
      {children}

      {/* Toast container — fixed top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

/* ─── Hook ────────────────────────────────────────────────── */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
