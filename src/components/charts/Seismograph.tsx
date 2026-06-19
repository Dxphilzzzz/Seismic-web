"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Activity } from "lucide-react";
import type { ChartDataPoint } from "@/types";
import { getMagnitudeColor } from "@/utils";

interface SeismographProps {
  chartData: ChartDataPoint[];
  currentMagnitude: number;
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
        <p className="text-xs text-gray-500">m/s²</p>
      </div>
    );
  }
  return null;
};

export function Seismograph({ chartData, currentMagnitude }: SeismographProps) {
  const color = getMagnitudeColor(currentMagnitude);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-2xl p-5 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Live Seismograph
            </h2>
            <p className="text-xs text-gray-500">Real-time magnitude waveform — last 100 readings</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green" />
            <span className="text-xs text-gray-500">Normal &lt;10.5</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-yellow" />
            <span className="text-xs text-gray-500">Moderate &lt;12</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="text-xs text-gray-500">Strong ≥12</span>
          </div>
        </div>
      </div>

      {/* Live value display */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">
          Current
        </span>
        <span
          className="text-3xl font-mono font-bold tabular-nums"
          style={{ color }}
        >
          {currentMagnitude.toFixed(4)}
        </span>
        <span className="text-sm text-gray-500">m/s²</span>
        <span className="w-2 h-2 rounded-full bg-accent-blue status-dot" />
      </div>

      {/* Chart */}
      <div className="h-52">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-600">
            <p className="text-sm">Waiting for data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="seismoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
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
                domain={["auto", "auto"]}
                tickFormatter={(v) => v.toFixed(1)}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Threshold lines */}
              <ReferenceLine
                y={10.5}
                stroke="#F59E0B"
                strokeDasharray="6 3"
                strokeOpacity={0.6}
                label={{
                  value: "MOD 10.5",
                  fill: "#F59E0B",
                  fontSize: 10,
                  position: "right",
                }}
              />
              <ReferenceLine
                y={12}
                stroke="#EF4444"
                strokeDasharray="6 3"
                strokeOpacity={0.6}
                label={{
                  value: "STR 12.0",
                  fill: "#EF4444",
                  fontSize: 10,
                  position: "right",
                }}
              />

              <Area
                type="monotone"
                dataKey="magnitude"
                stroke={color}
                strokeWidth={2}
                fill="url(#seismoGrad)"
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
