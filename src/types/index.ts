export interface SeismicReading {
  magnitude: number;
  status: "WEAK" | "MODERATE" | "STRONG";
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface SeismicHistoryEntry extends SeismicReading {
  id: string;
}

export type IntensityStatus = "WEAK" | "MODERATE" | "STRONG";

export interface AlertLevel {
  level: "NORMAL" | "MODERATE" | "HIGH";
  message: string;
  description: string;
  color: string;
}

export interface AnalyticsData {
  averageMagnitude: number;
  peakMagnitude: number;
  lowestMagnitude: number;
  dailyEventCount: number;
  eventsPerHour: number;
  mostFrequentIntensity: IntensityStatus;
}

export interface ChartDataPoint {
  time: string;
  magnitude: number;
  x: number;
  y: number;
  z: number;
  timestamp: number;
}
