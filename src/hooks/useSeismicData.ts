"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ref, onValue, off, query, limitToLast, orderByKey } from "firebase/database";
import { db } from "@/lib/firebase";
import type { SeismicReading, SeismicHistoryEntry, ChartDataPoint } from "@/types";
import { formatTime } from "@/utils";
import { toast } from "sonner";

const MAX_CHART_POINTS = 100;
const MAX_HISTORY_DISPLAY = 500;

export function useSeismicData() {
  const [liveData, setLiveData] = useState<SeismicReading | null>(null);
  const [history, setHistory] = useState<SeismicHistoryEntry[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const prevStatusRef = useRef<string | null>(null);
  const isFirstLoad = useRef(true);

  const addChartPoint = useCallback((reading: SeismicReading) => {
    const point: ChartDataPoint = {
      time: formatTime(reading.timestamp || Date.now()),
      magnitude: reading.magnitude,
      x: reading.x,
      y: reading.y,
      z: reading.z,
      timestamp: reading.timestamp || Date.now(),
    };

    setChartData((prev) => {
      const next = [...prev, point];
      return next.length > MAX_CHART_POINTS
        ? next.slice(next.length - MAX_CHART_POINTS)
        : next;
    });
  }, []);

  useEffect(() => {
    // Live data listener
    const liveRef = ref(db, "/seismic/live");

    const unsubLive = onValue(
      liveRef,
      (snapshot) => {
        setIsConnected(true);
        setIsLoading(false);
        setError(null);

        const data = snapshot.val() as SeismicReading | null;
        if (data) {
          setLiveData(data);
          setLastUpdate(new Date());
          addChartPoint(data);

          // Alert on status change
          if (!isFirstLoad.current && prevStatusRef.current !== data.status) {
            if (data.status === "STRONG") {
              toast.error("⚠️ STRONG seismic activity detected!", {
                duration: 5000,
              });
            } else if (data.status === "MODERATE") {
              toast.warning("⚡ Moderate seismic activity detected", {
                duration: 4000,
              });
            } else if (
              prevStatusRef.current === "STRONG" ||
              prevStatusRef.current === "MODERATE"
            ) {
              toast.success("✓ Seismic activity returned to normal", {
                duration: 3000,
              });
            }
          }
          prevStatusRef.current = data.status;
          isFirstLoad.current = false;
        }
      },
      (err) => {
        setIsConnected(false);
        setIsLoading(false);
        setError(err.message);
        toast.error("Firebase connection error: " + err.message);
      }
    );

    // History listener
    const historyRef = query(
      ref(db, "/seismic/history"),
      orderByKey(),
      limitToLast(MAX_HISTORY_DISPLAY)
    );

    const unsubHistory = onValue(
      historyRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const entries: SeismicHistoryEntry[] = Object.entries(data).map(
            ([id, val]) => ({
              id,
              ...(val as SeismicReading),
            })
          );
          entries.sort((a, b) => b.timestamp - a.timestamp);
          setHistory(entries);
        }
      },
      (err) => {
        console.error("History error:", err);
      }
    );

    // Cleanup
    return () => {
      off(liveRef);
      off(historyRef);
      unsubLive();
      unsubHistory();
    };
  }, [addChartPoint]);

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
