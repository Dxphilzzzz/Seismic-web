"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/dashboard/LoadingScreen";

const Dashboard = dynamic(
  () => import("@/components/dashboard/Dashboard"),
  { ssr: false, loading: () => <LoadingScreen /> }
);

export default function Page() {
  return <Dashboard />;
}
