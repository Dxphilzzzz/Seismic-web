"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Bell, ShieldAlert } from "lucide-react";
import { getAlertLevel } from "@/utils";
import type { SeismicReading } from "@/types";

interface AlertPanelProps {
  liveData: SeismicReading | null;
}

export function AlertPanel({ liveData }: AlertPanelProps) {
  const magnitude = liveData?.magnitude ?? 0;
  const alert = getAlertLevel(magnitude);

  const Icon =
    alert.level === "HIGH"
      ? ShieldAlert
      : alert.level === "MODERATE"
      ? AlertTriangle
      : CheckCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card rounded-2xl p-5 mb-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center">
          <Bell className="w-5 h-5 text-accent-red" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Alert Center</h2>
          <p className="text-xs text-gray-500">
            Automated seismic threshold monitoring
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={alert.level}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border p-5 relative overflow-hidden"
          style={{
            borderColor: `${alert.color}30`,
            background: `${alert.color}08`,
          }}
        >
          {/* BG radial */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(ellipse at center, ${alert.color} 0%, transparent 70%)`,
            }}
          />

          <div className="relative flex items-center gap-5">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                alert.level === "HIGH" ? "alert-strong" : ""
              }`}
              style={{ background: `${alert.color}15`, border: `2px solid ${alert.color}40` }}
            >
              <Icon className="w-8 h-8" style={{ color: alert.color }} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3
                  className="text-xl font-bold font-mono tracking-wide"
                  style={{ color: alert.color }}
                >
                  {alert.message}
                </h3>
                <span
                  className="px-2 py-0.5 rounded text-xs font-mono font-bold border"
                  style={{
                    color: alert.color,
                    borderColor: `${alert.color}40`,
                    background: `${alert.color}10`,
                  }}
                >
                  {alert.level}
                </span>
              </div>
              <p className="text-sm text-gray-400">{alert.description}</p>
            </div>

            {/* Magnitude readout */}
            <div
              className="flex-shrink-0 text-right hidden md:block"
              style={{ color: alert.color }}
            >
              <p className="text-xs text-gray-500 mb-1 font-mono uppercase tracking-widest">
                Magnitude
              </p>
              <p className="text-4xl font-mono font-bold tabular-nums">
                {magnitude.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Threshold reference */}
          <div className="relative mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
            {[
              { label: "WEAK", range: "< 10.5", color: "#10B981", active: alert.level === "NORMAL" },
              { label: "MODERATE", range: "10.5 – 12", color: "#F59E0B", active: alert.level === "MODERATE" },
              { label: "STRONG", range: "≥ 12", color: "#EF4444", active: alert.level === "HIGH" },
            ].map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{
                  background: t.active ? `${t.color}12` : "transparent",
                  border: t.active ? `1px solid ${t.color}30` : "1px solid transparent",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: t.color }}
                />
                <div>
                  <p
                    className="text-xs font-mono font-bold"
                    style={{ color: t.active ? t.color : "#6B7280" }}
                  >
                    {t.label}
                  </p>
                  <p className="text-xs text-gray-600">{t.range}</p>
                </div>
                {t.active && (
                  <span
                    className="ml-auto text-xs font-mono"
                    style={{ color: t.color }}
                  >
                    ACTIVE
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
