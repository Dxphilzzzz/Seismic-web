"use client";

import { motion } from "framer-motion";
import { Activity, AlertTriangle, Clock, Database, Server, TrendingUp } from "lucide-react";
import type { SeismicHistoryEntry, SeismicReading } from "@/types";
import { cn, formatTimestamp, getMagnitudeColor, getStatusBg } from "@/utils";

interface KPICardsProps {
  liveData: SeismicReading | null;
  history: SeismicHistoryEntry[];
  isConnected: boolean;
  isLoading: boolean;
  isDarkMode?: boolean;
}

export function KPICards({ liveData, history, isConnected, isLoading, isDarkMode = false }: KPICardsProps) {
  const peakMagnitude = history.length ? Math.max(...history.map((h) => h.magnitude)) : 0;
  const lastEvent = history[0];

  const cards = [
    {
      id: "magnitude",
      label: "Current Magnitude",
      value: liveData ? liveData.magnitude.toFixed(3) : "-",
      icon: Activity,
      color: liveData ? getMagnitudeColor(liveData.magnitude) : "#3B82F6",
      sub: "m/s2",
    },
    {
      id: "intensity",
      label: "Current Intensity",
      value: liveData?.status ?? "-",
      icon: AlertTriangle,
      color: liveData ? getMagnitudeColor(liveData.magnitude) : "#22C55E",
      sub: "Seismic Level",
      badge: true,
      status: liveData?.status,
    },
    {
      id: "peak",
      label: "Peak Magnitude",
      value: peakMagnitude ? peakMagnitude.toFixed(3) : "-",
      icon: TrendingUp,
      color: "#F59E0B",
      sub: "Today's highest",
    },
    {
      id: "events",
      label: "Total Events",
      value: history.length.toString(),
      icon: Database,
      color: "#3B82F6",
      sub: "Recorded events",
    },
    {
      id: "lastEvent",
      label: "Last Event",
      value: lastEvent ? formatTimestamp(lastEvent.timestamp).split(",")[1]?.trim() || "-" : "-",
      icon: Clock,
      color: "#8B5CF6",
      sub: lastEvent ? formatTimestamp(lastEvent.timestamp).split(",")[0] : "No events",
    },
    {
      id: "health",
      label: "System Health",
      value: isConnected ? "ONLINE" : "OFFLINE",
      icon: Server,
      color: isConnected ? "#22C55E" : "#EF4444",
      sub: isConnected ? "Firebase connected" : "Connection lost",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={cn(
              "relative overflow-hidden rounded-xl p-4",
              isDarkMode
                ? "border border-white/10 bg-[#475569]/90 text-slate-100"
                : "border border-slate-200 bg-white/90 text-slate-800 shadow-sm",
              card.id === "intensity" && liveData?.status === "STRONG" && "alert-strong"
            )}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: `radial-gradient(ellipse at top right, ${card.color}, transparent 70%)`,
              }}
            />

            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
                >
                  <Icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
                {isLoading && <span className="h-2 w-2 animate-pulse rounded-full bg-accent-blue/50" />}
              </div>

              <p className={cn("mb-2 truncate text-xs font-medium uppercase tracking-wider", isDarkMode ? "text-slate-200" : "text-slate-600")}>
                {card.label}
              </p>

              {card.badge && card.status ? (
                <div
                  className={cn(
                    "inline-flex items-center rounded-md border px-2 py-1 font-mono text-sm font-bold",
                    getStatusBg(card.status)
                  )}
                >
                  {card.value}
                </div>
              ) : (
                <p
                  className="truncate font-mono text-2xl font-bold tabular-nums"
                  style={{ color: card.color }}
                >
                  {isLoading ? <span className="animate-pulse text-gray-600">...</span> : card.value}
                </p>
              )}

              <p className={cn("mt-1 truncate text-xs", isDarkMode ? "text-slate-300" : "text-slate-500")}>{card.sub}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
