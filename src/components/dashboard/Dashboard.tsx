"use client";

import { useSeismicData } from "@/hooks/useSeismicData";
import { Header } from "@/components/dashboard/Header";
import { KPICards } from "@/components/dashboard/KPICards";
import { Seismograph } from "@/components/charts/Seismograph";
import { XYZChart } from "@/components/charts/XYZChart";
import { MagnitudeHistory } from "@/components/charts/MagnitudeHistory";
import { EventTable } from "@/components/dashboard/EventTable";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { LoadingScreen } from "@/components/dashboard/LoadingScreen";
import { ErrorBanner } from "@/components/dashboard/ErrorBanner";

export default function Dashboard() {
  const {
    liveData,
    history,
    chartData,
    isConnected,
    isLoading,
    error,
    lastUpdate,
  } = useSeismicData();

  if (isLoading) return <LoadingScreen />;

  return (
    <main className="min-h-screen px-4 py-6 max-w-screen-2xl mx-auto">
      {error && <ErrorBanner error={error} />}

      <Header isConnected={isConnected} lastUpdate={lastUpdate} />

      <KPICards
        liveData={liveData}
        history={history}
        isConnected={isConnected}
        isLoading={isLoading}
      />

      <Seismograph
        chartData={chartData}
        currentMagnitude={liveData?.magnitude ?? 0}
      />

      <div className="grid xl:grid-cols-2 gap-6 mb-6">
        <XYZChart chartData={chartData} />
        <MagnitudeHistory history={history} />
      </div>

      <AlertPanel liveData={liveData} />

      <AnalyticsPanel history={history} />

      <EventTable history={history} />

      <footer className="text-center py-6 text-xs text-gray-700 font-mono border-t border-white/5">
        Solar-Powered IoT Seismic Intensity Monitoring and Early Warning System
        {" · "}
        ESP32 + MPU6050 + Firebase RTDB
        {" · "}
        Capstone Research Project
      </footer>
    </main>
  );
}
