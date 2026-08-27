"use client";

import { motion } from "framer-motion";
import { Activity, BarChart2, Clock, Tag, TrendingDown, TrendingUp, Zap } from "lucide-react";
import type { IntensityStatus, SeismicHistoryEntry } from "@/types";
import { cn, computeAnalytics, getStatusBg } from "@/utils";

interface AnalyticsPanelProps {
  history: SeismicHistoryEntry[];
  isDarkMode?: boolean;
}

export function AnalyticsPanel({ history, isDarkMode = false }: AnalyticsPanelProps) {
  const analytics = computeAnalytics(history);
  const metrics = [
    { label: "Average Magnitude", value: analytics.averageMagnitude.toFixed(4), icon: Activity, color: "#3B82F6", unit: "m/s2" },
    { label: "Peak Magnitude", value: analytics.peakMagnitude.toFixed(4), icon: TrendingUp, color: "#EF4444", unit: "m/s2" },
    { label: "Lowest Magnitude", value: analytics.lowestMagnitude.toFixed(4), icon: TrendingDown, color: "#22C55E", unit: "m/s2" },
    { label: "Daily Event Count", value: analytics.dailyEventCount.toString(), icon: Zap, color: "#F59E0B", unit: "events / 24h" },
    { label: "Events Per Hour", value: analytics.eventsPerHour.toString(), icon: Clock, color: "#8B5CF6", unit: "events / hr" },
    { label: "Most Frequent", value: analytics.mostFrequentIntensity, icon: Tag, color: "#22C55E", unit: "intensity level", isBadge: true },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className={cn(
        "mb-6 rounded-xl p-5",
        isDarkMode ? "border border-white/10 bg-slate-800/80" : "border border-slate-200 bg-white/90 shadow-sm"
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10">
          <BarChart2 className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h2 className={cn("text-base font-semibold", isDarkMode ? "text-white" : "text-slate-900")}>
            Analytics Summary
          </h2>
          <p className={cn("text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>
            Computed statistics from all {history.length} recorded events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + index * 0.04 }}
              className={cn(
                "rounded-xl border p-4",
                isDarkMode ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-50"
              )}
            >
              <div
                className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: `${metric.color}15`, border: `1px solid ${metric.color}25` }}
              >
                <Icon className="h-4 w-4" style={{ color: metric.color }} />
              </div>
              <p className={cn("mb-2 text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>{metric.label}</p>
              {metric.isBadge ? (
                <span
                  className={`inline-flex rounded border px-2 py-0.5 font-mono text-xs font-bold ${getStatusBg(
                    metric.value as IntensityStatus
                  )}`}
                >
                  {history.length === 0 ? "-" : metric.value}
                </span>
              ) : (
                <>
                  <p className="font-mono text-xl font-bold tabular-nums" style={{ color: metric.color }}>
                    {history.length === 0 ? "-" : metric.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">{metric.unit}</p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
