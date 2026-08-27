"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ref, onValue, off, push, set, query, orderByChild, limitToLast } from "firebase/database";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import type { AdminToast, AlertEvent, SensorWithState } from "@/types";
import { normalizeTimestamp } from "@/utils";

export function useAdminAlerts(sensors: SensorWithState[], user: User | null) {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const previousStates = useRef<Record<string, boolean>>({});
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!user || !db) {
      setAlerts([]);
      return;
    }

    const database = db;
    const alertsRef = query(ref(database, "/alerts"), orderByChild("timestamp"), limitToLast(50));
    const unsub = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Omit<AlertEvent, "id">> | null;
      const nextAlerts = data
        ? Object.entries(data)
            .map(([id, alert]) => ({
              id,
              sensorId: alert.sensorId,
              sensorName: alert.sensorName,
              type: alert.type,
              timestamp: normalizeTimestamp(alert.timestamp),
            }))
            .sort((a, b) => b.timestamp - a.timestamp)
        : [];
      setAlerts(nextAlerts);
    });

    return () => {
      off(alertsRef);
      unsub();
    };
  }, [user]);

  useEffect(() => {
    if (!user || !db || sensors.length === 0) return;

    const database = db;
    const previous = previousStates.current;
    const initialRun = !hasInitialized.current;
    const nextStates: Record<string, boolean> = {};

    sensors.forEach((sensor) => {
      const currentlyOnline = sensor.computedOnline;
      const wasOnline = previous[sensor.id];
      nextStates[sensor.id] = currentlyOnline;

      if (initialRun || wasOnline === undefined || wasOnline === currentlyOnline) {
        return;
      }

      const type: AlertEvent["type"] = currentlyOnline ? "recovered" : "offline";
      const timestamp = Date.now();
      const message =
        type === "offline"
          ? `Sensor ${sensor.name} unreachable`
          : `Sensor ${sensor.name} recovered`;

      const alertRef = push(ref(database, "/alerts"));
      void set(alertRef, {
        sensorId: sensor.id,
        sensorName: sensor.name,
        type,
        timestamp,
      });

      setToasts((current) => [
        ...current,
        {
          id: `${sensor.id}-${type}-${timestamp}`,
          sensorId: sensor.id,
          message,
          type,
          timestamp,
        },
      ]);
    });

    previousStates.current = nextStates;
    hasInitialized.current = true;
  }, [sensors, user]);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  }, []);

  return { alerts, toasts, dismissToast };
}
