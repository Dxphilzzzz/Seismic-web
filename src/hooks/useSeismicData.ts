"use client";

import { useEffect, useMemo, useState } from "react";
import { ref, onValue, off, query, limitToLast, orderByKey } from "firebase/database";
import { db } from "@/lib/firebase";
import type { SeismicReading, SeismicHistoryEntry, ChartDataPoint } from "@/types";
import { classifyMagnitude, formatTime, normalizeTimestamp } from "@/utils";

const MAX_CHART_POINTS = 100;
const MAX_HISTORY_DISPLAY = 500;

function normalizeReading(id: string, value: Partial<SeismicReading>): SeismicHistoryEntry {
  const magnitude = Number(value.magnitude ?? 0);

  return {
    id,
    timestamp: normalizeTimestamp(value.timestamp),
    magnitude,
    x: Number(value.x ?? 0),
    y: Number(value.y ?? 0),
    z: Number(value.z ?? 0),
    status: value.status ?? classifyMagnitude(magnitude),
  };
}

export function useSeismicData() {
  const [history, setHistory] = useState<SeismicHistoryEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const connectedRef = ref(db, ".info/connected");
    const readingsRef = query(ref(db, "/readings"), orderByKey(), limitToLast(MAX_HISTORY_DISPLAY));

    const unsubConnected = onValue(connectedRef, (snapshot) => {
      setIsConnected(Boolean(snapshot.val()));
    });

    const unsubReadings = onValue(
      readingsRef,
      (snapshot) => {
        setIsLoading(false);
        setError(null);

        const data = snapshot.val() as Record<string, Partial<SeismicReading>> | null;
        const entries = data
          ? Object.entries(data)
              .map(([id, value]) => normalizeReading(id, value))
              .sort((a, b) => b.timestamp - a.timestamp)
          : [];

        setHistory(entries);
        if (entries[0]) setLastUpdate(new Date(entries[0].timestamp));
      },
      (err) => {
        setIsLoading(false);
        setError(err.message);
      }
    );

    return () => {
      off(connectedRef);
      off(readingsRef);
      unsubConnected();
      unsubReadings();
    };
  }, []);

  const liveData = history[0] ?? null;

  const chartData = useMemo<ChartDataPoint[]>(
    () =>
      [...history]
        .reverse()
        .slice(-MAX_CHART_POINTS)
        .map((reading) => ({
          time: formatTime(reading.timestamp),
          magnitude: reading.magnitude,
          x: reading.x,
          y: reading.y,
          z: reading.z,
          timestamp: reading.timestamp,
          status: reading.status,
        })),
    [history]
  );

  return {
    liveData,
    history,
    chartData,
    isConnected,
    isLoading,
    error,
    lastUpdate,
  };
}
