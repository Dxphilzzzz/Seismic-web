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
  status?: IntensityStatus;
}

export interface SensorNode {
  id: string;
  name: string;
  lastSeen: number;
  online: boolean;
  batteryVoltage: number;
  solarVoltage: number;
  firmware: string;
}

export interface SensorWithState extends SensorNode {
  computedOnline: boolean;
  unreachable: boolean;
  ageMs: number;
}

export interface AlertEvent {
  id: string;
  sensorId: string;
  sensorName?: string;
  type: "offline" | "recovered";
  timestamp: number;
}

export interface AdminToast {
  id: string;
  sensorId: string;
  message: string;
  type: "offline" | "recovered";
  timestamp: number;
}

export type AnnouncementTone = "info" | "maintenance" | "warning";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  tone: AnnouncementTone;
  active: boolean;
  createdAt: number;
  createdBy: string;
}

export interface ActivityLogEntry {
  id: string;
  type:
    "announcement_created" | "announcement_updated" | "announcement_removed";
  message: string;
  timestamp: number;
  actor: string;
}
