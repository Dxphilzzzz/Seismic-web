"use client";

import { motion } from "framer-motion";
import { BarChart2, TrendingDown, TrendingUp, Activity, Zap, Clock, Tag } from "lucide-react";
import { computeAnalytics, getStatusBg } from "@/utils";
import type { SeismicHistoryEntry, IntensityStatus } from "@/types";

interface AnalyticsPanelProps {
  history: SeismicHistoryEntry[];
}

export function AnalyticsPanel({ history }: AnalyticsPanelProps) {
  const analytics = computeAnalytics(history);

  const metrics = [
    {
      label: "Average Magnitude",
      value: analytics.averageMagnitude.toFixed(4),
      icon: Activity,
      color: "#3B82F6",
      unit: "m/s²",
    },
    {
      label: "Peak Magnitude",
      value: analytics.peakMagnitude.toFixed(4),
      icon: TrendingUp,
      color: "#EF4444",
      unit: "m/s²",
    },
    {
      label: "Lowest Magnitude",
      value: analytics.lowestMagnitude.toFixed(4),
      icon: TrendingDown,
      color: "#10B981",
      unit: "m/s²",
    },
    {
      label: "Daily Event Count",
      value: analytics.dailyEventCount.toString(),
      icon: Zap,
      color: "#F59E0B",
      unit: "events / 24h",
    },
    {
      label: "Events Per Hour",
      value: analytics.eventsPerHour.toString(),
      icon: Clock,
      color: "#8B5CF6",
      unit: "events / hr",
    },
    {
      label: "Most Frequent",
      value: analytics.mostFrequentIntensity,
      icon: Tag,
      color:
        analytics.mostFrequentIntensity === "STRONG"
          ? "#EF4444"
          : analytics.mostFrequentIntensity === "MODERATE"
          ? "#F59E0B"
          : "#10B981",
      unit: "intensity level",
      isBadge: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="glass-card rounded-2xl p-5 mb-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">
            Analytics Summary
          </h2>
          <p className="text-xs text-gray-500">
            Computed statistics from all {history.length} recorded events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.85 + i * 0.05 }}
              className="bg-surface-light/50 rounded-xl p-4 border border-white/5"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}
              >
                <Icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <p className="text-xs text-gray-500 mb-2 leading-tight">{m.label}</p>
              {m.isBadge ? (
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border font-mono ${getStatusBg(m.value as IntensityStatus)}`}
                >
                  {history.length === 0 ? "—" : m.value}
                </span>
              ) : (
                <>
                  <p
                    className="text-xl font-mono font-bold tabular-nums"
                    style={{ color: m.color }}
                  >
                    {history.length === 0 ? "—" : m.value}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{m.unit}</p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
