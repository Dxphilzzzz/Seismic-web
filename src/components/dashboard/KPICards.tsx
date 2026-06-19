"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  Database,
  Clock,
  Server,
} from "lucide-react";
import { cn, getStatusBg, formatTimestamp, getMagnitudeColor } from "@/utils";
import type { SeismicReading, SeismicHistoryEntry } from "@/types";

interface KPICardsProps {
  liveData: SeismicReading | null;
  history: SeismicHistoryEntry[];
  isConnected: boolean;
  isLoading: boolean;
}

export function KPICards({
  liveData,
  history,
  isConnected,
  isLoading,
}: KPICardsProps) {
  const peakMagnitude = history.length
    ? Math.max(...history.map((h) => h.magnitude))
    : 0;
  const lastEvent = history[0];

  const cards = [
    {
      id: "magnitude",
      label: "Current Magnitude",
      value: liveData ? liveData.magnitude.toFixed(3) : "—",
      icon: Activity,
      color: liveData ? getMagnitudeColor(liveData.magnitude) : "#3B82F6",
      sub: "m/s²",
      glow: true,
    },
    {
      id: "intensity",
      label: "Current Intensity",
      value: liveData?.status ?? "—",
      icon: AlertTriangle,
      color:
        liveData?.status === "STRONG"
          ? "#EF4444"
          : liveData?.status === "MODERATE"
          ? "#F59E0B"
          : "#10B981",
      sub: "Seismic Level",
      badge: true,
      status: liveData?.status,
    },
    {
      id: "peak",
      label: "Peak Magnitude",
      value: peakMagnitude ? peakMagnitude.toFixed(3) : "—",
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
      value: lastEvent ? formatTimestamp(lastEvent.timestamp).split(",")[1]?.trim() ?? "—" : "—",
      icon: Clock,
      color: "#8B5CF6",
      sub: lastEvent
        ? formatTimestamp(lastEvent.timestamp).split(",")[0]
        : "No events",
    },
    {
      id: "health",
      label: "System Health",
      value: isConnected ? "ONLINE" : "OFFLINE",
      icon: Server,
      color: isConnected ? "#10B981" : "#EF4444",
      sub: isConnected ? "Firebase connected" : "Connection lost",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className={cn(
              "glass-card glass-card-hover rounded-xl p-4 relative overflow-hidden",
              card.id === "intensity" &&
                liveData?.status === "STRONG" &&
                "alert-strong"
            )}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-5 rounded-xl"
              style={{
                background: `radial-gradient(ellipse at top right, ${card.color}, transparent 70%)`,
              }}
            />

            <div className="relative">
              {/* Icon */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
                >
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                {isLoading && (
                  <span className="w-2 h-2 rounded-full bg-accent-blue/50 animate-pulse" />
                )}
              </div>

              {/* Label */}
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider truncate">
                {card.label}
              </p>

              {/* Value */}
              {card.badge && card.status ? (
                <div
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md text-sm font-bold border font-mono",
                    getStatusBg(card.status as "WEAK" | "MODERATE" | "STRONG")
                  )}
                >
                  {isLoading ? "..." : card.value}
                </div>
              ) : (
                <p
                  className="text-2xl font-bold font-mono tabular-nums truncate"
                  style={{ color: card.color }}
                >
                  {isLoading ? (
                    <span className="animate-pulse text-gray-600">---</span>
                  ) : (
                    card.value
                  )}
                </p>
              )}

              {/* Sub */}
              <p className="text-xs text-gray-600 mt-1 truncate">{card.sub}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
