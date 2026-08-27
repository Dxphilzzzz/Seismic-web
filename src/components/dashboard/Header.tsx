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
  Satellite,
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

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "border-b px-4 py-4 md:px-6",
        isDarkMode ? "border-white/10 bg-slate-950/60" : "border-slate-200 bg-[#f5f7fa]"
      )}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className={cn("mb-1 text-xs font-semibold uppercase tracking-[0.22em]", isDarkMode ? "text-sky-400" : "text-sky-700")}>
            Seismic monitoring
          </p>
          <h1 className={cn("text-2xl font-semibold tracking-tight", isDarkMode ? "text-white" : "text-slate-900")}>
            Reports
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium",
              isConnected
                ? isDarkMode
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-emerald-500/30 bg-emerald-50 text-emerald-700"
                : isDarkMode
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-red-500/30 bg-red-50 text-red-700"
            )}
          >
            {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span className="font-mono text-xs">{isConnected ? "LIVE" : "OFFLINE"}</span>
            {isConnected && <span className="status-dot h-2 w-2 rounded-full bg-emerald-400" />}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              isDarkMode
                ? "border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {isDarkMode ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
            {isDarkMode ? "Dark" : "Light"}
          </button>

          {!isAdmin ? (
            <Link
              href="/admin/login"
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                isDarkMode
                  ? "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/15"
                  : "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
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
                  : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          )}

          {isAdmin && (
            <>
              <NotificationCenter alerts={alerts} sensors={sensors} />
              <div className={cn("flex items-center gap-2 rounded-lg border px-3 py-2", isDarkMode ? "border-white/10 bg-slate-900/80" : "border-slate-200 bg-slate-50")}>
                <span className={cn("max-w-44 truncate text-xs", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                  {user?.email || "Admin"}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className={cn("rounded-md p-1 transition-colors", isDarkMode ? "text-slate-400 hover:bg-white/10 hover:text-white" : "text-slate-500 hover:bg-slate-200 hover:text-slate-900")}
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={cn("mt-4 flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between", isDarkMode ? "border-white/5" : "border-slate-200")}>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Satellite className={cn("h-4 w-4", isDarkMode ? "text-sky-400" : "text-sky-700")} />
          <span className={cn("font-mono text-xs", isDarkMode ? "text-slate-400" : "text-slate-600")}>
            ESP32 + MPU6050 + Firebase RTDB
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <Calendar className={cn("h-4 w-4", isDarkMode ? "text-sky-400" : "text-sky-700")} />
          <span className={cn("font-mono text-sm", isDarkMode ? "text-slate-300" : "text-slate-700")}>{date}</span>
          <Clock className={cn("ml-2 h-4 w-4", isDarkMode ? "text-sky-400" : "text-sky-700")} />
          <span className={cn("font-mono text-base font-bold tabular-nums", isDarkMode ? "text-sky-400" : "text-sky-700")}>{time}</span>
          <span className={cn("font-mono text-xs", isDarkMode ? "text-slate-400" : "text-slate-600")}>
            Last update: {lastUpdate ? lastUpdate.toLocaleTimeString() : "Waiting for readings"}
          </span>
        </div>
      </div>
    </motion.header>
  );
}
