"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-accent-blue/30 border-t-accent-blue"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="h-7 w-7 text-accent-blue" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="mb-1 text-lg font-bold text-white">Connecting to Firebase</h2>
          <p className="font-mono text-sm text-gray-500">
            Seismic Monitoring System - Initializing...
          </p>
        </div>

        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="w-1.5 rounded-full bg-accent-blue"
              animate={{ height: ["8px", "24px", "8px"] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.12 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
