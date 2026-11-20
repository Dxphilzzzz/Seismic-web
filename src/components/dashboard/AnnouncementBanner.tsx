"use client";

import { CircleAlert, Info, Wrench } from "lucide-react";
import type { Announcement } from "@/types";
import { cn } from "@/utils";

export function AnnouncementBanner({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const active = announcements.filter((announcement) => announcement.active);
  if (!active.length) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-4 md:px-6 lg:px-8">
      {active.slice(0, 1).map((announcement) => {
        const Icon =
          announcement.tone === "maintenance"
            ? Wrench
            : announcement.tone === "warning"
              ? CircleAlert
              : Info;
        const colors =
          announcement.tone === "warning"
            ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
            : announcement.tone === "maintenance"
              ? "border-sky-400/30 bg-sky-500/10 text-sky-100"
              : "border-indigo-400/30 bg-indigo-500/10 text-indigo-100";
        return (
          <div
            key={announcement.id}
            className={cn("flex gap-3 rounded-2xl border px-4 py-3", colors)}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-bold">{announcement.title}</p>
              <p className="mt-0.5 text-sm opacity-90">
                {announcement.message}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
