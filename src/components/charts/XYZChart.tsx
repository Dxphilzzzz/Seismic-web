"use client";

import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartDataPoint } from "@/types";
import { cn } from "@/utils";

interface XYZChartProps {
  chartData: ChartDataPoint[];
  isDarkMode?: boolean;
}

export function XYZChart({ chartData, isDarkMode = false }: XYZChartProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={cn(
        "rounded-xl p-5",
        isDarkMode ? "border border-white/10 bg-[#475569]/90" : "border border-slate-200 bg-white/90 shadow-sm"
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10">
          <BarChart2 className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h2 className={cn("text-base font-semibold", isDarkMode ? "text-white" : "text-slate-900")}>Acceleration Axes - X / Y / Z</h2>
          <p className={cn("text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>
            Multi-axis accelerometer readings from MPU6050
          </p>
        </div>
      </div>

      <div className="h-64">
        {chartData.length === 0 ? (
          <div className={cn("flex h-full items-center justify-center", isDarkMode ? "text-gray-600" : "text-slate-500")}>
            <p className="text-sm">Waiting for data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px", color: isDarkMode ? "#cbd5e1" : "#334155" }} />
              <Line type="monotone" dataKey="x" name="X" stroke="#3B82F6" strokeWidth={1.7} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="y" name="Y" stroke="#22C55E" strokeWidth={1.7} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="z" name="Z" stroke="#F59E0B" strokeWidth={1.7} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.section>
  );
}
