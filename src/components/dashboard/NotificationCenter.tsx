"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCircle2, CircleAlert } from "lucide-react";
import type { AlertEvent, SensorWithState } from "@/types";
import { cn, formatTimestamp } from "@/utils";

interface NotificationCenterProps {
  alerts: AlertEvent[];
  sensors: SensorWithState[];
}

export function NotificationCenter({ alerts, sensors }: NotificationCenterProps) {
  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(
    () => sensors.filter((sensor) => sensor.unreachable).length,
    [sensors]
  );

  const latestSensorState = (sensorId: string) =>
    sensors.find((sensor) => sensor.id === sensorId)?.unreachable ? "Still down" : "Recovered";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-surface-light/70 text-gray-300 transition-colors hover:border-accent-blue/40 hover:text-white"
        aria-label="Open notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full border border-[#0a0e1a] bg-accent-red px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#131826] p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <p className="text-sm font-semibold text-white">Notifications</p>
              <p className="text-xs text-gray-500">{unreadCount} active sensor alerts</p>
            </div>
            <span className="rounded-md border border-accent-blue/30 bg-accent-blue/10 px-2 py-1 font-mono text-xs text-accent-blue">
              {alerts.length}
            </span>
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="rounded-lg border border-white/5 bg-surface-light/40 p-4 text-sm text-gray-500">
                No alert events yet.
              </div>
            ) : (
              alerts.map((alert) => {
                const offline = alert.type === "offline";
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "rounded-lg border p-3",
                      offline
                        ? "border-accent-red/20 bg-accent-red/5"
                        : "border-accent-green/20 bg-accent-green/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {offline ? (
                        <CircleAlert className="mt-0.5 h-4 w-4 text-accent-red" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent-green" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {alert.sensorName || alert.sensorId}
                        </p>
                        <p className="font-mono text-xs text-gray-500">
                          {offline ? "Went offline" : "Recovered"} at {formatTimestamp(alert.timestamp)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded border px-2 py-0.5 text-[10px] font-bold uppercase",
                          latestSensorState(alert.sensorId) === "Still down"
                            ? "border-accent-red/30 bg-accent-red/10 text-accent-red"
                            : "border-accent-green/30 bg-accent-green/10 text-accent-green"
                        )}
                      >
                        {latestSensorState(alert.sensorId)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
