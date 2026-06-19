import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Seismic Monitoring Dashboard",
  description:
    "Solar-Powered IoT Seismic Intensity Monitoring and Early Warning System",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "#F9FAFB",
            },
          }}
        />
      </body>
    </html>
  );
}
