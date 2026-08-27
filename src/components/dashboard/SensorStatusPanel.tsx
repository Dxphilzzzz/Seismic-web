"use client";

import { motion } from "framer-motion";
import { Battery, Cpu, RadioTower, Sun } from "lucide-react";
import type { SensorWithState } from "@/types";
import { cn, formatRelativeTime } from "@/utils";

interface SensorStatusPanelProps {
  sensors: SensorWithState[];
  now: number;
  isDarkMode?: boolean;
}

export function SensorStatusPanel({ sensors, now, isDarkMode = false }: SensorStatusPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className={cn(
        "mb-6 rounded-xl p-5",
        isDarkMode ? "border border-white/10 bg-[#475569]/90" : "border border-slate-200 bg-white/90 shadow-sm"
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-green/20 bg-accent-green/10">
          <RadioTower className="h-5 w-5 text-accent-green" />
        </div>
        <div>
          <h2 className={cn("text-base font-semibold", isDarkMode ? "text-white" : "text-slate-900")}>Sensor Status</h2>
          <p className={cn("text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>Live connectivity for all registered nodes</p>
        </div>
      </div>

      {sensors.length === 0 ? (
        <div className={cn("rounded-xl border p-6 text-center text-sm", isDarkMode ? "border-white/5 bg-slate-900/40 text-gray-500" : "border-slate-200 bg-slate-50 text-slate-500")}>
          No registered sensor nodes found in /sensors.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sensors.map((sensor) => {
            const unreachable = sensor.unreachable;
            return (
              <div
                key={sensor.id}
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  isDarkMode
                    ? unreachable
                      ? "border-accent-red/40 bg-slate-900/55 shadow-glow-red"
                      : "border-white/5 bg-slate-900/40"
                    : unreachable
                      ? "border-red-200 bg-red-50 shadow-sm"
                      : "border-slate-200 bg-slate-50"
                )}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={cn("truncate text-sm font-semibold", isDarkMode ? "text-white" : "text-slate-900")}>{sensor.name}</p>
                    <p className={cn("truncate font-mono text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>{sensor.id}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] font-bold",
                      unreachable
                        ? "border-accent-red/30 bg-accent-red/10 text-accent-red"
                        : "border-accent-green/30 bg-accent-green/10 text-accent-green"
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        unreachable ? "bg-accent-red" : "bg-accent-green status-dot"
                      )}
                    />
                    {unreachable ? "UNREACHABLE" : "ONLINE"}
                  </span>
                </div>

                <p className={cn("mb-4 font-mono text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>
                  Last seen: {formatRelativeTime(sensor.lastSeen, now)}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className={cn("rounded-lg border p-3", isDarkMode ? "border-white/5 bg-[#0d1220]/70" : "border-slate-200 bg-white")}>
                    <div className={cn("mb-1 flex items-center gap-2 text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>
                      <Battery className="h-3.5 w-3.5 text-accent-green" />
                      Battery
                    </div>
                    <p className="font-mono text-lg font-bold text-accent-green">
                      {sensor.batteryVoltage.toFixed(2)}V
                    </p>
                  </div>
                  <div className={cn("rounded-lg border p-3", isDarkMode ? "border-white/5 bg-[#0d1220]/70" : "border-slate-200 bg-white")}>
                    <div className={cn("mb-1 flex items-center gap-2 text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>
                      <Sun className="h-3.5 w-3.5 text-accent-yellow" />
                      Solar
                    </div>
                    <p className="font-mono text-lg font-bold text-accent-yellow">
                      {sensor.solarVoltage.toFixed(2)}V
                    </p>
                  </div>
                </div>

                <div className={cn("mt-3 flex items-center gap-2 text-xs", isDarkMode ? "text-gray-600" : "text-slate-500")}>
                  <Cpu className="h-3.5 w-3.5" />
                  <span className="font-mono">Firmware {sensor.firmware}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
