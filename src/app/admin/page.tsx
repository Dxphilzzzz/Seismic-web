"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/dashboard/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useSensors } from "@/hooks/useSensors";
import { useAdminAlerts } from "@/hooks/useAdminAlerts";

const Dashboard = dynamic(() => import("@/components/dashboard/Dashboard"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthLoading, logOut } = useAuth();
  const { sensors, now } = useSensors();
  const { alerts, toasts, dismissToast } = useAdminAlerts(sensors, user);

  useEffect(() => {
    if (!isAuthLoading && !user) router.replace("/admin/login");
  }, [isAuthLoading, router, user]);

  if (isAuthLoading || !user) return <LoadingScreen />;

  return (
    <Dashboard
      role="admin"
      user={user}
      sensors={sensors}
      sensorNow={now}
      alerts={alerts}
      toasts={toasts}
      onDismissToast={dismissToast}
      onLogout={async () => {
        await logOut();
        router.replace("/admin/login");
      }}
    />
  );
}
