"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { SeismicHistoryEntry } from "@/types";
import { formatTime, getMagnitudeColor } from "@/utils";
import { useMemo } from "react";

interface MagnitudeHistoryProps {
  history: SeismicHistoryEntry[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-surface border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p
          className="text-lg font-mono font-bold tabular-nums"
          style={{ color: getMagnitudeColor(val) }}
        >
          {val.toFixed(4)}
        </p>
        <p className="text-xs text-gray-500">magnitude</p>
      </div>
    );
  }
  return null;
};

export function MagnitudeHistory({ history }: MagnitudeHistoryProps) {
  const chartData = useMemo(() => {
    return [...history]
      .reverse()
      .slice(-100)
      .map((h) => ({
        time: formatTime(h.timestamp),
        magnitude: h.magnitude,
      }));
  }, [history]);

  const peak = chartData.length
    ? Math.max(...chartData.map((d) => d.magnitude))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-2xl p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent-yellow" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Magnitude History
            </h2>
            <p className="text-xs text-gray-500">
              Historical magnitude over time — last 100 entries
            </p>
          </div>
        </div>
        {peak > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-yellow/10 border border-accent-yellow/20">
            <TrendingUp className="w-3 h-3 text-accent-yellow" />
            <span className="text-xs font-mono text-accent-yellow">
              Peak: {peak.toFixed(3)}
            </span>
          </div>
        )}
      </div>

      <div className="h-56">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-600">
            <p className="text-sm">No history available yet...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="magHistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
                width={50}
                tickFormatter={(v) => v.toFixed(1)}
              />
              <Tooltip content={<CustomTooltip />} />

              <ReferenceLine
                y={10.5}
                stroke="#F59E0B"
                strokeDasharray="4 3"
                strokeOpacity={0.5}
              />
              <ReferenceLine
                y={12}
                stroke="#EF4444"
                strokeDasharray="4 3"
                strokeOpacity={0.5}
              />
              {peak > 0 && (
                <ReferenceLine
                  y={peak}
                  stroke="#8B5CF6"
                  strokeDasharray="4 3"
                  strokeOpacity={0.6}
                  label={{
                    value: "PEAK",
                    fill: "#8B5CF6",
                    fontSize: 10,
                    position: "right",
                  }}
                />
              )}

              <Area
                type="monotone"
                dataKey="magnitude"
                fill="url(#magHistGrad)"
                stroke="none"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="magnitude"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#F59E0B", strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
