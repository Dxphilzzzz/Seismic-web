"use client";

import { FormEvent, useState } from "react";
import {
  ClipboardList,
  Megaphone,
  Pencil,
  Send,
  Trash2,
  X,
} from "lucide-react";
import type { ActivityLogEntry, Announcement, AnnouncementTone } from "@/types";
import { formatTimestamp, cn } from "@/utils";

export function AdminAnnouncements({
  view,
  onClose,
  onPublish,
  onUpdate,
  onRemove,
  announcements,
  activities,
  isDarkMode,
}: {
  view: "announcements" | "activities";
  onClose: () => void;
  onPublish: (input: {
    title: string;
    message: string;
    tone: AnnouncementTone;
  }) => Promise<void>;
  onUpdate: (
    id: string,
    input: { title: string; message: string; tone: AnnouncementTone },
  ) => Promise<void>;
  onRemove: (id: string, title: string) => Promise<void>;
  announcements: Announcement[];
  activities: ActivityLogEntry[];
  isDarkMode: boolean;
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<AnnouncementTone>("maintenance");
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPublishing(true);
    try {
      const input = { title: title.trim(), message: message.trim(), tone };
      if (editingId) await onUpdate(editingId, input);
      else await onPublish(input);
      setTitle("");
      setMessage("");
      setEditingId(null);
    } catch {
      setError(
        "Unable to publish. Check the Firebase database configuration and rules.",
      );
    } finally {
      setPublishing(false);
    }
  }
  const panel = isDarkMode
    ? "border-white/10 bg-slate-900/80"
    : "border-slate-200 bg-white";
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl border p-5 shadow-2xl",
          panel,
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold">
            {view === "announcements" ? "Announcements" : "Activity logs"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4">
          <section
            id="announcements"
            className={cn(
              "rounded-2xl border p-5 shadow-sm",
              panel,
              view !== "announcements" && "hidden",
            )}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-sky-500/10 p-2 text-sky-400">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">
                  {editingId ? "Edit announcement" : "Make an announcement"}
                </h2>
                <p className="text-xs text-slate-500">
                  Published notices appear immediately on the public dashboard.
                </p>
              </div>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={80}
                placeholder="Title (e.g. Scheduled maintenance)"
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-sky-400",
                  isDarkMode
                    ? "border-white/10 bg-slate-950 text-white"
                    : "border-slate-200 bg-slate-50",
                )}
              />
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                maxLength={280}
                rows={3}
                placeholder="What should the public know?"
                className={cn(
                  "w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-sky-400",
                  isDarkMode
                    ? "border-white/10 bg-slate-950 text-white"
                    : "border-slate-200 bg-slate-50",
                )}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <select
                  value={tone}
                  onChange={(event) =>
                    setTone(event.target.value as AnnouncementTone)
                  }
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm",
                    isDarkMode
                      ? "border-white/10 bg-slate-950 text-white"
                      : "border-slate-200 bg-slate-50",
                  )}
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                </select>
                <button
                  disabled={publishing}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {publishing
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Publish"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setTitle("");
                      setMessage("");
                      setTone("maintenance");
                    }}
                    className="text-sm text-slate-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </form>
            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Published announcements
              </p>
              {announcements.length ? (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={cn(
                      "rounded-xl p-3 text-sm",
                      isDarkMode ? "bg-white/5" : "bg-slate-50",
                    )}
                  >
                    <p className="font-medium">{announcement.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {announcement.message}
                    </p>
                    <div className="mt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(announcement.id);
                          setTitle(announcement.title);
                          setMessage(announcement.message);
                          setTone(announcement.tone);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-sky-500"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Remove “${announcement.title}” from the public dashboard?`,
                            )
                          )
                            void onRemove(announcement.id, announcement.title);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No announcements published.
                </p>
              )}
            </div>
          </section>
          <section
            id="activities"
            className={cn(
              "rounded-2xl border p-5 shadow-sm",
              panel,
              view !== "activities" && "hidden",
            )}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/10 p-2 text-violet-400">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Activities</h2>
                <p className="text-xs text-slate-500">
                  Recent administrator actions
                </p>
              </div>
            </div>
            <div className="max-h-64 space-y-2 overflow-auto pr-1">
              {activities.length ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={cn(
                      "rounded-xl p-3 text-sm",
                      isDarkMode ? "bg-white/5" : "bg-slate-50",
                    )}
                  >
                    <p>{activity.message}</p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">
                      {formatTimestamp(activity.timestamp)} · {activity.actor}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">
                  No activities yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
