"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";
import type { AdminToast } from "@/types";
import { cn } from "@/utils";

interface AdminToastsProps {
  toasts: AdminToast[];
  onDismiss: (id: string) => void;
}

export function AdminToasts({ toasts, onDismiss }: AdminToastsProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => {
        const offline = toast.type === "offline";
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur",
              offline
                ? "border-accent-red/30 bg-[#2a1018]/95 text-accent-red"
                : "border-accent-green/30 bg-[#0b241c]/95 text-accent-green"
            )}
          >
            {offline ? <CircleAlert className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
              {toast.message}
            </span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
