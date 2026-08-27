"use client";

import { useMemo, useState } from "react";
import { BarChart3, BookOpen, FileText, House, Moon, PanelLeftClose, Settings, SunMedium, Users, Zap } from "lucide-react";
import type { User } from "firebase/auth";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSeismicData } from "@/hooks/useSeismicData";
import { Header } from "@/components/dashboard/Header";
import { KPICards } from "@/components/dashboard/KPICards";
import { Seismograph } from "@/components/charts/Seismograph";
import { XYZChart } from "@/components/charts/XYZChart";
import { MagnitudeHistory } from "@/components/charts/MagnitudeHistory";
import { EventTable } from "@/components/dashboard/EventTable";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { LoadingScreen } from "@/components/dashboard/LoadingScreen";
import { ErrorBanner } from "@/components/dashboard/ErrorBanner";
import { SensorStatusPanel } from "@/components/dashboard/SensorStatusPanel";
import { AdminToasts } from "@/components/dashboard/AdminToasts";
import type { AdminToast, AlertEvent, SensorWithState } from "@/types";
import { cn } from "@/utils";

interface DashboardProps {
  role?: "public" | "admin";
  user?: User | null;
  sensors?: SensorWithState[];
  sensorNow?: number;
  alerts?: AlertEvent[];
  toasts?: AdminToast[];
  onDismissToast?: (id: string) => void;
  onLogout?: () => void;
}

export default function Dashboard({
  role = "public",
  user,
  sensors = [],
  sensorNow = Date.now(),
  alerts = [],
  toasts = [],
  onDismissToast,
  onLogout,
}: DashboardProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    liveData,
    history,
    chartData,
    isConnected,
    isLoading,
    error,
    lastUpdate,
  } = useSeismicData();

  const trendData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthTotals = new Map<string, number>();

    monthNames.forEach((month) => monthTotals.set(month, 0));

    history.forEach((entry) => {
      const monthIndex = new Date(entry.timestamp).getMonth();
      const key = monthNames[monthIndex];
      if (key) monthTotals.set(key, (monthTotals.get(key) ?? 0) + 1);
    });

    return monthNames.map((month) => ({
      month,
      count: monthTotals.get(month) ?? 0,
    }));
  }, [history]);

  const navItems = [
    { label: "Reports", icon: FileText, active: true },
    { label: "Library", icon: BookOpen },
    { label: "People", icon: Users },
    { label: "Activities", icon: BarChart3 },
    { label: "Support", icon: Zap },
    { label: "Get Started", icon: House },
    { label: "Settings", icon: Settings },
  ];

  const themeClasses = isDarkMode
    ? "bg-slate-950 text-slate-100"
    : "bg-[#edf2f7] text-slate-900";

  const cardClasses = isDarkMode
    ? "border border-white/10 bg-[#475569]/90 text-slate-100"
    : "border border-slate-200 bg-[#f8fafc] text-slate-800 shadow-sm";

  const downloadHistory = () => {
    if (typeof window === "undefined") return;
    const csv = [
      ["Timestamp", "Magnitude", "Status", "X", "Y", "Z"],
      ...history.map((entry) => [
        new Date(entry.timestamp).toISOString(),
        entry.magnitude.toFixed(4),
        entry.status,
        entry.x.toFixed(4),
        entry.y.toFixed(4),
        entry.z.toFixed(4),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seismic-events-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <main className={cn("min-h-screen transition-colors duration-300", themeClasses)}>
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {role === "admin" && (
          <aside
            className={cn(
              "hidden w-[220px] shrink-0 border-r p-5 lg:flex lg:flex-col",
              isDarkMode ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-white/90"
            )}
          >
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xl font-black tracking-tight">
                <span className="text-rose-500">S</span>
                <span className={cn(isDarkMode ? "text-white" : "text-slate-800")}>EIS</span>
              </div>
              <button
                type="button"
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  isDarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-1.5">
              {navItems.map(({ label, icon: Icon, active }) => (
                <button
                  key={label}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    active
                      ? isDarkMode
                        ? "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20"
                        : "bg-sky-100 text-sky-700 ring-1 ring-sky-200"
                      : isDarkMode
                        ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>

            <div className="mt-auto space-y-3 pt-6">
              <button
                type="button"
                onClick={() => setIsDarkMode((current) => !current)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isDarkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                <span>Theme</span>
                <span className="inline-flex items-center gap-2">
                  {isDarkMode ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
                  {isDarkMode ? "Dark" : "Light"}
                </span>
              </button>
            </div>
          </aside>
        )}

        <div className="flex-1">
          {error && <ErrorBanner error={error} />}

          <Header
            isConnected={isConnected}
            lastUpdate={lastUpdate}
            role={role}
            user={user}
            sensors={sensors}
            alerts={alerts}
            onLogout={onLogout}
            onDownload={role === "admin" ? downloadHistory : undefined}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode((current) => !current)}
          />

          <div className="space-y-6 p-4 md:p-6">
            <KPICards
              liveData={liveData}
              history={history}
              isConnected={isConnected}
              isLoading={isLoading}
              isDarkMode={isDarkMode}
            />

            {role === "admin" && <SensorStatusPanel sensors={sensors} now={sensorNow} isDarkMode={isDarkMode} />}

            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
              <section className={cn("rounded-2xl p-5 shadow-sm", cardClasses)}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">All-time trend</p>
                    <h2 className="mt-1 text-xl font-semibold">Activity overview</h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200/60 bg-slate-100/70 px-2.5 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                    Monthly
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} barGap={8}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.08)"} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: isDarkMode ? "#94a3b8" : "#475569", fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: isDarkMode ? "#94a3b8" : "#475569", fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: isDarkMode ? "rgba(148,163,184,0.06)" : "rgba(15,23,42,0.05)" }}
                        contentStyle={{
                          background: isDarkMode ? "#0f172a" : "#fff",
                          border: isDarkMode ? "1px solid rgba(148,163,184,0.2)" : "1px solid rgba(148,163,184,0.5)",
                          borderRadius: 12,
                          color: isDarkMode ? "#e2e8f0" : "#0f172a",
                        }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#4f9cf7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <div className={cn("rounded-2xl p-5 shadow-sm", cardClasses)}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Live output</p>
                    <p className="mt-1 font-mono text-2xl font-bold">{liveData ? liveData.magnitude.toFixed(3) : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Connection</p>
                    <p className={cn("mt-1 text-lg font-semibold", isConnected ? "text-emerald-500" : "text-red-500")}>{isConnected ? "Live" : "Offline"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Last update</p>
                    <p className="mt-1 font-mono text-sm">{lastUpdate?.toLocaleTimeString() ?? "Waiting for readings"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Seismograph chartData={chartData} currentMagnitude={liveData?.magnitude ?? 0} isDarkMode={isDarkMode} />

            <div className="mb-6 grid gap-6 xl:grid-cols-2">
              <XYZChart chartData={chartData} isDarkMode={isDarkMode} />
              <MagnitudeHistory history={history} isDarkMode={isDarkMode} />
            </div>

            <AnalyticsPanel history={history} isDarkMode={isDarkMode} />

            <EventTable history={history} isDarkMode={isDarkMode} />

            {role === "admin" && onDismissToast && (
              <AdminToasts toasts={toasts} onDismiss={onDismissToast} />
            )}

            <footer className={cn("border-t py-6 text-center font-mono text-xs", isDarkMode ? "border-white/5 text-gray-700" : "border-slate-200 text-slate-500")}>
              Solar-Powered IoT Seismic Intensity Monitoring and Early Warning System
              {" - "}
              ESP32 + MPU6050 + Firebase RTDB
              {" - "}
              Capstone Research Project
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
