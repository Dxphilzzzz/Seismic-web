import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import type {
  SeismicHistoryEntry,
  AlertLevel,
  AnalyticsData,
  IntensityStatus,
} from "@/types";

export const SENSOR_TIMEOUT_MS = 60_000;
export const NORMAL_THRESHOLD = 10.5;
export const STRONG_THRESHOLD = 12;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeTimestamp(timestamp: number | undefined | null): number {
  if (!timestamp || Number.isNaN(timestamp)) return Date.now();
  return timestamp < 10_000_000_000 ? timestamp * 1000 : timestamp;
}

export function classifyMagnitude(magnitude: number): IntensityStatus {
  if (magnitude >= STRONG_THRESHOLD) return "STRONG";
  if (magnitude >= NORMAL_THRESHOLD) return "MODERATE";
  return "WEAK";
}

export function formatTimestamp(timestamp: number): string {
  try {
    return format(new Date(normalizeTimestamp(timestamp)), "MMM dd, yyyy HH:mm:ss");
  } catch {
    return "-";
  }
}

export function formatTime(timestamp: number): string {
  try {
    return format(new Date(normalizeTimestamp(timestamp)), "HH:mm:ss");
  } catch {
    return "-";
  }
}

export function formatRelativeTime(timestamp: number, now = Date.now()): string {
  const diff = Math.max(0, now - normalizeTimestamp(timestamp));
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function getStatusColor(status: IntensityStatus): string {
  switch (status) {
    case "WEAK":
      return "text-accent-green";
    case "MODERATE":
      return "text-accent-yellow";
    case "STRONG":
      return "text-accent-red";
    default:
      return "text-white";
  }
}

export function getStatusBg(status: IntensityStatus): string {
  switch (status) {
    case "WEAK":
      return "bg-accent-green/10 border-accent-green/30 text-accent-green";
    case "MODERATE":
      return "bg-accent-yellow/10 border-accent-yellow/30 text-accent-yellow";
    case "STRONG":
      return "bg-accent-red/10 border-accent-red/30 text-accent-red";
    default:
      return "bg-white/10 border-white/20 text-white";
  }
}

export function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= STRONG_THRESHOLD) return "#EF4444";
  if (magnitude >= NORMAL_THRESHOLD) return "#F59E0B";
  return "#22C55E";
}

export function getAlertLevel(magnitude: number): AlertLevel {
  if (magnitude >= STRONG_THRESHOLD) {
    return {
      level: "HIGH",
      message: "HIGH SEISMIC ACTIVITY DETECTED",
      description:
        "Strong seismic waves recorded. Immediate attention required. Alert all monitoring personnel.",
      color: "#EF4444",
    };
  }
  if (magnitude >= NORMAL_THRESHOLD) {
    return {
      level: "MODERATE",
      message: "MODERATE SEISMIC ACTIVITY",
      description:
        "Elevated seismic activity detected. Monitor situation closely for escalation.",
      color: "#F59E0B",
    };
  }
  return {
    level: "NORMAL",
    message: "NORMAL CONDITIONS",
    description:
      "All seismic readings within normal parameters. System operating nominally.",
    color: "#22C55E",
  };
}

export function computeAnalytics(history: SeismicHistoryEntry[]): AnalyticsData {
  if (history.length === 0) {
    return {
      averageMagnitude: 0,
      peakMagnitude: 0,
      lowestMagnitude: 0,
      dailyEventCount: 0,
      eventsPerHour: 0,
      mostFrequentIntensity: "WEAK",
    };
  }

  const magnitudes = history.map((h) => h.magnitude);
  const avg = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const peak = Math.max(...magnitudes);
  const lowest = Math.min(...magnitudes);
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneHourAgo = now - 60 * 60 * 1000;

  const statusCounts = history.reduce(
    (acc, h) => {
      const status = h.status || classifyMagnitude(h.magnitude);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<IntensityStatus, number>
  );

  const mostFrequent =
    (Object.entries(statusCounts).sort(([, a], [, b]) => b - a)[0]?.[0] as
      | IntensityStatus
      | undefined) || "WEAK";

  return {
    averageMagnitude: avg,
    peakMagnitude: peak,
    lowestMagnitude: lowest,
    dailyEventCount: history.filter((h) => normalizeTimestamp(h.timestamp) > oneDayAgo).length,
    eventsPerHour: history.filter((h) => normalizeTimestamp(h.timestamp) > oneHourAgo).length,
    mostFrequentIntensity: mostFrequent,
  };
}

export function exportCSV(data: SeismicHistoryEntry[]): void {
  const headers = ["Timestamp", "Magnitude", "Status", "X", "Y", "Z"];
  const rows = data.map((d) => [
    formatTimestamp(d.timestamp),
    d.magnitude.toFixed(4),
    d.status,
    d.x.toFixed(4),
    d.y.toFixed(4),
    d.z.toFixed(4),
  ]);

  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seismic-events-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportExcel(data: SeismicHistoryEntry[]): Promise<void> {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.json_to_sheet(
    data.map((d) => ({
      Timestamp: formatTimestamp(d.timestamp),
      Magnitude: d.magnitude,
      Status: d.status,
      X: d.x,
      Y: d.y,
      Z: d.z,
    }))
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Seismic Events");
  XLSX.writeFile(
    wb,
    `seismic-events-${format(new Date(), "yyyyMMdd-HHmmss")}.xlsx`
  );
}
