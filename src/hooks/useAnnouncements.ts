"use client";

import { useCallback, useEffect, useState } from "react";
import {
  limitToLast,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "@/lib/firebase";
import type { ActivityLogEntry, Announcement, AnnouncementTone } from "@/types";
import { normalizeTimestamp } from "@/utils";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    if (!db) return;
    const announcementsQuery = query(
      ref(db, "/announcements"),
      orderByChild("createdAt"),
      limitToLast(20),
    );
    const activitiesQuery = query(
      ref(db, "/activityLogs"),
      orderByChild("timestamp"),
      limitToLast(50),
    );
    const stopAnnouncements = onValue(announcementsQuery, (snapshot) => {
      const value = snapshot.val() as Record<
        string,
        Omit<Announcement, "id">
      > | null;
      setAnnouncements(
        value
          ? Object.entries(value)
              .map(([id, entry]) => ({
                ...entry,
                id,
                createdAt: normalizeTimestamp(entry.createdAt),
              }))
              .sort((a, b) => b.createdAt - a.createdAt)
          : [],
      );
    });
    const stopActivities = onValue(activitiesQuery, (snapshot) => {
      const value = snapshot.val() as Record<
        string,
        Omit<ActivityLogEntry, "id">
      > | null;
      setActivities(
        value
          ? Object.entries(value)
              .map(([id, entry]) => ({
                ...entry,
                id,
                timestamp: normalizeTimestamp(entry.timestamp),
              }))
              .sort((a, b) => b.timestamp - a.timestamp)
          : [],
      );
    });
    return () => {
      stopAnnouncements();
      stopActivities();
    };
  }, []);

  const createAnnouncement = useCallback(
    async ({
      title,
      message,
      tone,
      actor,
    }: {
      title: string;
      message: string;
      tone: AnnouncementTone;
      actor: string;
    }) => {
      if (!db) throw new Error("Firebase database is not configured.");
      const timestamp = Date.now();
      const announcementRef = push(ref(db, "/announcements"));
      const activityRef = push(ref(db, "/activityLogs"));
      await Promise.all([
        set(announcementRef, {
          title,
          message,
          tone,
          active: true,
          createdAt: timestamp,
          createdBy: actor,
        }),
        set(activityRef, {
          type: "announcement_created",
          message: `Published announcement: ${title}`,
          timestamp,
          actor,
        }),
      ]);
    },
    [],
  );

  const updateAnnouncement = useCallback(
    async ({
      id,
      title,
      message,
      tone,
      actor,
    }: {
      id: string;
      title: string;
      message: string;
      tone: AnnouncementTone;
      actor: string;
    }) => {
      if (!db) throw new Error("Firebase database is not configured.");
      const timestamp = Date.now();
      await Promise.all([
        update(ref(db, `/announcements/${id}`), { title, message, tone }),
        set(push(ref(db, "/activityLogs")), {
          type: "announcement_updated",
          message: `Updated announcement: ${title}`,
          timestamp,
          actor,
        }),
      ]);
    },
    [],
  );

  const removeAnnouncement = useCallback(
    async ({
      id,
      title,
      actor,
    }: {
      id: string;
      title: string;
      actor: string;
    }) => {
      if (!db) throw new Error("Firebase database is not configured.");
      const timestamp = Date.now();
      await Promise.all([
        remove(ref(db, `/announcements/${id}`)),
        set(push(ref(db, "/activityLogs")), {
          type: "announcement_removed",
          message: `Removed announcement: ${title}`,
          timestamp,
          actor,
        }),
      ]);
    },
    [],
  );

  return {
    announcements,
    activities,
    createAnnouncement,
    updateAnnouncement,
    removeAnnouncement,
  };
}
