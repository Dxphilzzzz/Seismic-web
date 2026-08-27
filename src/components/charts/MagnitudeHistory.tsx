"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeismicHistoryEntry } from "@/types";
import { cn, formatTime, getMagnitudeColor } from "@/utils";

interface MagnitudeHistoryProps {
  history: SeismicHistoryEntry[];
  isDarkMode?: boolean;
}

export function MagnitudeHistory({ history, isDarkMode = false }: MagnitudeHistoryProps) {
  const chartData = useMemo(
    () =>
      [...history]
        .reverse()
        .slice(-100)
        .map((reading) => ({
          time: formatTime(reading.timestamp),
          magnitude: reading.magnitude,
        })),
    [history]
  );

  const peak = chartData.length ? Math.max(...chartData.map((d) => d.magnitude)) : 0;
  const color = peak ? getMagnitudeColor(peak) : "#F59E0B";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className={cn(
        "rounded-xl p-5",
        isDarkMode ? "border border-white/10 bg-[#475569]/90" : "border border-slate-200 bg-white/90 shadow-sm"
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-yellow/20 bg-accent-yellow/10">
            <TrendingUp className="h-5 w-5 text-accent-yellow" />
          </div>
          <div>
            <h2 className={cn("text-base font-semibold", isDarkMode ? "text-white" : "text-slate-900")}>Magnitude History</h2>
            <p className={cn("text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>
              Historical magnitude over time - last 100 entries
            </p>
          </div>
        </div>
        {peak > 0 && (
          <div className="rounded-lg border border-accent-yellow/20 bg-accent-yellow/10 px-3 py-1.5 font-mono text-xs text-accent-yellow">
            Peak: {peak.toFixed(3)}
          </div>
        )}
      </div>

      <div className="h-64">
        {chartData.length === 0 ? (
          <div className={cn("flex h-full items-center justify-center", isDarkMode ? "text-gray-600" : "text-slate-500")}>
            <p className="text-sm">No history available yet...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="magHistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.24} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "rgba(148,163,184,0.18)" : "rgba(15,23,42,0.12)"} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: isDarkMode ? "#94a3b8" : "#475569" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: isDarkMode ? "#94a3b8" : "#475569" }} tickLine={false} axisLine={false} width={50} tickFormatter={(value) => Number(value).toFixed(1)} />
              <Tooltip
                contentStyle={{
                  background: isDarkMode ? "#0f172a" : "#fff",
                  border: isDarkMode ? "1px solid rgba(148,163,184,0.2)" : "1px solid rgba(148,163,184,0.5)",
                  borderRadius: 8,
                  color: isDarkMode ? "#e2e8f0" : "#0f172a",
                }}
                labelStyle={{ color: isDarkMode ? "#cbd5e1" : "#475569", fontFamily: "JetBrains Mono" }}
              />
              <ReferenceLine y={10.5} stroke="#F59E0B" strokeDasharray="4 3" strokeOpacity={0.6} />
              <ReferenceLine y={12} stroke="#EF4444" strokeDasharray="4 3" strokeOpacity={0.7} />
              <Area type="monotone" dataKey="magnitude" fill="url(#magHistGrad)" stroke="none" isAnimationActive={false} />
              <Line type="monotone" dataKey="magnitude" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.section>
  );
}
