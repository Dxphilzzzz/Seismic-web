import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import type {
  SeismicHistoryEntry,
  AlertLevel,
  AnalyticsData,
  IntensityStatus,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: number): string {
  try {
    return format(new Date(timestamp), "MMM dd, yyyy HH:mm:ss");
  } catch {
    return "—";
  }
}

export function formatTime(timestamp: number): string {
  try {
    return format(new Date(timestamp), "HH:mm:ss");
  } catch {
    return "—";
  }
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
  if (magnitude >= 12) return "#EF4444";
  if (magnitude >= 10.5) return "#F59E0B";
  return "#10B981";
}

export function getAlertLevel(magnitude: number): AlertLevel {
  if (magnitude >= 12) {
    return {
      level: "HIGH",
      message: "HIGH SEISMIC ACTIVITY DETECTED",
      description:
        "Strong seismic waves recorded. Immediate attention required. Alert all monitoring personnel.",
      color: "#EF4444",
    };
  }
  if (magnitude >= 10.5) {
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
    color: "#10B981",
  };
}

export function computeAnalytics(
  history: SeismicHistoryEntry[]
): AnalyticsData {
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
  const todayEvents = history.filter((h) => h.timestamp > oneDayAgo);

  const oneHourAgo = now - 60 * 60 * 1000;
  const hourEvents = history.filter((h) => h.timestamp > oneHourAgo);

  const statusCounts = history.reduce(
    (acc, h) => {
      acc[h.status] = (acc[h.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const mostFrequent = Object.entries(statusCounts).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] as IntensityStatus || "WEAK";

  return {
    averageMagnitude: avg,
    peakMagnitude: peak,
    lowestMagnitude: lowest,
    dailyEventCount: todayEvents.length,
    eventsPerHour: hourEvents.length,
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
  const blob = new Blob([csv], { type: "text/csv" });
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
