"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Animated icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl border-2 border-accent-blue/30 border-t-accent-blue flex items-center justify-center"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-7 h-7 text-accent-blue" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-white mb-1">
            Connecting to Firebase
          </h2>
          <p className="text-sm text-gray-500 font-mono">
            Seismic Monitoring System — Initializing...
          </p>
        </div>

        {/* Pulse bars */}
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-accent-blue"
              animate={{ height: ["8px", "24px", "8px"] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.12,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
