"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";

interface ErrorBannerProps {
  error: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-4 rounded-xl bg-accent-red/10 border border-accent-red/30 flex items-center gap-3"
    >
      <WifiOff className="w-5 h-5 text-accent-red flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-accent-red">Firebase Connection Error</p>
        <p className="text-xs text-gray-400 truncate">{error}</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red/20 border border-accent-red/30 text-accent-red text-xs hover:bg-accent-red/30 transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        Retry
      </button>
    </motion.div>
  );
}
