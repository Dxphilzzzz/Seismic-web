"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Calendar,
  Clock,
  Download,
  LogOut,
  Moon,
  ShieldCheck,
  SunMedium,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { User } from "firebase/auth";
import { useClock } from "@/hooks/useClock";
import { cn } from "@/utils";
import type { AlertEvent, SensorWithState } from "@/types";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";

interface HeaderProps {
  isConnected: boolean;
  lastUpdate: Date | null;
  role?: "public" | "admin";
  user?: User | null;
  sensors?: SensorWithState[];
  alerts?: AlertEvent[];
  onLogout?: () => void;
  onDownload?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function Header({
  isConnected,
  lastUpdate,
  role = "public",
  user,
  sensors = [],
  alerts = [],
  onLogout,
  onDownload,
  isDarkMode = false,
  onToggleTheme,
}: HeaderProps) {
  const { time, date } = useClock();
  const isAdmin = role === "admin";
  const title = isAdmin
    ? "Operations dashboard"
    : "Earthquake activity dashboard";
  const eyebrow = isAdmin
    ? "Seismic monitoring"
    : "Public seismic intelligence";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "border-b px-4 py-5 md:px-6 md:py-6",
        isDarkMode
          ? "border-white/10 bg-slate-950/80"
          : "border-slate-200 bg-white/80 backdrop-blur-xl",
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p
            className={cn(
              "mb-2 text-xs font-bold uppercase tracking-[0.24em]",
              isDarkMode ? "text-sky-400" : "text-sky-700",
            )}
          >
            {eyebrow}
          </p>
          <h1
            className={cn(
              "text-2xl font-semibold tracking-tight",
              isDarkMode ? "text-white" : "text-slate-900",
            )}
          >
            {title}
          </h1>
          {!isAdmin && (
            <p
              className={cn(
                "mt-2 text-sm leading-6",
                isDarkMode ? "text-slate-400" : "text-slate-600",
              )}
            >
              Live ground-motion readings and recent seismic events from the
              monitoring network.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium",
              isConnected
                ? isDarkMode
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-emerald-500/30 bg-emerald-50 text-emerald-700"
                : isDarkMode
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-red-500/30 bg-red-50 text-red-700",
            )}
          >
            {isConnected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            <span className="font-mono text-xs">
              {isConnected ? "LIVE" : "OFFLINE"}
            </span>
            {isConnected && (
              <span className="status-dot h-2 w-2 rounded-full bg-emerald-400" />
            )}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              isDarkMode
                ? "border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200",
            )}
          >
            {isDarkMode ? (
              <Moon className="h-4 w-4" />
            ) : (
              <SunMedium className="h-4 w-4" />
            )}
            {isDarkMode ? "Dark" : "Light"}
          </button>

          {!isAdmin ? (
            <Link
              href="/admin/login"
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                isDarkMode
                  ? "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/15"
                  : "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 font-mono text-xs font-bold text-purple-300">
              ADMIN
            </span>
          )}

          {isAdmin && onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                isDarkMode
                  ? "border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800"
                  : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200",
              )}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          )}

          {isAdmin && (
            <>
              <NotificationCenter alerts={alerts} sensors={sensors} />
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2",
                  isDarkMode
                    ? "border-white/10 bg-slate-900/80"
                    : "border-slate-200 bg-slate-50",
                )}
              >
                <span
                  className={cn(
                    "max-w-44 truncate text-xs",
                    isDarkMode ? "text-slate-300" : "text-slate-700",
                  )}
                >
                  {user?.email || "Admin"}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className={cn(
                    "rounded-md p-1 transition-colors",
                    isDarkMode
                      ? "text-slate-400 hover:bg-white/10 hover:text-white"
                      : "text-slate-500 hover:bg-slate-200 hover:text-slate-900",
                  )}
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className={cn(
          "mt-5 grid gap-3 border-t pt-4 sm:grid-cols-2",
          isAdmin ? "lg:grid-cols-3" : "lg:grid-cols-2",
          isDarkMode ? "border-white/5" : "border-slate-200",
        )}
      >
        {isAdmin && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2",
              isDarkMode ? "bg-white/5" : "bg-slate-50",
            )}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Data source
              </p>
              <p
                className={cn(
                  "font-mono text-xs",
                  isDarkMode ? "text-slate-300" : "text-slate-700",
                )}
              >
                ESP32 · MPU6050 · Firebase
              </p>
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2",
            isDarkMode ? "bg-white/5" : "bg-slate-50",
          )}
        >
          <Calendar
            className={cn(
              "h-4 w-4",
              isDarkMode ? "text-sky-400" : "text-sky-700",
            )}
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Local time
            </p>
            <p
              className={cn(
                "font-mono text-xs",
                isDarkMode ? "text-slate-300" : "text-slate-700",
              )}
            >
              {date} · {time}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2",
            isDarkMode ? "bg-white/5" : "bg-slate-50",
          )}
        >
          <Clock
            className={cn(
              "h-4 w-4",
              isDarkMode ? "text-sky-400" : "text-sky-700",
            )}
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Latest reading
            </p>
            <p
              className={cn(
                "font-mono text-xs",
                isDarkMode ? "text-slate-300" : "text-slate-700",
              )}
            >
              {lastUpdate
                ? lastUpdate.toLocaleTimeString()
                : "Waiting for readings"}
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
