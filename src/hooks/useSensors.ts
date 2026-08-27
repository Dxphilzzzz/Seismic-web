"use client";

import { useEffect, useMemo, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase";
import type { SensorNode, SensorWithState } from "@/types";
import { normalizeTimestamp, SENSOR_TIMEOUT_MS } from "@/utils";

export function useSensors() {
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const sensorsRef = ref(db, "/sensors");
    const unsub = onValue(
      sensorsRef,
      (snapshot) => {
        const data = snapshot.val() as Record<string, Omit<SensorNode, "id">> | null;
        setSensors(
          data
            ? Object.entries(data)
                .map(([id, value]) => ({
                  id,
                  name: value.name || id,
                  lastSeen: normalizeTimestamp(value.lastSeen),
                  online: Boolean(value.online),
                  batteryVoltage: Number(value.batteryVoltage ?? 0),
                  solarVoltage: Number(value.solarVoltage ?? 0),
                  firmware: value.firmware || "-",
                }))
                .sort((a, b) => a.name.localeCompare(b.name))
            : []
        );
        setError(null);
      },
      (err) => setError(err.message)
    );

    return () => {
      off(sensorsRef);
      unsub();
    };
  }, []);

  const sensorStates = useMemo<SensorWithState[]>(
    () =>
      sensors.map((sensor) => {
        const ageMs = Math.max(0, now - normalizeTimestamp(sensor.lastSeen));
        const computedOnline = ageMs <= SENSOR_TIMEOUT_MS;
        return {
          ...sensor,
          ageMs,
          computedOnline,
          unreachable: !computedOnline,
        };
      }),
    [sensors, now]
  );

  return { sensors: sensorStates, now, error };
}
