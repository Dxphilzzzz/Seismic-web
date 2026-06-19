"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BarChart2 } from "lucide-react";
import type { ChartDataPoint } from "@/types";

interface XYZChartProps {
  chartData: ChartDataPoint[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-white/10 rounded-lg p-3 shadow-xl min-w-[140px]">
        <p className="text-xs text-gray-400 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex justify-between gap-4 text-sm">
            <span style={{ color: p.color }} className="font-mono">
              {p.name}
            </span>
            <span className="font-mono font-bold" style={{ color: p.color }}>
              {p.value.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function XYZChart({ chartData }: XYZChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-2xl p-5 mb-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">
            Acceleration Axes — X / Y / Z
          </h2>
          <p className="text-xs text-gray-500">
            Multi-axis accelerometer readings from MPU6050
          </p>
        </div>
      </div>

      <div className="h-56">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-600">
            <p className="text-sm">Waiting for data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
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
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                formatter={(val) => (
                  <span style={{ color: "#9CA3AF", fontSize: "11px" }}>
                    {val} Axis
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="x"
                name="X"
                stroke="#3B82F6"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: "#3B82F6" }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="y"
                name="Y"
                stroke="#10B981"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: "#10B981" }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="z"
                name="Z"
                stroke="#F59E0B"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: "#F59E0B" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
