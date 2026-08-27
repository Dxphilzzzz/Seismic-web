"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Activity } from "lucide-react";
import type { ChartDataPoint } from "@/types";
import { cn, classifyMagnitude, getMagnitudeColor } from "@/utils";

interface SeismographProps {
  chartData: ChartDataPoint[];
  currentMagnitude: number;
  isDarkMode?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataPoint }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const status = payload[0].payload.status || classifyMagnitude(value);

  return (
    <div className="rounded-lg border border-white/10 bg-surface p-3 shadow-xl">
      <p className="mb-1 text-xs text-gray-400">{label}</p>
      <p
        className="font-mono text-lg font-bold tabular-nums"
        style={{ color: getMagnitudeColor(value) }}
      >
        {value.toFixed(4)}
      </p>
      <p className="text-xs text-gray-500">m/s2 - {status}</p>
    </div>
  );
};

export function Seismograph({ chartData, currentMagnitude, isDarkMode = false }: SeismographProps) {
  const color = getMagnitudeColor(currentMagnitude);
  const currentStatus = classifyMagnitude(currentMagnitude);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "mb-6 rounded-xl p-5",
        isDarkMode ? "border border-white/10 bg-[#475569]/90" : "border border-slate-200 bg-white/90 shadow-sm"
      )}
    >
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-green/20 bg-accent-green/10">
            <Activity className="h-5 w-5 text-accent-green" />
          </div>
          <div>
            <h2 className={cn("text-base font-semibold", isDarkMode ? "text-white" : "text-slate-900")}>Live Seismograph</h2>
            <p className={cn("text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>
              Real-time magnitude waveform - last 100 readings
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <LegendItem color="#22C55E" label="Normal <10.5" isDarkMode={isDarkMode} />
          <LegendItem color="#F59E0B" label="Moderate <12" isDarkMode={isDarkMode} />
          <LegendItem color="#EF4444" label="Strong >=12" isDarkMode={isDarkMode} />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Current
        </span>
        <span className="font-mono text-3xl font-bold tabular-nums" style={{ color }}>
          {currentMagnitude.toFixed(4)}
        </span>
        <span className="text-sm text-gray-500">m/s2</span>
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        <span className="font-mono text-xs font-bold" style={{ color }}>
          {currentStatus}
        </span>
      </div>

      <div className="h-72">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-600">
            <p className="text-sm">Waiting for data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="seismoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
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
                tickFormatter={(value) => Number(value).toFixed(1)}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={10.5} stroke="#F59E0B" strokeDasharray="6 3" strokeOpacity={0.7} />
              <ReferenceLine y={12} stroke="#EF4444" strokeDasharray="6 3" strokeOpacity={0.75} />
              <Area
                type="monotone"
                dataKey="magnitude"
                stroke="none"
                fill="url(#seismoGrad)"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="magnitude"
                stroke={color}
                strokeWidth={2}
                dot={(props) => {
                  const point = props.payload as ChartDataPoint;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={2.5}
                      fill={getMagnitudeColor(point.magnitude)}
                      stroke="none"
                    />
                  );
                }}
                activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.section>
  );
}

function LegendItem({ color, label, isDarkMode = false }: { color: string; label: string; isDarkMode?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", isDarkMode ? "text-gray-400" : "text-slate-500")}>
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-xs">{label}</span>
    </div>
  );
}
