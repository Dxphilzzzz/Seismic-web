"use client";

import { motion } from "framer-motion";
import { Activity, Satellite, Wifi, WifiOff, Clock, Calendar } from "lucide-react";
import { useClock } from "@/hooks/useClock";
import { cn } from "@/utils";

interface HeaderProps {
  isConnected: boolean;
  lastUpdate: Date | null;
}

export function Header({ isConnected, lastUpdate }: HeaderProps) {
  const { time, date } = useClock();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-5 mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Title */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-accent-blue" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-accent-blue/70 tracking-widest uppercase">
                Capstone Research Project
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-white leading-tight">
              Solar-Powered IoT Seismic Intensity Monitoring
              <br className="hidden md:block" />
              <span className="text-accent-blue"> and Early Warning System</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-Time Seismic Monitoring and Early Warning Dashboard
            </p>
          </div>
        </div>

        {/* Right: Status & Time */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          {/* Connection Status */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium",
            isConnected
              ? "bg-accent-green/10 border-accent-green/30 text-accent-green"
              : "bg-accent-red/10 border-accent-red/30 text-accent-red"
          )}>
            {isConnected ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span className="font-mono text-xs">
              {isConnected ? "LIVE" : "OFFLINE"}
            </span>
            {isConnected && (
              <span className="w-2 h-2 rounded-full bg-accent-green status-dot" />
            )}
          </div>

          {/* Satellite icon */}
          <div className="flex items-center gap-2 text-gray-400">
            <Satellite className="w-4 h-4 text-accent-blue" />
            <span className="text-xs font-mono text-gray-500">ESP32</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 text-accent-blue/60" />
            <span className="text-sm font-mono">{date}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-blue/60" />
            <span className="text-xl font-mono font-bold text-accent-blue tabular-nums">
              {time}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      {lastUpdate && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-gray-600 font-mono">
            MPU6050 Accelerometer • Firebase RTDB • ESP32 WROOM
          </span>
          <span className="text-xs text-gray-600 font-mono">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      )}
    </motion.header>
  );
}
